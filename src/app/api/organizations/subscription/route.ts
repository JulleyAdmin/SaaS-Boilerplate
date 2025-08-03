import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { getSubscriptionDetails } from '@/libs/Stripe';
import { organizationSchema, subscription } from '@/models/Schema';
import { getPlanByPriceId } from '@/utils/pricing';

export async function GET() {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Get organization subscription
    const [org] = await db
      .select()
      .from(organizationSchema)
      .where(eq(organizationSchema.id, orgId))
      .limit(1);

    if (!org || !org.stripeSubscriptionId) {
      return NextResponse.json(null);
    }

    // Get subscription details from database
    const [dbSubscription] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.stripeSubscriptionId, org.stripeSubscriptionId))
      .limit(1);

    if (!dbSubscription) {
      return NextResponse.json(null);
    }

    // Get additional details from Stripe if needed
    try {
      await getSubscriptionDetails(org.stripeSubscriptionId);
    } catch (error) {
      console.error('Failed to fetch Stripe subscription:', error);
    }

    // Get plan details
    const plan = getPlanByPriceId(dbSubscription.stripePriceId || '');

    // Calculate usage (mock data for now - would come from usage tracking)
    const usage = {
      apiCalls: Math.floor(Math.random() * 5000),
      storage: Math.floor(Math.random() * 10),
      dataTransfer: Math.floor(Math.random() * 50),
    };

    return NextResponse.json({
      id: dbSubscription.stripeSubscriptionId,
      status: dbSubscription.status,
      currentPeriodEnd: dbSubscription.currentPeriodEnd,
      cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd,
      plan: {
        name: plan?.name || 'Unknown',
        price: plan?.price || 0,
        interval: plan?.interval || 'month',
      },
      usage,
      limits: {
        departments: dbSubscription.departmentLimit,
        users: dbSubscription.userLimit,
        storage: dbSubscription.storageLimit,
        apiCalls: dbSubscription.apiCallLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 },
    );
  }
}
