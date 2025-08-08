'use client';

import { BillingAnalytics } from '@/components/billing/BillingAnalytics';

export default function BillingAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing Analytics</h1>
        <p className="text-muted-foreground">
          Revenue insights, payment trends, and financial performance metrics
        </p>
      </div>

      <BillingAnalytics dateRange={{}} />
    </div>
  );
}
