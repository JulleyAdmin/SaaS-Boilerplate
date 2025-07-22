import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PricingPlans } from '@/components/billing/PricingPlans';
import { BillingPortal } from '@/components/billing/BillingPortal';
import { db } from '@/libs/DB';
import { organizationSchema, subscription } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { getPlanByPriceId } from '@/utils/pricing';

export default async function BillingPage() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    redirect('/sign-in');
  }

  // Get current subscription
  const [org] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.id, orgId))
    .limit(1);

  let currentPlan = null;
  if (org?.stripeSubscriptionId) {
    const [sub] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.stripeSubscriptionId, org.stripeSubscriptionId))
      .limit(1);
    
    if (sub && sub.status === 'active') {
      const plan = getPlanByPriceId(sub.stripePriceId || '');
      currentPlan = Object.entries(HOSPITAL_PLANS).find(([_, p]) => p === plan)?.[0] || null;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your HospitalOS subscription and billing information
        </p>
      </div>

      <Tabs defaultValue={currentPlan ? 'manage' : 'plans'} className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="manage">Manage Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-4">
          <PricingPlans currentPlan={currentPlan || undefined} />
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4">
          <Suspense fallback={<div>Loading billing information...</div>}>
            <BillingPortal />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import at the top after other imports
import { HOSPITAL_PLANS } from '@/utils/pricing';