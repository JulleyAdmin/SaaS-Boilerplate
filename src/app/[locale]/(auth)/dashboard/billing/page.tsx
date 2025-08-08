'use client';

import { AlertCircle, CreditCard, FileText, Plus, Receipt, TrendingUp, Users, Activity, Building, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';

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
import { Badge } from '@/components/ui/badge';
import { usePatientBills, useBillingSummary } from '@/hooks/api/useHospitalBilling';
import { formatCurrency } from '@/utils/format';

export default function BillingPage() {
  const t = useTranslations('billing');
  const [selectedDateRange, setSelectedDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  // Use hospital billing hooks
  const { data: billsData, isLoading: billsLoading, error: billsError } = usePatientBills({
    status: selectedStatus === 'all' ? undefined : selectedStatus as any,
    billNumber: searchQuery || undefined,
    dateFrom: selectedDateRange.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange.to?.toISOString().split('T')[0],
  });

  const { data: summaryData, isLoading: summaryLoading } = useBillingSummary({
    dateFrom: selectedDateRange.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange.to?.toISOString().split('T')[0],
  });

  const bills = billsData?.data || [];
  const summary = billsData?.summary;
  const analytics = summaryData;

  const handleRecordPayment = (billId: string) => {
    setSelectedBillId(billId);
    setIsRecordPaymentOpen(true);
  };

  // Calculate recent payments from all bills
  const recentPayments = bills
    .flatMap(bill => bill.payments || [])
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payment Management</h1>
          <p className="text-muted-foreground">Comprehensive hospital billing with government scheme support</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/billing/create-hospital">
              <FileText className="mr-2 size-4" />
              Hospital Bill
            </Link>
          </Button>
          <Button onClick={() => setIsCreateInvoiceOpen(true)}>
            <Plus className="mr-2 size-4" />
            Quick Invoice
          </Button>
        </div>
      </div>

      {/* Hospital Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/billing/create-hospital">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Create Hospital Bill</h3>
                  <p className="text-sm text-muted-foreground">Full billing with schemes</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/billing/patients">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="size-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Patient Bills</h3>
                  <p className="text-sm text-muted-foreground">View patient billing</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/reports/financial">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="size-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Financial Reports</h3>
                  <p className="text-sm text-muted-foreground">Revenue analytics</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/government-schemes">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building className="size-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">Government Schemes</h3>
                  <p className="text-sm text-muted-foreground">Ayushman, CGHS, ESIC</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analytics?.totalRevenue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline size-3 text-green-600" />
                      <span className="ml-1 text-green-600">+{analytics?.revenueChange || 0}%</span>
                      {' '}from last period
                    </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {billsLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold">{summary?.byStatus?.Pending || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency((summary?.byStatus?.Pending || 0) * (analytics?.avgBillAmount || 0))}
                      {' '}pending
                    </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {billsLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold">{summary?.byStatus?.Paid || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Collection Efficiency: {analytics?.collectionEfficiency?.toFixed(1) || 0}%
                    </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(analytics?.outstandingAmount || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {summary?.byStatus?.Overdue || 0} overdue bills
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
              <CardTitle>Hospital Bills</CardTitle>
              <CardDescription>All patient bills and invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {billsError
                ? (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>Error loading bills. Please try again.</AlertDescription>
                    </Alert>
                  )
                : (
                    <div className="space-y-4">
                      {billsLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                              </div>
                              <Skeleton className="h-4 w-[100px] ml-auto" />
                            </div>
                          ))}
                        </div>
                      ) : bills.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No bills found</h3>
                          <p className="mt-1 text-sm text-muted-foreground">Create your first hospital bill to get started.</p>
                          <div className="mt-6">
                            <Button asChild>
                              <Link href="/dashboard/billing/create-hospital">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Bill
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {bills.map(bill => (
                            <div key={bill.billId} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <FileText className="size-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{bill.billNumber}</h4>
                                    <Badge 
                                      variant={
                                        bill.billStatus === 'Paid' ? 'default' : 
                                        bill.billStatus === 'Pending' ? 'secondary' : 
                                        bill.billStatus === 'Overdue' ? 'destructive' : 'outline'
                                      }
                                    >
                                      {bill.billStatus}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {bill.patientName} • {bill.billType} • {new Date(bill.billDate).toLocaleDateString()}
                                  </p>
                                  {bill.schemeName && (
                                    <p className="text-xs text-blue-600">
                                      {bill.schemeName} Coverage: {formatCurrency(bill.schemeCoverageAmount)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(bill.patientAmount)}</p>
                                <p className="text-sm text-muted-foreground">
                                  Total: {formatCurrency(bill.netAmount)}
                                </p>
                                {bill.billStatus !== 'Paid' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => handleRecordPayment(bill.billId)}
                                  >
                                    Record Payment
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                isLoading={billsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <BillingAnalytics
            dateRange={selectedDateRange}
            isLoading={summaryLoading}
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
        invoiceId={selectedBillId}
      />
    </div>
  );
}
