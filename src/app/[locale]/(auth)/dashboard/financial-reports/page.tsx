'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  FileText,
  Download,
  Calendar,
  Filter,
  Building2,
  Users,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  DollarSign,
  Receipt,
  Activity,
  Target,
  Briefcase,
  PieChart,
  BarChart3,
  LineChart,
  Printer,
  Mail,
  FileSpreadsheet
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';

export default function FinancialReportsPage() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeRevenue: true,
    includeDepartments: true,
    includeInsurance: true,
    includeSchemes: true,
    includeTrends: true,
    format: 'excel'
  });

  // Mock financial data
  const financialSummary = {
    revenue: {
      gross: 4520000,
      net: 4250000,
      discounts: 270000,
      growth: 5.6,
      target: 5000000,
      ytd: 24850000
    },
    collections: {
      current: 4250000,
      outstanding: 1240000,
      overdue: 280000,
      rate: 94.2,
      avgDays: 18
    },
    expenses: {
      total: 3200000,
      categories: {
        salaries: 1800000,
        medicines: 450000,
        supplies: 350000,
        utilities: 300000,
        equipment: 200000,
        maintenance: 100000
      }
    },
    profit: {
      gross: 1320000,
      net: 1050000,
      margin: 29.2,
      ebitda: 1450000
    }
  };

  const departmentPerformance = [
    { 
      name: 'Emergency', 
      revenue: 850000, 
      expenses: 620000,
      profit: 230000,
      patients: 342, 
      avgBill: 2485,
      margin: 27.1,
      growth: 8.2
    },
    { 
      name: 'Surgery', 
      revenue: 1200000, 
      expenses: 780000,
      profit: 420000,
      patients: 89, 
      avgBill: 13483,
      margin: 35.0,
      growth: 12.5
    },
    { 
      name: 'Maternity', 
      revenue: 680000, 
      expenses: 480000,
      profit: 200000,
      patients: 156, 
      avgBill: 4359,
      margin: 29.4,
      growth: -2.3
    },
    { 
      name: 'ICU', 
      revenue: 920000, 
      expenses: 690000,
      profit: 230000,
      patients: 47, 
      avgBill: 19574,
      margin: 25.0,
      growth: 15.7
    },
    { 
      name: 'General Ward', 
      revenue: 450000, 
      expenses: 320000,
      profit: 130000,
      patients: 289, 
      avgBill: 1557,
      margin: 28.9,
      growth: 3.4
    },
    { 
      name: 'OPD', 
      revenue: 420000, 
      expenses: 310000,
      profit: 110000,
      patients: 1847, 
      avgBill: 227,
      margin: 26.2,
      growth: 6.8
    }
  ];

  const payerMixAnalysis = [
    { category: 'Self-Pay', amount: 1580000, percentage: 35, count: 892 },
    { category: 'Private Insurance', amount: 1130000, percentage: 25, count: 423 },
    { category: 'Government Schemes', amount: 1808000, percentage: 40, count: 1455 }
  ];

  const agingAnalysis = [
    { range: '0-30 days', amount: 680000, accounts: 145, percentage: 54.8 },
    { range: '31-60 days', amount: 320000, accounts: 78, percentage: 25.8 },
    { range: '61-90 days', amount: 180000, accounts: 42, percentage: 14.5 },
    { range: '90+ days', amount: 60000, accounts: 18, percentage: 4.8 }
  ];

  const cashFlowStatement = {
    operating: {
      collections: 4250000,
      salaries: -1800000,
      supplies: -800000,
      utilities: -300000,
      net: 1350000
    },
    investing: {
      equipment: -200000,
      improvements: -50000,
      net: -250000
    },
    financing: {
      loanRepayment: -100000,
      interest: -20000,
      net: -120000
    },
    netCashFlow: 980000,
    openingBalance: 2450000,
    closingBalance: 3430000
  };

  const revenueByService = [
    { service: 'Consultations', revenue: 650000, ytd: 3850000, growth: 5.2 },
    { service: 'Surgeries', revenue: 1200000, ytd: 6950000, growth: 12.5 },
    { service: 'Laboratory', revenue: 480000, ytd: 2920000, growth: 8.7 },
    { service: 'Radiology', revenue: 520000, ytd: 3180000, growth: 6.3 },
    { service: 'Pharmacy', revenue: 380000, ytd: 2250000, growth: 4.1 },
    { service: 'Emergency', revenue: 850000, ytd: 4820000, growth: 9.8 },
    { service: 'Room Charges', revenue: 440000, ytd: 2650000, growth: 3.2 }
  ];

  const handleExportReport = () => {
    const reportTypes = [];
    if (exportOptions.includeRevenue) reportTypes.push('Revenue');
    if (exportOptions.includeDepartments) reportTypes.push('Departments');
    if (exportOptions.includeInsurance) reportTypes.push('Insurance');
    if (exportOptions.includeSchemes) reportTypes.push('Schemes');
    if (exportOptions.includeTrends) reportTypes.push('Trends');

    toast({
      title: "Generating Financial Reports",
      description: `Creating ${reportTypes.join(', ')} reports in ${exportOptions.format.toUpperCase()} format...`,
    });
    
    setShowExportDialog(false);
  };

  const handlePrintReport = () => {
    toast({
      title: "Printing Report",
      description: "Financial report sent to printer",
    });
  };

  const handleEmailReport = () => {
    toast({
      title: "Emailing Report",
      description: "Financial report sent to stakeholders",
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive financial reporting, cash flow analysis, and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="mr-2 size-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleEmailReport}>
            <Mail className="mr-2 size-4" />
            Email
          </Button>
          <Button onClick={() => setShowExportDialog(true)}>
            <FileSpreadsheet className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 size-5" />
            Executive Financial Summary
          </CardTitle>
          <CardDescription>Key financial metrics for {selectedPeriod === 'thisMonth' ? 'June 2025' : selectedPeriod}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Gross Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.revenue.gross)}</p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="size-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+{financialSummary.revenue.growth}% MoM</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Collections</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.collections.current)}</p>
              <Badge variant="outline" className="mt-1">
                {financialSummary.collections.rate}% rate
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Operating Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.expenses.total)}</p>
              <p className="text-xs text-muted-foreground mt-1">70.8% of revenue</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.profit.net)}</p>
              <Badge className="bg-green-100 text-green-700 mt-1">
                {financialSummary.profit.margin}% margin
              </Badge>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Revenue Target Achievement</p>
                <p className="text-xs text-muted-foreground">Progress towards monthly goal</p>
              </div>
              <span className="text-2xl font-bold">
                {((financialSummary.revenue.gross / financialSummary.revenue.target) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={(financialSummary.revenue.gross / financialSummary.revenue.target) * 100} 
              className="h-3 mt-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Report Tabs */}
      <Tabs defaultValue="pl" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="pl">P&L Statement</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="department">Department P&L</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="receivables">Receivables</TabsTrigger>
          <TabsTrigger value="payer">Payer Mix</TabsTrigger>
        </TabsList>

        <TabsContent value="pl">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>Detailed income statement for the period</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow className="font-semibold bg-gray-50">
                    <TableCell>REVENUE</TableCell>
                    <TableCell className="text-right">Current Month</TableCell>
                    <TableCell className="text-right">YTD</TableCell>
                    <TableCell className="text-right">% of Revenue</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Gross Patient Revenue</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.revenue.gross)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.revenue.ytd)}</TableCell>
                    <TableCell className="text-right">100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Less: Discounts & Allowances</TableCell>
                    <TableCell className="text-right text-red-600">({formatCurrency(financialSummary.revenue.discounts)})</TableCell>
                    <TableCell className="text-right text-red-600">({formatCurrency(financialSummary.revenue.discounts * 6)})</TableCell>
                    <TableCell className="text-right">6.0%</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-8">Net Patient Revenue</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.revenue.net)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.revenue.ytd - (financialSummary.revenue.discounts * 6))}</TableCell>
                    <TableCell className="text-right">94.0%</TableCell>
                  </TableRow>
                  
                  <TableRow className="font-semibold bg-gray-50">
                    <TableCell>OPERATING EXPENSES</TableCell>
                    <TableCell className="text-right"></TableCell>
                    <TableCell className="text-right"></TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                  {Object.entries(financialSummary.expenses.categories).map(([category, amount]) => (
                    <TableRow key={category}>
                      <TableCell className="pl-8 capitalize">{category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(amount * 6)}</TableCell>
                      <TableCell className="text-right">
                        {((amount / financialSummary.revenue.gross) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold">
                    <TableCell className="pl-8">Total Operating Expenses</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.expenses.total)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.expenses.total * 6)}</TableCell>
                    <TableCell className="text-right">70.8%</TableCell>
                  </TableRow>
                  
                  <TableRow className="font-semibold bg-green-50">
                    <TableCell>EBITDA</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.profit.ebitda)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(financialSummary.profit.ebitda * 6)}</TableCell>
                    <TableCell className="text-right">32.1%</TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="pl-8">Depreciation & Amortization</TableCell>
                    <TableCell className="text-right">(₹2.7L)</TableCell>
                    <TableCell className="text-right">(₹16.2L)</TableCell>
                    <TableCell className="text-right">6.0%</TableCell>
                  </TableRow>
                  
                  <TableRow className="font-bold bg-green-100">
                    <TableCell>NET PROFIT</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(financialSummary.profit.net)}</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(financialSummary.profit.net * 6)}</TableCell>
                    <TableCell className="text-right text-green-600">{financialSummary.profit.margin}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
              <CardDescription>Cash inflows and outflows for the period</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow className="font-semibold bg-gray-50">
                    <TableCell colSpan={2}>CASH FLOW FROM OPERATING ACTIVITIES</TableCell>
                    <TableCell className="text-right">Amount (₹)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Patient Collections</TableCell>
                    <TableCell className="text-right text-green-600">
                      +{formatCurrency(cashFlowStatement.operating.collections)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Salary Payments</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.operating.salaries)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Supplies & Medicines</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.operating.supplies)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Utilities & Other</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.operating.utilities)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-8" colSpan={2}>Net Cash from Operations</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(cashFlowStatement.operating.net)}
                    </TableCell>
                  </TableRow>

                  <TableRow className="font-semibold bg-gray-50">
                    <TableCell colSpan={2}>CASH FLOW FROM INVESTING ACTIVITIES</TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Equipment Purchase</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.investing.equipment)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Facility Improvements</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.investing.improvements)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-8" colSpan={2}>Net Cash from Investing</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.investing.net)}
                    </TableCell>
                  </TableRow>

                  <TableRow className="font-semibold bg-gray-50">
                    <TableCell colSpan={2}>CASH FLOW FROM FINANCING ACTIVITIES</TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Loan Repayments</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.financing.loanRepayment)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8" colSpan={2}>Interest Payments</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.financing.interest)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-8" colSpan={2}>Net Cash from Financing</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cashFlowStatement.financing.net)}
                    </TableCell>
                  </TableRow>

                  <TableRow className="font-bold bg-blue-50">
                    <TableCell colSpan={2}>NET CHANGE IN CASH</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(cashFlowStatement.netCashFlow)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Opening Cash Balance</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(cashFlowStatement.openingBalance)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-green-100">
                    <TableCell colSpan={2}>CLOSING CASH BALANCE</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(cashFlowStatement.closingBalance)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Profit & Loss</CardTitle>
              <CardDescription>Financial performance by department</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                    <TableHead className="text-right">Patients</TableHead>
                    <TableHead className="text-right">Avg Bill</TableHead>
                    <TableHead className="text-center">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentPerformance.map((dept) => (
                    <TableRow key={dept.name}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(dept.revenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(dept.expenses)}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(dept.profit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{dept.margin}%</Badge>
                      </TableCell>
                      <TableCell className="text-right">{dept.patients}</TableCell>
                      <TableCell className="text-right">₹{dept.avgBill.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        {dept.growth > 0 ? (
                          <Badge className="bg-green-100 text-green-700">
                            +{dept.growth}%
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            {dept.growth}%
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-50">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(departmentPerformance.reduce((sum, d) => sum + d.revenue, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(departmentPerformance.reduce((sum, d) => sum + d.expenses, 0))}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(departmentPerformance.reduce((sum, d) => sum + d.profit, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge>29.2%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {departmentPerformance.reduce((sum, d) => sum + d.patients, 0)}
                    </TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-700">+7.8%</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Line</CardTitle>
                <CardDescription>Detailed breakdown of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Current Month</TableHead>
                      <TableHead className="text-right">YTD</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                      <TableHead className="text-center">Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByService.map((service) => (
                      <TableRow key={service.service}>
                        <TableCell className="font-medium">{service.service}</TableCell>
                        <TableCell className="text-right">{formatCurrency(service.revenue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(service.ytd)}</TableCell>
                        <TableCell className="text-right">
                          {((service.revenue / financialSummary.revenue.gross) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-700">
                            +{service.growth}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Revenue Procedures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Knee Replacement</span>
                      <span className="font-medium">₹3.2L × 12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cardiac Surgery</span>
                      <span className="font-medium">₹4.5L × 8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Normal Delivery</span>
                      <span className="font-medium">₹45K × 42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">C-Section</span>
                      <span className="font-medium">₹85K × 28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Appendectomy</span>
                      <span className="font-medium">₹65K × 18</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Next Month Projection</span>
                        <span className="font-bold text-blue-600">₹47.8L</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Based on current trends</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quarter End Target</span>
                        <span className="font-bold text-green-600">₹1.5Cr</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">82% achieved</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Annual Projection</span>
                        <span className="font-bold text-purple-600">₹5.8Cr</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">On track to achieve</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="receivables">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Accounts Receivable Aging</CardTitle>
                <CardDescription>Outstanding amounts by age category</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aging Bucket</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Accounts</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                      <TableHead>Action Required</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agingAnalysis.map((aging) => (
                      <TableRow key={aging.range}>
                        <TableCell className="font-medium">{aging.range}</TableCell>
                        <TableCell className="text-right">{formatCurrency(aging.amount)}</TableCell>
                        <TableCell className="text-right">{aging.accounts}</TableCell>
                        <TableCell className="text-right">{aging.percentage}%</TableCell>
                        <TableCell>
                          {aging.range === '0-30 days' && (
                            <Badge variant="outline">Normal follow-up</Badge>
                          )}
                          {aging.range === '31-60 days' && (
                            <Badge className="bg-yellow-100 text-yellow-700">Reminders sent</Badge>
                          )}
                          {aging.range === '61-90 days' && (
                            <Badge className="bg-orange-100 text-orange-700">Collection calls</Badge>
                          )}
                          {aging.range === '90+ days' && (
                            <Badge variant="destructive">Legal notice</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>TOTAL</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(agingAnalysis.reduce((sum, a) => sum + a.amount, 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        {agingAnalysis.reduce((sum, a) => sum + a.accounts, 0)}
                      </TableCell>
                      <TableCell className="text-right">100%</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">18 days</p>
                    <p className="text-sm text-muted-foreground">Avg Collection Period</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">94.2%</p>
                    <p className="text-sm text-muted-foreground">Collection Rate</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">2.3%</p>
                    <p className="text-sm text-muted-foreground">Bad Debt Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payer">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payer Mix Analysis</CardTitle>
                <CardDescription>Revenue distribution by payment source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payerMixAnalysis.map((payer) => (
                    <div key={payer.category} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{payer.category}</p>
                          <p className="text-sm text-muted-foreground">{payer.count} patients</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{formatCurrency(payer.amount)}</p>
                          <p className="text-sm text-muted-foreground">{payer.percentage}% of total</p>
                        </div>
                      </div>
                      <Progress value={payer.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Claims Submitted</span>
                      <span className="font-medium">423</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Claims Approved</span>
                      <span className="font-medium text-green-600">385 (91%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Claims Denied</span>
                      <span className="font-medium text-red-600">18 (4%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Claims Pending</span>
                      <span className="font-medium text-orange-600">20 (5%)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Avg Processing Time</span>
                      <span className="font-bold">12 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Government Schemes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">PM-JAY</span>
                      <span className="font-medium">₹7.2L (40%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">CGHS</span>
                      <span className="font-medium">₹4.8L (27%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">ESI</span>
                      <span className="font-medium">₹5.8L (32%)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Total Scheme Revenue</span>
                      <span className="font-bold">₹18.1L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Alert>
              <TrendingUp className="size-4" />
              <AlertDescription>
                <strong>Revenue Growth:</strong> 5.6% month-over-month growth indicates healthy business expansion. Surgery department showing strongest growth at 12.5%.
              </AlertDescription>
            </Alert>
            <Alert>
              <Activity className="size-4" />
              <AlertDescription>
                <strong>Collection Efficiency:</strong> 94.2% collection rate is excellent. Focus on reducing the 18-day average collection period.
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription>
                <strong>Receivables Alert:</strong> ₹2.8L overdue for &gt;30 days needs immediate attention. Consider automated reminders.
              </AlertDescription>
            </Alert>
            <Alert>
              <Target className="size-4" />
              <AlertDescription>
                <strong>Target Achievement:</strong> At 90.4% of monthly target. Need ₹4.8L more to reach ₹50L goal.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Financial Reports</DialogTitle>
            <DialogDescription>
              Select the reports you want to export and the format
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Report Sections</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportOptions.includeRevenue}
                    onCheckedChange={(checked) => 
                      setExportOptions({...exportOptions, includeRevenue: checked as boolean})
                    }
                  />
                  <span>Revenue Analysis</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportOptions.includeDepartments}
                    onCheckedChange={(checked) => 
                      setExportOptions({...exportOptions, includeDepartments: checked as boolean})
                    }
                  />
                  <span>Department Performance</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportOptions.includeInsurance}
                    onCheckedChange={(checked) => 
                      setExportOptions({...exportOptions, includeInsurance: checked as boolean})
                    }
                  />
                  <span>Insurance Analytics</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportOptions.includeSchemes}
                    onCheckedChange={(checked) => 
                      setExportOptions({...exportOptions, includeSchemes: checked as boolean})
                    }
                  />
                  <span>Government Schemes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportOptions.includeTrends}
                    onCheckedChange={(checked) => 
                      setExportOptions({...exportOptions, includeTrends: checked as boolean})
                    }
                  />
                  <span>Monthly Trends</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select 
                value={exportOptions.format} 
                onValueChange={(value) => setExportOptions({...exportOptions, format: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportReport}>
              <Download className="mr-2 size-4" />
              Export Reports
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}