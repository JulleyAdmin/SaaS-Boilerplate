import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { createAuditLog } from '@/libs/audit';
import { db } from '@/libs/DB';
import { Env } from '@/libs/Env';
import { createBillingPortalSession } from '@/libs/Stripe';
import { organizationSchema } from '@/models/Schema';

export async function POST() {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
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

    if (!organization.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please subscribe to a plan first.' },
        { status: 400 },
      );
    }

    // Create billing portal session
    const returnUrl = `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing`;

    const session = await createBillingPortalSession({
      customerId: organization.stripeCustomerId,
      returnUrl,
    });

    // Create audit log
    await createAuditLog({
      organizationId: orgId,
      actorId: userId,
      actorName: 'User',
      action: 'billing.portal.accessed',
      crud: 'read',
      resource: 'billing_portal',
      resourceId: session.id,
      metadata: {
        customerId: organization.stripeCustomerId,
      },
    });

    return NextResponse.json({
      portalUrl: session.url,
    });
  } catch (error) {
    console.error('Billing portal session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 },
    );
  }
}
