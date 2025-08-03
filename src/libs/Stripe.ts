import Stripe from 'stripe';

import { Env } from '@/libs/Env';
import { HOSPITAL_PLANS, USAGE_METRICS } from '@/utils/pricing';

// Initialize Stripe with API version
export const stripe = new Stripe(Env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Helper to create Stripe customer
export async function createStripeCustomer({
  organizationId,
  email,
  name,
  metadata = {},
}: {
  organizationId: string;
  email?: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId,
      ...metadata,
    },
  });

  return customer;
}

// Helper to create checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  organizationId,
  trialDays,
  metadata = {},
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  organizationId: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: trialDays,
      metadata: {
        organizationId,
        ...metadata,
      },
    },
    metadata: {
      organizationId,
      ...metadata,
    },
  });

  return session;
}

// Helper to create billing portal session
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Helper to cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false,
) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: !immediately,
  });

  if (immediately) {
    await stripe.subscriptions.cancel(subscriptionId);
  }

  return subscription;
}

// Helper to update subscription
export async function updateSubscription({
  subscriptionId,
  priceId,
  prorationBehavior = 'create_prorations',
}: {
  subscriptionId: string;
  priceId: string;
  prorationBehavior?: Stripe.SubscriptionUpdateParams.ProrationBehavior;
}) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: prorationBehavior,
  });

  return updatedSubscription;
}

// Helper to report usage for metered billing
export async function reportUsage({
  subscriptionItemId,
  quantity,
  timestamp = Math.floor(Date.now() / 1000),
  action = 'increment',
}: {
  subscriptionItemId: string;
  quantity: number;
  timestamp?: number;
  action?: 'increment' | 'set';
}) {
  const usageRecord = await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity,
      timestamp,
      action,
    },
  );

  return usageRecord;
}

// Helper to get subscription details with expanded data
export async function getSubscriptionDetails(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['customer', 'default_payment_method', 'items.data.price.product'],
  });

  return subscription;
}

// Helper to list invoices for an organization
export async function listInvoices({
  customerId,
  limit = 10,
  startingAfter,
}: {
  customerId: string;
  limit?: number;
  startingAfter?: string;
}) {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
    starting_after: startingAfter,
  });

  return invoices;
}

// Helper to sync products and prices from config
export async function syncProductsAndPrices() {
  const products: Record<string, Stripe.Product> = {};
  const prices: Record<string, Stripe.Price> = {};

  // Create or update products for each plan
  for (const [key, plan] of Object.entries(HOSPITAL_PLANS)) {
    if (plan.price === 'custom') {
      continue;
    }

    // Create or update product
    const productData = {
      name: `${plan.name} Plan`,
      description: plan.description,
      metadata: {
        plan: key,
        features: JSON.stringify(plan.features),
      },
    };

    let product: Stripe.Product;

    // Check if product exists
    const existingProducts = await stripe.products.search({
      query: `metadata['plan']:'${key}'`,
    });

    if (existingProducts.data.length > 0) {
      product = await stripe.products.update(
        existingProducts.data[0].id,
        productData,
      );
    } else {
      product = await stripe.products.create({
        ...productData,
        id: `prod_hospital_${key.toLowerCase()}`,
      });
    }

    products[key] = product;

    // Create price if it doesn't exist
    if (plan.stripePriceId) {
      try {
        const price = await stripe.prices.retrieve(plan.stripePriceId);
        prices[key] = price;
      } catch (error) {
        // Price doesn't exist, create it
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price as number * 100, // Convert to cents
          currency: plan.currency || 'usd',
          recurring: {
            interval: plan.interval || 'month',
          },
          metadata: {
            plan: key,
          },
        });
        prices[key] = price;

        console.log(`Created Stripe price for ${key}: ${price.id}`);
        console.log(`Add this to your .env: NEXT_PUBLIC_STRIPE_${key}_PRICE_ID=${price.id}`);
      }
    }
  }

  // Create usage-based prices
  for (const [key, metric] of Object.entries(USAGE_METRICS)) {
    const productData = {
      name: metric.name,
      unit_label: metric.unit,
      metadata: {
        metric: key,
      },
    };

    let product: Stripe.Product;

    // Check if product exists
    const existingProducts = await stripe.products.search({
      query: `metadata['metric']:'${key}'`,
    });

    if (existingProducts.data.length > 0) {
      product = await stripe.products.update(
        existingProducts.data[0].id,
        productData,
      );
    } else {
      product = await stripe.products.create({
        ...productData,
        id: `prod_usage_${key.toLowerCase()}`,
      });
    }

    // Create metered price if it doesn't exist
    if (metric.stripePriceId) {
      try {
        await stripe.prices.retrieve(metric.stripePriceId);
      } catch (error) {
        // Price doesn't exist, create it
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount_decimal: (metric.unitAmount * 100).toString(), // Convert to cents
          currency: 'usd',
          recurring: {
            interval: 'month',
            usage_type: 'metered',
            aggregate_usage: 'sum',
          },
          metadata: {
            metric: key,
          },
        });

        console.log(`Created Stripe metered price for ${key}: ${price.id}`);
        console.log(`Add this to your .env: STRIPE_${key}_PRICE_ID=${price.id}`);
      }
    }
  }

  return { products, prices };
}

// Webhook signature verification
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string,
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// Export types
export type { Stripe };
export type StripeSubscription = Stripe.Subscription;
export type StripeCustomer = Stripe.Customer;
export type StripeInvoice = Stripe.Invoice;
export type StripeCheckoutSession = Stripe.Checkout.Session;
