'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  IndianRupee,
  Calendar,
  Download,
  Filter,
  FileText,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  Target,
  Pill
} from 'lucide-react';
import { format } from 'date-fns';

export default function PharmacyReports() {
  const [dateRange, setDateRange] = useState('this_month');
  const [reportType, setReportType] = useState('sales');

  // Mock data for reports
  const salesReport = {
    totalRevenue: 245000,
    totalTransactions: 1250,
    avgTransactionValue: 196,
    topMedicines: [
      { name: 'Paracetamol 500mg', quantity: 450, revenue: 11250 },
      { name: 'Amoxicillin 500mg', quantity: 320, revenue: 27200 },
      { name: 'Metformin 500mg', quantity: 280, revenue: 9800 },
      { name: 'Omeprazole 20mg', revenue: 8400, quantity: 240 },
      { name: 'Atorvastatin 10mg', quantity: 200, revenue: 12000 }
    ],
    dailySales: [
      { date: '2024-08-01', sales: 8500 },
      { date: '2024-08-02', sales: 9200 },
      { date: '2024-08-03', sales: 7800 },
      { date: '2024-08-04', sales: 10500 },
      { date: '2024-08-05', sales: 9800 },
      { date: '2024-08-06', sales: 11200 },
      { date: '2024-08-07', sales: 12000 }
    ]
  };

  const inventoryReport = {
    totalMedicines: 1350,
    totalValue: 825000,
    lowStockItems: 65,
    expiringSoon: 30,
    outOfStock: 10,
    categories: [
      { name: 'Analgesics', count: 180, value: 125000 },
      { name: 'Antibiotics', count: 220, value: 185000 },
      { name: 'Cardiac', count: 150, value: 145000 },
      { name: 'Diabetes', count: 120, value: 98000 },
      { name: 'Vitamins', count: 200, value: 65000 }
    ],
    fastMoving: [
      { name: 'Paracetamol 500mg', turnover: 45 },
      { name: 'Cetrizine 10mg', turnover: 38 },
      { name: 'Amoxicillin 500mg', turnover: 35 },
      { name: 'Pantoprazole 40mg', turnover: 32 },
      { name: 'Metformin 500mg', turnover: 28 }
    ]
  };

  const prescriptionReport = {
    totalPrescriptions: 1180,
    averageItemsPerPrescription: 3.2,
    pendingDispense: 25,
    completedToday: 95,
    topDoctors: [
      { name: 'Dr. Rajesh Kumar', prescriptions: 180 },
      { name: 'Dr. Priya Sharma', prescriptions: 165 },
      { name: 'Dr. Amit Patel', prescriptions: 145 },
      { name: 'Dr. Sunita Verma', prescriptions: 125 },
      { name: 'Dr. Rohit Gupta', prescriptions: 110 }
    ],
    commonMedicines: [
      { name: 'Paracetamol', frequency: 78 },
      { name: 'Amoxicillin', frequency: 65 },
      { name: 'Metformin', frequency: 52 },
      { name: 'Pantoprazole', frequency: 48 },
      { name: 'Atorvastatin', frequency: 42 }
    ]
  };

  const handleExportReport = () => {
    // Mock export functionality
    const fileName = `pharmacy-${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    console.log(`Exporting report: ${fileName}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Reports</h1>
          <p className="text-muted-foreground">Comprehensive pharmacy analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input type="date" />
                </div>
              </>
            )}
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          <TabsTrigger value="prescription">Prescription Report</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-6">
          {/* Sales Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{(salesReport.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{salesReport.totalTransactions}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8.3% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Transaction</p>
                    <p className="text-2xl font-bold">₹{salesReport.avgTransactionValue}</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+3.8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Average</p>
                    <p className="text-2xl font-bold">₹{(salesReport.totalRevenue / 30 / 1000).toFixed(1)}K</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5.2% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Medicines */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Medicines</CardTitle>
              <CardDescription>Best performing medicines by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesReport.topMedicines.map((medicine, index) => (
                  <div key={medicine.name} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {medicine.quantity} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{medicine.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{(medicine.revenue / medicine.quantity).toFixed(2)}/unit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Inventory Summary */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Medicines</p>
                    <p className="text-2xl font-bold">{inventoryReport.totalMedicines}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">₹{(inventoryReport.totalValue / 100000).toFixed(1)}L</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">{inventoryReport.lowStockItems}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Expiring Soon</p>
                    <p className="text-2xl font-bold text-orange-600">{inventoryReport.expiringSoon}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{inventoryReport.outOfStock}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories and Fast Moving */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryReport.categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.count} medicines</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(category.value / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fast Moving Medicines</CardTitle>
                <CardDescription>By inventory turnover rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryReport.fastMoving.map((medicine) => (
                    <div key={medicine.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">High turnover</p>
                      </div>
                      <Badge variant="outline">
                        {medicine.turnover} days
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Prescription Report */}
        <TabsContent value="prescription" className="space-y-6">
          {/* Prescription Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Prescriptions</p>
                    <p className="text-2xl font-bold">{prescriptionReport.totalPrescriptions}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Items/Rx</p>
                    <p className="text-2xl font-bold">{prescriptionReport.averageItemsPerPrescription}</p>
                  </div>
                  <Pill className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Today</p>
                    <p className="text-2xl font-bold">{prescriptionReport.completedToday}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{prescriptionReport.pendingDispense}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Doctors and Common Medicines */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Prescribing Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prescriptionReport.topDoctors.map((doctor, index) => (
                    <div key={doctor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <p className="font-medium">{doctor.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.prescriptions} Rx</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Prescribed Medicines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prescriptionReport.commonMedicines.map((medicine) => (
                    <div key={medicine.name} className="flex items-center justify-between">
                      <p className="font-medium">{medicine.name}</p>
                      <Badge variant="secondary">
                        {medicine.frequency}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Advanced Analytics</h3>
            <p className="text-muted-foreground">
              Detailed charts and analytics visualization will be implemented here
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Features: Trend analysis, comparative reports, forecasting, and more
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}