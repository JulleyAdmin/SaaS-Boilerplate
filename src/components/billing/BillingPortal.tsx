'use client';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  CreditCard,
  Download,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
// import { HOSPITAL_PLANS } from '@/utils/pricing';

type Subscription = {
  id: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  plan: {
    name: string;
    price: number;
    interval: string;
  };
  usage?: {
    apiCalls: number;
    storage: number;
    dataTransfer: number;
  };
};

type Invoice = {
  id: string;
  status: string;
  amountPaid: number;
  currency: string;
  paidAt: Date;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
};

export function BillingPortal() {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/organizations/subscription');
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, []);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/organizations/invoices');
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        }
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setLoadingInvoices(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleOpenPortal = async () => {
    setLoadingPortal(true);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to open billing portal');
      }

      const { portalUrl } = await response.json();
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Portal error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to open billing portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      trialing: 'secondary',
      canceled: 'destructive',
      past_due: 'destructive',
      unpaid: 'destructive',
      paused: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loadingSubscription) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Overview</CardTitle>
              <CardDescription>
                Manage your HospitalOS subscription and billing
              </CardDescription>
            </div>
            <Button
              onClick={handleOpenPortal}
              disabled={loadingPortal}
              variant="outline"
            >
              {loadingPortal
                ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading...
                    </>
                  )
                : (
                    <>
                      <CreditCard className="mr-2 size-4" />
                      Manage Billing
                    </>
                  )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subscription
            ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-2xl font-bold">{subscription.plan.name}</p>
                    </div>
                    {getStatusBadge(subscription.status)}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Billing Period</p>
                      <p className="font-medium">
                        $
                        {subscription.plan.price}
                        /
                        {subscription.plan.interval}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Billing Date</p>
                      <p className="flex items-center font-medium">
                        <Calendar className="mr-1 size-4" />
                        {formatDistanceToNow(new Date(subscription.currentPeriodEnd), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Auto-Renewal</p>
                      <p className="font-medium">
                        {subscription.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}
                      </p>
                    </div>
                  </div>

                  {subscription.cancelAtPeriodEnd && (
                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertTitle>Subscription Ending</AlertTitle>
                      <AlertDescription>
                        Your subscription will end on
                        {' '}
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        .
                        Renew to keep access to all features.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )
            : (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertTitle>No Active Subscription</AlertTitle>
                  <AlertDescription>
                    Choose a plan to get started with HospitalOS.
                  </AlertDescription>
                </Alert>
              )}
        </CardContent>
      </Card>

      {/* Usage Overview */}
      {subscription?.usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your usage against plan limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">API Calls</p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.usage.apiCalls.toLocaleString()}
                    {' '}
                    / 10,000
                  </p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(subscription.usage.apiCalls / 10000) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Storage</p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.usage.storage}
                    {' '}
                    GB / 25 GB
                  </p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(subscription.usage.storage / 25) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Data Transfer</p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.usage.dataTransfer}
                    {' '}
                    GB / 100 GB
                  </p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(subscription.usage.dataTransfer / 100) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            Download invoices for your records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingInvoices
            ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )
            : invoices && invoices.length > 0
              ? (
                  <div className="space-y-2">
                    {invoices.map(invoice => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            $
                            {(invoice.amountPaid / 100).toFixed(2)}
                            {' '}
                            {invoice.currency.toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Paid on
                            {' '}
                            {new Date(invoice.paidAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(invoice.status)}
                          {invoice.hostedInvoiceUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(invoice.hostedInvoiceUrl, '_blank')}
                            >
                              <ExternalLink className="size-4" />
                            </Button>
                          )}
                          {invoice.invoicePdf && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(invoice.invoicePdf, '_blank')}
                            >
                              <Download className="size-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No invoices yet
                  </p>
                )}
        </CardContent>
      </Card>
    </div>
  );
}
