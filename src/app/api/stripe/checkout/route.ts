import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createAuditLog } from '@/libs/audit';
import { db } from '@/libs/DB';
import { Env } from '@/libs/Env';
import { createCheckoutSession, createStripeCustomer } from '@/libs/Stripe';
import { organizationSchema } from '@/models/Schema';
import { HOSPITAL_PLANS, TRIAL_PERIOD_DAYS } from '@/utils/pricing';

export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { priceId, planKey } = await request.json();

    if (!priceId || !planKey) {
      return NextResponse.json(
        { error: 'Price ID and plan key are required' },
        { status: 400 },
      );
    }

    // Validate plan exists
    const plan = HOSPITAL_PLANS[planKey];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 },
      );
    }

    // Get organization
    const [organization] = await db
      .select()
      .from(organizationSchema)
      .where(eq(organizationSchema.id, orgId))
      .limit(1);

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 },
      );
    }

    // Check if organization already has a subscription
    if (organization.stripeSubscriptionId && organization.stripeSubscriptionStatus === 'active') {
      return NextResponse.json(
        { error: 'Organization already has an active subscription' },
        { status: 400 },
      );
    }

    // Create or retrieve Stripe customer
    let customerId = organization.stripeCustomerId;

    if (!customerId) {
      // Get organization details from Clerk
      const orgResponse = await fetch(
        `https://api.clerk.com/v1/organizations/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${Env.CLERK_SECRET_KEY}`,
          },
        },
      );

      const orgData = await orgResponse.json();

      const customer = await createStripeCustomer({
        organizationId: orgId,
        email: orgData.emailAddress,
        name: orgData.name,
        metadata: {
          clerkOrgId: orgId,
          hospitalPlan: planKey,
        },
      });

      customerId = customer.id;

      // Update organization with customer ID
      await db
        .update(organizationSchema)
        .set({ stripeCustomerId: customerId })
        .where(eq(organizationSchema.id, orgId));
    }

    // Create checkout session
    const successUrl = `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing?success=true`;
    const cancelUrl = `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing?canceled=true`;

    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl,
      cancelUrl,
      organizationId: orgId,
      trialDays: TRIAL_PERIOD_DAYS,
      metadata: {
        userId,
        planKey,
      },
    });

    // Create audit log
    await createAuditLog({
      organizationId: orgId,
      actorId: userId,
      actorName: 'User',
      action: 'billing.checkout.initiated',
      crud: 'create',
      resource: 'billing',
      resourceId: session.id,
      metadata: {
        planKey,
        priceId,
        trialDays: TRIAL_PERIOD_DAYS,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
