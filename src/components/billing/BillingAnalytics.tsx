'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp,
  IndianRupee,
  CreditCard,
  Building2,
  Shield,
  Clock,
  Activity,
  FileText,
  AlertCircle,
  PieChart,
  Calendar,
  Users,
  Receipt,
  Banknote,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

type BillingAnalyticsProps = {
  dateRange: { from?: Date; to?: Date };
  isLoading?: boolean;
};

export function BillingAnalytics({ dateRange: _dateRange, isLoading }: BillingAnalyticsProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Mock data aligned with schema
  const financialMetrics = {
    totalRevenue: 2847500,
    totalRevenueChange: 12.5,
    collectionRate: 94.2,
    collectionRateChange: 2.1,
    averageInvoiceValue: 2350,
    averageInvoiceChange: 8.3,
    outstandingAmount: 185000,
    outstandingChange: -5.2,
    averageDaysToPay: 3.2,
    daysToPayChange: -0.5,
    governmentSchemes: 457800,
    governmentSchemesChange: 18.4,
    insuranceClaims: 642300,
    insuranceClaimsChange: 15.7,
    cashCollection: 1747400,
    cashCollectionChange: 7.2
  };

  // Department-wise revenue (from departmentServices)
  const departmentRevenue = [
    { department: 'Emergency', revenue: 485000, patients: 312, avgBill: 1554 },
    { department: 'General Medicine', revenue: 420000, patients: 450, avgBill: 933 },
    { department: 'Surgery', revenue: 780000, patients: 85, avgBill: 9176 },
    { department: 'Pediatrics', revenue: 285000, patients: 220, avgBill: 1295 },
    { department: 'Gynecology', revenue: 350000, patients: 125, avgBill: 2800 },
    { department: 'Orthopedics', revenue: 527500, patients: 92, avgBill: 5734 }
  ];

  // Payment methods distribution (from payments table)
  const paymentMethods = [
    { method: 'Cash', amount: 1747400, percentage: 61.3, count: 1520 },
    { method: 'UPI', amount: 428300, percentage: 15.0, count: 890 },
    { method: 'Card', amount: 285600, percentage: 10.0, count: 245 },
    { method: 'Insurance', amount: 228400, percentage: 8.0, count: 78 },
    { method: 'Net-Banking', amount: 114200, percentage: 4.0, count: 92 },
    { method: 'Cheque', amount: 43700, percentage: 1.5, count: 15 },
    { method: 'DD', amount: 5900, percentage: 0.2, count: 3 }
  ];

  // Government schemes utilization (from governmentSchemes enum)
  const schemeUtilization = [
    { scheme: 'PMJAY', patients: 125, amount: 187500, avgClaim: 1500 },
    { scheme: 'CGHS', patients: 45, amount: 67500, avgClaim: 1500 },
    { scheme: 'ESI', patients: 78, amount: 93600, avgClaim: 1200 },
    { scheme: 'State-Insurance', patients: 32, amount: 48000, avgClaim: 1500 },
    { scheme: 'Ayushman-Bharat', patients: 42, amount: 63000, avgClaim: 1500 }
  ];

  // Billing status overview
  const billingStatus = {
    pending: { count: 45, amount: 112500 },
    processing: { count: 28, amount: 72400 },
    paid: { count: 892, amount: 2662600 },
    cancelled: { count: 12, amount: 28400 },
    refunded: { count: 8, amount: 18600 }
  };

  // Service-wise pricing from departmentServices
  const topServices = [
    { service: 'Consultation - General', count: 450, price: 500, revenue: 225000 },
    { service: 'X-Ray', count: 220, price: 800, revenue: 176000 },
    { service: 'Blood Test Complete', count: 380, price: 1200, revenue: 456000 },
    { service: 'ECG', count: 125, price: 600, revenue: 75000 },
    { service: 'Ultrasound', count: 85, price: 1500, revenue: 127500 },
    { service: 'CT Scan', count: 42, price: 5000, revenue: 210000 },
    { service: 'MRI', count: 28, price: 8000, revenue: 224000 },
    { service: 'Surgery Minor', count: 35, price: 15000, revenue: 525000 }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-1 h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="general">General Medicine</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="gynecology">Gynecology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="size-4" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financialMetrics.totalRevenue / 100000).toFixed(2)}L</div>
            <p className="text-xs text-muted-foreground">
              <span className={financialMetrics.totalRevenueChange > 0 ? "text-green-600" : "text-red-600"}>
                {financialMetrics.totalRevenueChange > 0 ? '+' : ''}{financialMetrics.totalRevenueChange}%
              </span>
              {' '}from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.collectionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{financialMetrics.collectionRateChange}%</span>
              {' '}from last {selectedPeriod}
            </p>
            <Progress value={financialMetrics.collectionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financialMetrics.outstandingAmount / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{financialMetrics.outstandingChange}%</span>
              {' '}from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Days to Pay</CardTitle>
            <Timer className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.averageDaysToPay} days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{financialMetrics.daysToPayChange} days</span>
              {' '}from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Government Schemes & Insurance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Government Schemes</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financialMetrics.governmentSchemes / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{financialMetrics.governmentSchemesChange}%</span>
              {' '}growth
            </p>
            <div className="mt-3 space-y-1">
              {schemeUtilization.slice(0, 3).map(scheme => (
                <div key={scheme.scheme} className="flex justify-between text-xs">
                  <span>{scheme.scheme}</span>
                  <span className="font-medium">₹{(scheme.amount / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Claims</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financialMetrics.insuranceClaims / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{financialMetrics.insuranceClaimsChange}%</span>
              {' '}growth
            </p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Approved</span>
                <span className="font-medium text-green-600">78</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span>Pending</span>
                <span className="font-medium text-orange-600">24</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Rejected</span>
                <span className="font-medium text-red-600">5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Collection</CardTitle>
            <Banknote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financialMetrics.cashCollection / 100000).toFixed(2)}L</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{financialMetrics.cashCollectionChange}%</span>
              {' '}growth
            </p>
            <Progress value={61.3} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-1">61.3% of total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="department" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="services">Top Services</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="status">Bill Status</TabsTrigger>
        </TabsList>

        {/* Department Revenue */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Department</CardTitle>
              <CardDescription>Department-wise revenue breakdown and patient statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentRevenue.map(dept => (
                  <div key={dept.department}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{dept.department}</span>
                        <Badge variant="secondary">{dept.patients} patients</Badge>
                      </div>
                      <span className="font-bold">₹{(dept.revenue / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress value={(dept.revenue / 780000) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg bill: ₹{dept.avgBill.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
              <CardDescription>Breakdown of payment collection by method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <div key={method.method}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4" />
                        <span className="font-medium">{method.method}</span>
                        <Badge variant="outline">{method.count} transactions</Badge>
                      </div>
                      <span className="font-bold">₹{(method.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={method.percentage} className="flex-1 h-2" />
                      <span className="text-xs w-12 text-right">{method.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* UPI Payment Alert */}
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  UPI adoption is growing rapidly with 15% of total transactions. Consider promoting digital payments for faster collections.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Services */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Generating Services</CardTitle>
              <CardDescription>Most frequently billed services and their contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topServices.map((service, index) => (
                  <div key={service.service} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {service.count} × ₹{service.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{(service.revenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">
                        {((service.revenue / financialMetrics.totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Government Schemes */}
        <TabsContent value="schemes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Government Scheme Utilization</CardTitle>
              <CardDescription>Patient coverage under various government health schemes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schemeUtilization.map(scheme => (
                  <div key={scheme.scheme} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{scheme.scheme}</p>
                        <p className="text-sm text-muted-foreground">{scheme.patients} beneficiaries</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{(scheme.amount / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-muted-foreground">Avg: ₹{scheme.avgClaim}</p>
                      </div>
                    </div>
                    <Progress value={(scheme.patients / 125) * 100} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Scheme Performance</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Beneficiaries</p>
                    <p className="font-bold">322 patients</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Claims</p>
                    <p className="font-bold">₹4.6L</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Status */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Status Overview</CardTitle>
              <CardDescription>Current status of all bills in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-orange-500" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <p className="text-2xl font-bold">{billingStatus.pending.count}</p>
                  <p className="text-xs text-muted-foreground">₹{(billingStatus.pending.amount / 1000).toFixed(0)}K</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-blue-500" />
                    <span className="text-sm font-medium">Processing</span>
                  </div>
                  <p className="text-2xl font-bold">{billingStatus.processing.count}</p>
                  <p className="text-xs text-muted-foreground">₹{(billingStatus.processing.amount / 1000).toFixed(0)}K</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-500" />
                    <span className="text-sm font-medium">Paid</span>
                  </div>
                  <p className="text-2xl font-bold">{billingStatus.paid.count}</p>
                  <p className="text-xs text-muted-foreground">₹{(billingStatus.paid.amount / 100000).toFixed(1)}L</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="size-4 text-red-500" />
                    <span className="text-sm font-medium">Cancelled</span>
                  </div>
                  <p className="text-2xl font-bold">{billingStatus.cancelled.count}</p>
                  <p className="text-xs text-muted-foreground">₹{(billingStatus.cancelled.amount / 1000).toFixed(0)}K</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Receipt className="size-4 text-purple-500" />
                    <span className="text-sm font-medium">Refunded</span>
                  </div>
                  <p className="text-2xl font-bold">{billingStatus.refunded.count}</p>
                  <p className="text-xs text-muted-foreground">₹{(billingStatus.refunded.amount / 1000).toFixed(0)}K</p>
                </div>
              </div>

              {/* Action Items */}
              <div className="mt-6 space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>45 bills pending</strong> for more than 7 days. Consider sending payment reminders.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button size="sm">Send Payment Reminders</Button>
                  <Button size="sm" variant="outline">Generate Aging Report</Button>
                  <Button size="sm" variant="outline">Export Analytics</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
