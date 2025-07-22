import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { constructWebhookEvent } from '@/libs/Stripe';
import { Env } from '@/libs/Env';
import { db } from '@/libs/DB';
import { subscription, invoice, organizationSchema, securityEvents } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { createAuditLog } from '@/libs/audit';
import { getPlanByPriceId } from '@/utils/pricing';
import { sendSystemNotification } from '@/libs/email/client';
import { SubscriptionWelcomeEmail } from '@/libs/email/templates/SubscriptionWelcomeEmail';
import type { Stripe } from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    const webhookSecret = Env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    event = constructWebhookEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) return;

  const organizationId = session.metadata?.organizationId;
  if (!organizationId) {
    console.error('No organizationId in checkout session metadata');
    return;
  }

  // Update organization with Stripe customer ID
  await db
    .update(organizationSchema)
    .set({
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
    })
    .where(eq(organizationSchema.id, organizationId));

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: session.metadata?.userId || 'system',
    actorName: 'System',
    action: 'billing.subscription.created',
    crud: 'create',
    resource: 'subscription',
    resourceId: session.subscription as string,
    metadata: {
      customerId: session.customer,
      sessionId: session.id,
    },
  });
}

async function handleSubscriptionChange(stripeSubscription: Stripe.Subscription) {
  const organizationId = stripeSubscription.metadata?.organizationId;
  if (!organizationId) {
    console.error('No organizationId in subscription metadata');
    return;
  }

  const priceId = stripeSubscription.items.data[0]?.price.id;
  const plan = priceId ? getPlanByPriceId(priceId) : undefined;

  // Check if subscription exists
  const existingSubscription = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
    .limit(1);

  if (existingSubscription.length > 0) {
    // Update existing subscription
    await db
      .update(subscription)
      .set({
        status: stripeSubscription.status as any,
        stripePriceId: priceId,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        // Update limits based on plan
        ...(plan && {
          departmentLimit: typeof plan.features.departments === 'number' ? plan.features.departments : 9999,
          userLimit: typeof plan.features.users === 'number' ? plan.features.users : 9999,
          storageLimit: typeof plan.features.storage === 'number' ? plan.features.storage : 9999,
          apiCallLimit: plan.features.apiRateLimit || 10000,
        }),
      })
      .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id));
  } else {
    // Create new subscription record
    await db.insert(subscription).values({
      organizationId,
      stripeCustomerId: stripeSubscription.customer as string,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: priceId,
      status: stripeSubscription.status as any,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      // Set limits based on plan
      ...(plan && {
        departmentLimit: typeof plan.features.departments === 'number' ? plan.features.departments : 9999,
        userLimit: typeof plan.features.users === 'number' ? plan.features.users : 9999,
        storageLimit: typeof plan.features.storage === 'number' ? plan.features.storage : 9999,
        apiCallLimit: plan.features.apiRateLimit || 10000,
      }),
    });
  }

  // Update organization
  await db
    .update(organizationSchema)
    .set({
      stripeSubscriptionId: stripeSubscription.id,
      stripeSubscriptionStatus: stripeSubscription.status,
      stripeSubscriptionPriceId: priceId,
      stripeSubscriptionCurrentPeriodEnd: stripeSubscription.current_period_end,
    })
    .where(eq(organizationSchema.stripeCustomerId, stripeSubscription.customer as string));

  // Hospital-specific onboarding for new subscriptions
  if (stripeSubscription.status === 'active' && existingSubscription.length === 0) {
    await createHospitalOnboardingTasks(organizationId, plan?.name || 'CLINIC');
    
    // Send welcome email for new subscriptions
    await sendSubscriptionWelcomeEmail(organizationId, plan?.name || 'CLINIC');
  }

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: 'system',
    actorName: 'System',
    action: existingSubscription.length > 0 ? 'billing.subscription.updated' : 'billing.subscription.created',
    crud: existingSubscription.length > 0 ? 'update' : 'create',
    resource: 'subscription',
    resourceId: stripeSubscription.id,
    metadata: {
      status: stripeSubscription.status,
      priceId,
      planName: plan?.name,
    },
  });
}

async function handleSubscriptionCancellation(stripeSubscription: Stripe.Subscription) {
  const organizationId = stripeSubscription.metadata?.organizationId;
  if (!organizationId) return;

  // Update subscription status
  await db
    .update(subscription)
    .set({
      status: 'canceled',
      cancelAtPeriodEnd: true,
    })
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id));

  // Update organization
  await db
    .update(organizationSchema)
    .set({
      stripeSubscriptionStatus: 'canceled',
    })
    .where(eq(organizationSchema.id, organizationId));

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: 'system',
    actorName: 'System',
    action: 'billing.subscription.canceled',
    crud: 'update',
    resource: 'subscription',
    resourceId: stripeSubscription.id,
    metadata: {
      canceledAt: new Date().toISOString(),
    },
  });

  // Schedule data archival (to be implemented)
  await scheduleDataArchival(organizationId, stripeSubscription.current_period_end);
}

async function handleInvoicePaid(stripeInvoice: Stripe.Invoice) {
  const organizationId = stripeInvoice.subscription_details?.metadata?.organizationId ||
                        stripeInvoice.metadata?.organizationId;
  
  if (!organizationId) {
    console.error('No organizationId in invoice metadata');
    return;
  }

  // Create or update invoice record
  const existingInvoice = await db
    .select()
    .from(invoice)
    .where(eq(invoice.stripeInvoiceId, stripeInvoice.id))
    .limit(1);

  if (existingInvoice.length === 0) {
    await db.insert(invoice).values({
      organizationId,
      stripeInvoiceId: stripeInvoice.id,
      stripeCustomerId: stripeInvoice.customer as string,
      stripeSubscriptionId: stripeInvoice.subscription as string,
      amountPaid: stripeInvoice.amount_paid,
      amountDue: stripeInvoice.amount_due,
      currency: stripeInvoice.currency,
      status: stripeInvoice.status || 'paid',
      paidAt: stripeInvoice.status_transitions?.paid_at 
        ? new Date(stripeInvoice.status_transitions.paid_at * 1000)
        : new Date(),
      hostedInvoiceUrl: stripeInvoice.hosted_invoice_url || undefined,
      invoicePdf: stripeInvoice.invoice_pdf || undefined,
      receiptNumber: stripeInvoice.receipt_number || undefined,
      metadata: {
        lines: stripeInvoice.lines.data.map(line => ({
          description: line.description,
          amount: line.amount,
          quantity: line.quantity,
        })),
      },
    });
  }

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: 'system',
    actorName: 'System',
    action: 'billing.invoice.paid',
    crud: 'update',
    resource: 'invoice',
    resourceId: stripeInvoice.id,
    metadata: {
      amountPaid: stripeInvoice.amount_paid,
      currency: stripeInvoice.currency,
    },
  });
}

async function handleInvoicePaymentFailed(stripeInvoice: Stripe.Invoice) {
  const organizationId = stripeInvoice.subscription_details?.metadata?.organizationId ||
                        stripeInvoice.metadata?.organizationId;
  
  if (!organizationId) return;

  // Update subscription status if needed
  if (stripeInvoice.subscription) {
    await db
      .update(subscription)
      .set({
        status: 'past_due',
      })
      .where(eq(subscription.stripeSubscriptionId, stripeInvoice.subscription as string));
  }

  // Create security event for failed payment
  await db.insert(securityEvents).values({
    organizationId,
    eventType: 'payment_failed',
    severity: 'high',
    description: `Payment failed for invoice ${stripeInvoice.number || stripeInvoice.id}`,
    metadata: {
      invoiceId: stripeInvoice.id,
      amountDue: stripeInvoice.amount_due,
      attemptCount: stripeInvoice.attempt_count,
    },
  });

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: 'system',
    actorName: 'System',
    action: 'billing.payment.failed',
    crud: 'update',
    resource: 'invoice',
    resourceId: stripeInvoice.id,
    success: false,
    errorMessage: 'Payment failed',
    metadata: {
      amountDue: stripeInvoice.amount_due,
      currency: stripeInvoice.currency,
      attemptCount: stripeInvoice.attempt_count,
    },
  });
}

async function createHospitalOnboardingTasks(organizationId: string, planName: string) {
  // This would create onboarding tasks based on the plan
  // For now, just log
  console.log(`Creating onboarding tasks for ${organizationId} on ${planName} plan`);
  
  // TODO: Implement actual onboarding workflow
  // - Send welcome email
  // - Create default departments
  // - Set up initial user roles
  // - Schedule training session for Enterprise plans
}

async function scheduleDataArchival(organizationId: string, archiveAfter: number) {
  // This would schedule data archival after subscription ends
  const archiveDate = new Date(archiveAfter * 1000);
  console.log(`Scheduling data archival for ${organizationId} after ${archiveDate}`);
  
  // TODO: Implement data archival workflow
  // - Export all data to secure storage
  // - Remove PHI after grace period
  // - Maintain audit logs per compliance requirements
}

async function sendSubscriptionWelcomeEmail(organizationId: string, planName: string) {
  try {
    // Get organization details (in real implementation, fetch from Clerk)
    const hospitalName = organizationId; // Placeholder
    const administratorEmail = 'admin@hospital.com'; // Placeholder
    const administratorName = 'Hospital Administrator'; // Placeholder
    
    const loginUrl = `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard`;
    const setupGuideUrl = `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/docs/setup`;
    
    await sendSystemNotification({
      to: administratorEmail,
      subject: `Welcome to HospitalOS! Your ${planName} subscription is active`,
      template: SubscriptionWelcomeEmail({
        hospitalName,
        administratorName,
        planName,
        loginUrl,
        setupGuideUrl,
        supportEmail: 'support@hospitalos.com',
      }),
      notificationType: 'onboarding',
      organizationId,
      actorId: 'system',
      tags: ['welcome', 'subscription', `plan:${planName}`],
      metadata: {
        planName,
        subscriptionEvent: 'activated',
      },
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - email failures shouldn't break webhook processing
  }
}

