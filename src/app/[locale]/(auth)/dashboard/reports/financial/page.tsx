'use client';

import { BarChart3, Calendar, CreditCard, DollarSign, FileText, TrendingDown, TrendingUp, Download, Filter } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState('current_month');
  const [reportType, setReportType] = useState('summary');

  // Mock financial data
  const financialSummary = {
    totalRevenue: 2450000,
    revenueGrowth: 12.5,
    totalExpenses: 1680000,
    expenseGrowth: -5.2,
    netProfit: 770000,
    profitMargin: 31.4,
    outstandingAmount: 145000,
    collectionEfficiency: 94.2,
  };

  const revenueByDepartment = [
    { department: 'Cardiology', revenue: 485000, percentage: 19.8, growth: 15.2 },
    { department: 'General Medicine', revenue: 420000, percentage: 17.1, growth: 8.7 },
    { department: 'Emergency', revenue: 380000, percentage: 15.5, growth: 22.1 },
    { department: 'Laboratory', revenue: 290000, percentage: 11.8, growth: 6.3 },
    { department: 'Pharmacy', revenue: 265000, percentage: 10.8, growth: -2.1 },
    { department: 'Radiology', revenue: 245000, percentage: 10.0, growth: 18.5 },
    { department: 'Pediatrics', revenue: 210000, percentage: 8.6, growth: 11.2 },
    { department: 'Surgery', revenue: 155000, percentage: 6.3, growth: 9.8 },
  ];

  const paymentMethods = [
    { method: 'UPI', amount: 980000, percentage: 40.0, transactions: 1250 },
    { method: 'Cash', amount: 735000, percentage: 30.0, transactions: 890 },
    { method: 'Card', amount: 490000, percentage: 20.0, transactions: 420 },
    { method: 'Insurance', amount: 170000, percentage: 6.9, transactions: 85 },
    { method: 'Net Banking', amount: 75000, percentage: 3.1, transactions: 65 },
  ];

  const monthlyTrends = [
    { month: 'Jan 2024', revenue: 2100000, expenses: 1550000, profit: 550000, bills: 420 },
    { month: 'Feb 2024', revenue: 2250000, expenses: 1620000, profit: 630000, bills: 465 },
    { month: 'Mar 2024', revenue: 2380000, expenses: 1680000, profit: 700000, bills: 485 },
    { month: 'Apr 2024', revenue: 2450000, expenses: 1680000, profit: 770000, bills: 512 },
  ];

  const topPatients = [
    { name: 'Rajesh Kumar', totalAmount: 45000, bills: 8, lastPayment: '2024-04-15' },
    { name: 'Sunita Devi', totalAmount: 38000, bills: 12, lastPayment: '2024-04-12' },
    { name: 'Amit Singh', totalAmount: 32000, bills: 6, lastPayment: '2024-04-18' },
    { name: 'Priya Sharma', totalAmount: 28000, bills: 9, lastPayment: '2024-04-14' },
    { name: 'Mohammed Ali', totalAmount: 25000, bills: 7, lastPayment: '2024-04-16' },
  ];

  const outstandingBills = [
    { billNumber: 'HMS-2024-456', patient: 'Rajesh Kumar', amount: 15000, daysOverdue: 5, department: 'Cardiology' },
    { billNumber: 'HMS-2024-478', patient: 'Sunita Devi', amount: 8500, daysOverdue: 12, department: 'Laboratory' },
    { billNumber: 'HMS-2024-489', patient: 'Amit Singh', amount: 12000, daysOverdue: 8, department: 'Emergency' },
    { billNumber: 'HMS-2024-495', patient: 'Priya Sharma', amount: 6800, daysOverdue: 3, department: 'General Medicine' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Comprehensive financial analysis and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 size-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">Current Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="current_quarter">Current Quarter</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="current_year">Current Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="departmental">Department Wise</SelectItem>
                  <SelectItem value="patient">Patient Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline size-3 text-green-600" />
              <span className="ml-1 text-green-600">+{financialSummary.revenueGrowth}%</span>
              {' '}from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline size-3 text-green-600" />
              <span className="ml-1 text-green-600">{financialSummary.expenseGrowth}%</span>
              {' '}from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.netProfit)}</div>
            <p className="text-xs text-muted-foreground">
              Profit Margin: {financialSummary.profitMargin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Efficiency</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.collectionEfficiency}%</div>
            <p className="text-xs text-muted-foreground">
              Outstanding: {formatCurrency(financialSummary.outstandingAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding Bills</TabsTrigger>
        </TabsList>

        {/* Revenue Analysis */}
        <TabsContent value="revenue">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
                <CardDescription>Department-wise revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByDepartment.map(dept => (
                    <div key={dept.department} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dept.department}</span>
                          <span className="text-sm text-muted-foreground">{dept.percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-lg font-bold">{formatCurrency(dept.revenue)}</span>
                          <Badge variant={dept.growth > 0 ? 'default' : 'destructive'}>
                            {dept.growth > 0 ? '+' : ''}{dept.growth}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Patients by Revenue</CardTitle>
                <CardDescription>Highest contributing patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPatients.map((patient, index) => (
                    <div key={patient.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.bills} bills • Last: {patient.lastPayment}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">{formatCurrency(patient.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Analysis</CardTitle>
              <CardDescription>Revenue breakdown by payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Avg Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map(method => (
                    <TableRow key={method.method}>
                      <TableCell className="font-medium">{method.method}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(method.amount)}
                      </TableCell>
                      <TableCell className="text-right">{method.percentage}%</TableCell>
                      <TableCell className="text-right">{method.transactions}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(method.amount / method.transactions)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Financial Trends</CardTitle>
              <CardDescription>Revenue, expenses, and profit trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Bills Count</TableHead>
                    <TableHead className="text-right">Avg Bill Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyTrends.map(trend => (
                    <TableRow key={trend.month}>
                      <TableCell className="font-medium">{trend.month}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(trend.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(trend.expenses)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        {formatCurrency(trend.profit)}
                      </TableCell>
                      <TableCell className="text-right">{trend.bills}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(trend.revenue / trend.bills)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outstanding Bills */}
        <TabsContent value="outstanding">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Bills Analysis</CardTitle>
              <CardDescription>Bills pending payment and overdue analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill Number</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Days Overdue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstandingBills.map(bill => (
                    <TableRow key={bill.billNumber}>
                      <TableCell className="font-medium">{bill.billNumber}</TableCell>
                      <TableCell>{bill.patient}</TableCell>
                      <TableCell>{bill.department}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(bill.amount)}
                      </TableCell>
                      <TableCell className="text-right">{bill.daysOverdue} days</TableCell>
                      <TableCell>
                        <Badge variant={bill.daysOverdue > 10 ? 'destructive' : 'secondary'}>
                          {bill.daysOverdue > 10 ? 'Overdue' : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}