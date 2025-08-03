'use client';

import { AlertCircle, CreditCard, FileText, Plus, Receipt, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { BillingAnalytics } from '@/components/billing/BillingAnalytics';
import { BillingFilters } from '@/components/billing/BillingFilters';
import { CreateInvoiceDialog } from '@/components/billing/CreateInvoiceDialog';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { PaymentGatewaySettings } from '@/components/billing/PaymentGatewaySettings';
import { PaymentList } from '@/components/billing/PaymentList';
import { RecordPaymentDialog } from '@/components/billing/RecordPaymentDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBillingReports, useInvoices } from '@/hooks/api/useBilling';
import { formatCurrency } from '@/utils/format';

export default function BillingPage() {
  const t = useTranslations('billing');
  const [selectedDateRange, setSelectedDateRange] = useState({ from: undefined, to: undefined });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useInvoices({
    status: selectedStatus === 'all' ? undefined : selectedStatus as any,
    invoiceNumber: searchQuery || undefined,
    dateFrom: selectedDateRange.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange.to?.toISOString().split('T')[0],
    includePatient: true,
    includeItems: true,
    includePayments: true,
  });

  const { data: reportsData, isLoading: analyticsLoading } = useBillingReports({
    reportType: 'revenue_summary',
    dateFrom: selectedDateRange.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange.to?.toISOString().split('T')[0],
  });

  const invoices = invoicesData?.data || [];
  const summary = invoicesData?.summary;
  const analytics = reportsData?.data;

  const handleRecordPayment = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsRecordPaymentOpen(true);
  };

  // Calculate recent payments from all invoices
  const recentPayments = invoices
    .flatMap(invoice => invoice.payments || [])
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('billingManagement')}</h1>
          <p className="text-muted-foreground">{t('manageBillingDescription')}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateInvoiceOpen(true)}>
            <Plus className="mr-2 size-4" />
            {t('createInvoice')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analytics?.totalRevenue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.revenueChange > 0 ? '+' : ''}
                      {analytics?.revenueChange || 0}
                      %
                      {t('fromLastPeriod')}
                    </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingInvoices')}</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {invoicesLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold">{summary?.byStatus?.pending || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(summary?.revenue?.pending || 0)}
                      {' '}
                      {t('pending')}
                    </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('paidInvoices')}</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {invoicesLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold">{summary?.byStatus?.paid || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(summary?.revenue?.paid || 0)}
                      {' '}
                      {t('collected')}
                    </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('overdueInvoices')}</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {invoicesLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold text-red-600">
                      {summary?.byStatus?.overdue || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(summary?.revenue?.overdue || 0)}
                      {' '}
                      {t('overdue')}
                    </p>
                  </>
                )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <BillingFilters
        dateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        status={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">{t('invoices')}</TabsTrigger>
          <TabsTrigger value="payments">{t('payments')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
          <TabsTrigger value="settings">{t('paymentSettings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>{t('invoices')}</CardTitle>
              <CardDescription>{t('invoicesDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {invoicesError
                ? (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{t('errorLoadingInvoices')}</AlertDescription>
                    </Alert>
                  )
                : (
                    <InvoiceList
                      invoices={invoices}
                      isLoading={invoicesLoading}
                      onRecordPayment={handleRecordPayment}
                    />
                  )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>{t('paymentHistory')}</CardTitle>
              <CardDescription>{t('paymentHistoryDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentList
                payments={recentPayments}
                isLoading={invoicesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <BillingAnalytics
            dateRange={selectedDateRange}
            isLoading={analyticsLoading}
          />
        </TabsContent>

        <TabsContent value="settings">
          <PaymentGatewaySettings />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateInvoiceDialog
        open={isCreateInvoiceOpen}
        onOpenChange={setIsCreateInvoiceOpen}
      />

      <RecordPaymentDialog
        open={isRecordPaymentOpen}
        onOpenChange={setIsRecordPaymentOpen}
        invoiceId={selectedInvoiceId}
      />
    </div>
  );
}
