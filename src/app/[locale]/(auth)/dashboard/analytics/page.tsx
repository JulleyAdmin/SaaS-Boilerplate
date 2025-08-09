'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Bed,
  Clock,
  Heart,
  Pill,
  TestTube,
  AlertCircle,
  RefreshCw,
  Download,
  ChevronUp,
  ChevronDown,
  IndianRupee,
  UserCheck,
  Shield,
  Home,
  Ambulance,
  Brain,
  Baby,
  Eye,
  Bone,
  ShieldCheck
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [department, setDepartment] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [, setSelectedMetric] = useState<any>(null);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        toast({
          title: "Data Refreshed",
          description: "Analytics updated with latest data",
        });
      }, 30000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh]);

  // Key Performance Indicators with Indian healthcare context
  const kpiData = {
    totalPatients: { value: 2847, change: 12.5, target: 3000, today: 142 },
    revenue: { value: 3456789, change: 8.3, target: 4000000, currency: '₹' },
    occupancyRate: { value: 87, change: -2.1, target: 85, critical: 12 },
    avgWaitTime: { value: 24, change: -15.2, target: 30, emergency: 8 },
    patientSatisfaction: { value: 4.7, change: 5.1, target: 4.5, reviews: 234 },
    emergencyCases: { value: 68, change: 23.5, critical: 18, admitted: 45 },
    surgeries: { value: 32, scheduled: 38, completed: 28, cancelled: 2 },
    staffUtilization: { value: 82, change: 3.2, target: 80, overtime: 12 },
    bedTurnover: { value: 3.4, change: 8.2, target: 3.0 },
    readmissionRate: { value: 8.2, change: -12.5, target: 10 },
    infectionRate: { value: 0.8, change: -25.0, target: 1.5 },
    mortalityRate: { value: 1.2, change: -15.3, target: 2.0 }
  };

  // Department-wise statistics with comprehensive metrics
  const departmentStats = [
    { 
      name: 'Emergency', 
      icon: Ambulance,
      patients: 68, 
      revenue: 485000, 
      utilization: 92, 
      trend: 'up',
      avgWaitTime: 8,
      satisfaction: 78,
      staffCount: 15,
      criticalCases: 18
    },
    { 
      name: 'OPD', 
      icon: Users,
      patients: 923, 
      revenue: 556000, 
      utilization: 76, 
      trend: 'up',
      avgWaitTime: 24,
      satisfaction: 85,
      staffCount: 28,
      appointments: 1024
    },
    { 
      name: 'IPD', 
      icon: Bed,
      patients: 334, 
      revenue: 1850000, 
      utilization: 85, 
      trend: 'stable',
      bedOccupancy: 87,
      avgLOS: 4.2,
      staffCount: 45,
      discharges: 42
    },
    { 
      name: 'ICU', 
      icon: Heart,
      patients: 28, 
      revenue: 950000, 
      utilization: 88, 
      trend: 'down',
      ventilators: 12,
      mortality: 2,
      staffCount: 18,
      criticalScore: 92
    },
    { 
      name: 'Surgery', 
      icon: Brain,
      patients: 45, 
      revenue: 2890000, 
      utilization: 72, 
      trend: 'up',
      operations: 32,
      otUtilization: 78,
      staffCount: 22,
      successRate: 98
    },
    { 
      name: 'Laboratory', 
      icon: TestTube,
      tests: 1856, 
      revenue: 278000, 
      utilization: 68, 
      trend: 'up',
      tatCompliance: 94,
      criticalTests: 234,
      staffCount: 12,
      pendingTests: 67
    },
    { 
      name: 'Pharmacy', 
      icon: Pill,
      prescriptions: 2534, 
      revenue: 445000, 
      utilization: 81, 
      trend: 'stable',
      stockouts: 3,
      expiring: 12,
      staffCount: 8,
      avgDispenseTime: 6
    },
    { 
      name: 'Radiology', 
      icon: Eye,
      scans: 334, 
      revenue: 656000, 
      utilization: 70, 
      trend: 'up',
      mriScans: 45,
      ctScans: 89,
      staffCount: 10,
      reportTat: 2.5
    },
    {
      name: 'Pediatrics',
      icon: Baby,
      patients: 156,
      revenue: 234000,
      utilization: 65,
      trend: 'up',
      vaccinations: 89,
      nicu: 8,
      staffCount: 14,
      satisfaction: 92
    },
    {
      name: 'Orthopedics',
      icon: Bone,
      patients: 89,
      revenue: 456000,
      utilization: 72,
      trend: 'stable',
      surgeries: 12,
      fractures: 34,
      staffCount: 11,
      rehabilitation: 45
    }
  ];

  // Real-time patient flow with detailed breakdown
  const patientFlow = [
    { hour: '06:00', admissions: 8, discharges: 2, emergency: 3, opd: 12, transfers: 1 },
    { hour: '08:00', admissions: 22, discharges: 8, emergency: 5, opd: 45, transfers: 3 },
    { hour: '10:00', admissions: 38, discharges: 12, emergency: 7, opd: 89, transfers: 4 },
    { hour: '12:00', admissions: 45, discharges: 18, emergency: 9, opd: 112, transfers: 6 },
    { hour: '14:00', admissions: 40, discharges: 25, emergency: 6, opd: 98, transfers: 5 },
    { hour: '16:00', admissions: 32, discharges: 35, emergency: 4, opd: 76, transfers: 4 },
    { hour: '18:00', admissions: 25, discharges: 30, emergency: 8, opd: 45, transfers: 3 },
    { hour: '20:00', admissions: 12, discharges: 15, emergency: 5, opd: 23, transfers: 2 },
    { hour: '22:00', admissions: 6, discharges: 8, emergency: 4, opd: 8, transfers: 1 }
  ];

  // Top procedures with categories
  const topProcedures = [
    { name: 'General Consultation', category: 'OPD', count: 334, revenue: 167000, avgTime: 15 },
    { name: 'Blood Tests', category: 'Lab', count: 289, revenue: 144500, tatHours: 2 },
    { name: 'X-Ray', category: 'Radiology', count: 178, revenue: 267000, reportTime: 1 },
    { name: 'ECG', category: 'Cardiology', count: 148, revenue: 74000, urgentCount: 23 },
    { name: 'Vaccination', category: 'Pediatrics', count: 127, revenue: 63500, childCount: 98 },
    { name: 'Laparoscopy', category: 'Surgery', count: 12, revenue: 480000, avgDuration: 90 },
    { name: 'MRI Scan', category: 'Radiology', count: 45, revenue: 450000, waitDays: 2 },
    { name: 'Dialysis', category: 'Nephrology', count: 38, revenue: 380000, sessions: 114 },
    { name: 'Chemotherapy', category: 'Oncology', count: 28, revenue: 840000, cycles: 84 },
    { name: 'Delivery (Normal)', category: 'Obstetrics', count: 18, revenue: 270000, caesarean: 8 }
  ];

  // Insurance and government schemes with Indian context
  const insuranceStats = [
    { type: 'Ayushman Bharat (PMJAY)', patients: 567, claims: 2840000, approved: 89, pending: 45 },
    { type: 'State Health Insurance', patients: 334, claims: 1550000, approved: 92, rejected: 12 },
    { type: 'CGHS', patients: 189, claims: 945000, approved: 95, processing: 23 },
    { type: 'ESI', patients: 267, claims: 1335000, approved: 88, pending: 34 },
    { type: 'Private Insurance', patients: 423, claims: 4230000, approved: 78, disputed: 28 },
    { type: 'Corporate Tie-ups', patients: 234, claims: 2340000, approved: 94, direct: true },
    { type: 'Cash/Self-Pay', patients: 833, amount: 2499000, percentage: 100, discount: 8 }
  ];

  // Critical alerts with severity levels
  const criticalAlerts = [
    { 
      type: 'critical', 
      category: 'Resources',
      message: 'ICU at 95% capacity - only 2 beds available', 
      time: '2 min ago',
      action: 'Prepare overflow protocol'
    },
    { 
      type: 'urgent', 
      category: 'Blood Bank',
      message: 'O-negative blood stock critically low (6 units)', 
      time: '15 min ago',
      action: 'Contact blood donors'
    },
    { 
      type: 'warning', 
      category: 'Emergency',
      message: 'Emergency wait time exceeding 45 minutes', 
      time: '20 min ago',
      action: 'Deploy additional staff'
    },
    { 
      type: 'urgent', 
      category: 'Equipment',
      message: '2 ventilators require immediate maintenance', 
      time: '1 hour ago',
      action: 'Call biomedical engineer'
    },
    {
      type: 'info',
      category: 'Pharmacy',
      message: '12 medications expiring within 7 days',
      time: '2 hours ago',
      action: 'Review and redistribute'
    }
  ];

  // Quality metrics with NABH standards
  const qualityMetrics = {
    clinicalIndicators: [
      { name: 'Hospital Infection Rate', value: 0.8, target: 1.5, unit: '%', trend: 'down' },
      { name: 'Readmission Rate (30 days)', value: 8.2, target: 10, unit: '%', trend: 'down' },
      { name: 'Medication Error Rate', value: 0.1, target: 0.5, unit: '%', trend: 'stable' },
      { name: 'Patient Fall Rate', value: 0.5, target: 1.0, unit: 'per 1000 days', trend: 'down' },
      { name: 'Pressure Ulcer Rate', value: 0.3, target: 0.5, unit: '%', trend: 'stable' },
      { name: 'Surgical Site Infection', value: 1.2, target: 2.0, unit: '%', trend: 'down' }
    ],
    patientSatisfaction: [
      { category: 'Overall Experience', score: 4.7, max: 5, responses: 234 },
      { category: 'Doctor Communication', score: 4.8, max: 5, responses: 234 },
      { category: 'Nursing Care', score: 4.6, max: 5, responses: 234 },
      { category: 'Cleanliness & Hygiene', score: 4.8, max: 5, responses: 234 },
      { category: 'Food Quality', score: 4.2, max: 5, responses: 189 },
      { category: 'Discharge Process', score: 4.5, max: 5, responses: 156 }
    ],
    operationalEfficiency: [
      { name: 'Bed Turnover Rate', value: 3.4, target: 3.0, unit: 'days', good: true },
      { name: 'Average Length of Stay', value: 4.2, target: 5.0, unit: 'days', good: true },
      { name: 'OT Utilization', value: 78, target: 75, unit: '%', good: true },
      { name: 'Lab TAT Compliance', value: 94, target: 90, unit: '%', good: true },
      { name: 'Discharge < 2 hrs', value: 85, target: 80, unit: '%', good: true },
      { name: 'Appointment Adherence', value: 88, target: 85, unit: '%', good: true }
    ]
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="size-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="size-4 text-red-600" />;
    return <Activity className="size-4 text-gray-600" />;
  };

  const getTrendColor = (change: number, inverse = false) => {
    if (inverse) {
      if (change > 0) return 'text-red-600';
      if (change < 0) return 'text-green-600';
    } else {
      if (change > 0) return 'text-green-600';
      if (change < 0) return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getAlertColor = (type: string) => {
    switch(type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'urgent': return 'border-orange-500 bg-orange-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Analytics report is being generated...",
    });
    setShowExportDialog(false);
  };

  const handleMetricClick = (metric: any) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-time Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive hospital performance metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentStats.map(dept => (
                <SelectItem key={dept.name} value={dept.name.toLowerCase()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`mr-2 size-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.filter(alert => alert.type === 'critical').length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <div className="space-y-2">
              {criticalAlerts.filter(a => a.type === 'critical').map((alert, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{alert.category}: </span>
                    <span>{alert.message}</span>
                  </div>
                  <Button size="sm" variant="outline">{alert.action}</Button>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleMetricClick({ title: 'Total Patients', ...kpiData.totalPatients })}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{kpiData.totalPatients.value.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center text-xs ${getTrendColor(kpiData.totalPatients.change)}`}>
                    {getTrendIcon(kpiData.totalPatients.change)}
                    <span className="ml-1">{Math.abs(kpiData.totalPatients.change)}%</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Today: {kpiData.totalPatients.today}
                  </Badge>
                </div>
              </div>
              <Users className="size-8 text-muted-foreground" />
            </div>
            <Progress 
              value={(kpiData.totalPatients.value / kpiData.totalPatients.target) * 100} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleMetricClick({ title: 'Revenue', ...kpiData.revenue })}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="size-5 mr-1" />
                  {(kpiData.revenue.value / 100000).toFixed(1)}L
                </div>
                <div className={`flex items-center text-xs ${getTrendColor(kpiData.revenue.change)}`}>
                  {getTrendIcon(kpiData.revenue.change)}
                  <span className="ml-1">{Math.abs(kpiData.revenue.change)}%</span>
                </div>
              </div>
              <DollarSign className="size-8 text-muted-foreground" />
            </div>
            <Progress 
              value={(kpiData.revenue.value / kpiData.revenue.target) * 100} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{kpiData.occupancyRate.value}%</div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center text-xs ${getTrendColor(kpiData.occupancyRate.change)}`}>
                    {getTrendIcon(kpiData.occupancyRate.change)}
                    <span className="ml-1">{Math.abs(kpiData.occupancyRate.change)}%</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Critical: {kpiData.occupancyRate.critical}
                  </Badge>
                </div>
              </div>
              <Bed className="size-8 text-muted-foreground" />
            </div>
            <Progress 
              value={kpiData.occupancyRate.value} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{kpiData.avgWaitTime.value} min</div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center text-xs ${getTrendColor(kpiData.avgWaitTime.change, true)}`}>
                    {getTrendIcon(-kpiData.avgWaitTime.change)}
                    <span className="ml-1">{Math.abs(kpiData.avgWaitTime.change)}%</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ER: {kpiData.avgWaitTime.emergency} min
                  </Badge>
                </div>
              </div>
              <Clock className="size-8 text-muted-foreground" />
            </div>
            <Progress 
              value={100 - (kpiData.avgWaitTime.value / 60) * 100} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional KPIs Row */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Patient Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{kpiData.patientSatisfaction.value}/5</div>
                <p className="text-xs text-muted-foreground">{kpiData.patientSatisfaction.reviews} reviews</p>
              </div>
              <Heart className="size-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Emergency Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{kpiData.emergencyCases.value}</div>
                <p className="text-xs text-muted-foreground">{kpiData.emergencyCases.critical} critical</p>
              </div>
              <AlertCircle className="size-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Surgeries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{kpiData.surgeries.completed}/{kpiData.surgeries.scheduled}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <Brain className="size-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Staff Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{kpiData.staffUtilization.value}%</div>
                <p className="text-xs text-muted-foreground">{kpiData.staffUtilization.overtime} OT</p>
              </div>
              <UserCheck className="size-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Infection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-green-600">{kpiData.infectionRate.value}%</div>
                <p className="text-xs text-green-600">↓ {Math.abs(kpiData.infectionRate.change)}%</p>
              </div>
              <ShieldCheck className="size-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Readmission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{kpiData.readmissionRate.value}%</div>
                <p className="text-xs text-green-600">↓ {Math.abs(kpiData.readmissionRate.change)}%</p>
              </div>
              <Home className="size-5 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="patient-flow">Patient Flow</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Real-time utilization and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {departmentStats.map((dept) => (
                      <div key={dept.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <dept.icon className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{dept.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              ₹{(dept.revenue / 1000).toFixed(0)}K
                            </span>
                            {dept.trend === 'up' && <ChevronUp className="size-3 text-green-600" />}
                            {dept.trend === 'down' && <ChevronDown className="size-3 text-red-600" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={dept.utilization} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground w-10">
                            {dept.utilization}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Top Procedures */}
            <Card>
              <CardHeader>
                <CardTitle>Top Procedures Today</CardTitle>
                <CardDescription>Most performed procedures and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {topProcedures.slice(0, 10).map((procedure, index) => (
                      <div key={procedure.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{procedure.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {procedure.category} • {procedure.count} procedures
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">₹{(procedure.revenue / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Patient Flow Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Patient Flow Pattern</CardTitle>
              <CardDescription>Admissions, discharges, and department activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-9 gap-2">
                  {patientFlow.map((hour) => (
                    <div key={hour.hour} className="text-center">
                      <div className="space-y-1">
                        <div className="h-16 flex flex-col justify-end">
                          <div 
                            className="bg-blue-500 rounded-t" 
                            style={{ height: `${(hour.admissions / 50) * 100}%` }}
                            title={`Admissions: ${hour.admissions}`}
                          />
                        </div>
                        <div className="h-16 flex flex-col justify-end">
                          <div 
                            className="bg-green-500 rounded-t" 
                            style={{ height: `${(hour.discharges / 50) * 100}%` }}
                            title={`Discharges: ${hour.discharges}`}
                          />
                        </div>
                        <div className="h-16 flex flex-col justify-end">
                          <div 
                            className="bg-red-500 rounded-t" 
                            style={{ height: `${(hour.emergency / 50) * 100}%` }}
                            title={`Emergency: ${hour.emergency}`}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{hour.hour.slice(0, 5)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span>Admissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>Discharges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>Emergency</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {departmentStats.map((dept) => (
              <Card key={dept.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <dept.icon className="size-5 text-muted-foreground" />
                      <CardTitle className="text-base">{dept.name}</CardTitle>
                    </div>
                    {dept.trend === 'up' && <Badge className="bg-green-100 text-green-800">↑ Growing</Badge>}
                    {dept.trend === 'down' && <Badge className="bg-red-100 text-red-800">↓ Declining</Badge>}
                    {dept.trend === 'stable' && <Badge variant="secondary">Stable</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Patients/Tests</span>
                      <span className="font-medium">{dept.patients || dept.tests || dept.prescriptions || dept.scans}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-medium">₹{(dept.revenue / 100000).toFixed(2)}L</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium">{dept.utilization}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Staff Count</span>
                      <span className="font-medium">{dept.staffCount}</span>
                    </div>
                  </div>
                  <Progress value={dept.utilization} className="h-2" />
                  <Button className="w-full" size="sm" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Patient Flow Tab */}
        <TabsContent value="patient-flow" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current In-Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">487</div>
                <p className="text-sm text-muted-foreground">Across all wards</p>
                <Separator className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>General Ward</span>
                    <span className="font-medium">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Private Rooms</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ICU/CCU</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency</span>
                    <span className="font-medium">36</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pediatric Ward</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maternity Ward</span>
                    <span className="font-medium">55</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today's Movement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Admissions</span>
                      <span className="text-2xl font-bold text-blue-600">228</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Discharges</span>
                      <span className="text-2xl font-bold text-green-600">183</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Transfers</span>
                      <span className="text-2xl font-bold text-purple-600">29</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Deaths</span>
                      <span className="text-2xl font-bold text-red-600">3</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Queue Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127</div>
                <p className="text-sm text-muted-foreground">Patients waiting</p>
                <Separator className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>OPD Queue</span>
                    <span className="font-medium">68</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Queue</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pharmacy Queue</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Radiology Queue</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing Queue</span>
                    <span className="font-medium">6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Flow Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Patient Distribution</CardTitle>
              <CardDescription>Current patient allocation across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.slice(0, 5).map(dept => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <dept.icon className="size-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{dept.name}</p>
                        <Progress value={dept.utilization} className="h-2 mt-1" />
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium">{dept.patients || dept.tests || dept.prescriptions || dept.scans} patients</p>
                      <p className="text-xs text-muted-foreground">{dept.utilization}% capacity</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Insurance & Schemes */}
            <Card>
              <CardHeader>
                <CardTitle>Insurance & Government Schemes</CardTitle>
                <CardDescription>Claims and reimbursements status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceStats.map((insurance) => (
                    <div key={insurance.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{insurance.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {insurance.patients} patients • {insurance.approved || insurance.percentage}% approved
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          ₹{((insurance.claims || insurance.amount || 0) / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <Progress 
                        value={insurance.approved || insurance.percentage} 
                        className="h-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown by Service</CardTitle>
                <CardDescription>Today's revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded" />
                      <span className="text-sm">Consultations</span>
                    </div>
                    <span className="text-sm font-medium">₹5.6L (16%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded" />
                      <span className="text-sm">Surgeries</span>
                    </div>
                    <span className="text-sm font-medium">₹12.9L (37%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded" />
                      <span className="text-sm">Diagnostics</span>
                    </div>
                    <span className="text-sm font-medium">₹8.3L (24%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded" />
                      <span className="text-sm">Pharmacy</span>
                    </div>
                    <span className="text-sm font-medium">₹4.5L (13%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded" />
                      <span className="text-sm">Emergency</span>
                    </div>
                    <span className="text-sm font-medium">₹3.2L (10%)</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <span className="text-lg font-bold">₹34.5L</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Collections */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Collections & Receivables</CardTitle>
              <CardDescription>Outstanding payments by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Insurance Claims</p>
                  <p className="text-2xl font-bold">₹56.2L</p>
                  <Badge variant="outline" className="text-xs">187 claims</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Government Schemes</p>
                  <p className="text-2xl font-bold">₹34.8L</p>
                  <Badge variant="outline" className="text-xs">234 claims</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Patient Dues</p>
                  <p className="text-2xl font-bold">₹18.4L</p>
                  <Badge variant="outline" className="text-xs">456 patients</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Corporate Tie-ups</p>
                  <p className="text-2xl font-bold">₹12.7L</p>
                  <Badge variant="outline" className="text-xs">23 companies</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Clinical Quality Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clinical Quality Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualityMetrics.clinicalIndicators.map(indicator => (
                  <div key={indicator.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{indicator.name}</span>
                      <span className={`font-medium ${indicator.value <= indicator.target ? 'text-green-600' : 'text-red-600'}`}>
                        {indicator.value}{indicator.unit}
                      </span>
                    </div>
                    <Progress 
                      value={100 - (indicator.value / indicator.target) * 100} 
                      className="h-1" 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Patient Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Patient Satisfaction Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualityMetrics.patientSatisfaction.map(item => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.category}</span>
                      <span className="font-medium">{item.score}/{item.max}</span>
                    </div>
                    <Progress value={(item.score / item.max) * 100} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Operational Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Operational Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualityMetrics.operationalEfficiency.map(metric => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <span className={`font-medium ${metric.good ? 'text-green-600' : 'text-orange-600'}`}>
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-1" 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Compliance & Accreditation */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Accreditation Status</CardTitle>
              <CardDescription>Regulatory compliance and quality certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="flex items-center gap-3">
                  <Shield className="size-8 text-green-600" />
                  <div>
                    <p className="font-medium">NABH</p>
                    <p className="text-xs text-muted-foreground">Accredited</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="size-8 text-green-600" />
                  <div>
                    <p className="font-medium">ISO 9001:2015</p>
                    <p className="text-xs text-muted-foreground">Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="size-8 text-blue-600" />
                  <div>
                    <p className="font-medium">NABL</p>
                    <p className="text-xs text-muted-foreground">Lab Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="size-8 text-green-600" />
                  <div>
                    <p className="font-medium">AERB</p>
                    <p className="text-xs text-muted-foreground">Compliant</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="size-8 text-green-600" />
                  <div>
                    <p className="font-medium">Pollution Control</p>
                    <p className="text-xs text-muted-foreground">Valid till Mar 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {criticalAlerts.map((alert, idx) => (
              <Alert key={idx} className={getAlertColor(alert.type)}>
                <AlertCircle className="size-4" />
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="font-medium">{alert.category}</p>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                  <Button size="sm" variant="outline">{alert.action}</Button>
                </div>
              </Alert>
            ))}
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status & Health</CardTitle>
              <CardDescription>Real-time monitoring of critical systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HIS System</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <Progress value={100} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lab Interface</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <Progress value={100} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PACS System</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Slow</Badge>
                  </div>
                  <Progress value={75} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <Progress value={100} className="h-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Analytics Report</DialogTitle>
            <DialogDescription>
              Select the format and time range for your analytics export
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="json">JSON Format</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Range</Label>
              <Select defaultValue={timeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Include Sections</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Overview & KPIs</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Department Performance</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Financial Analytics</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Quality Metrics</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Detailed Patient Data</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea placeholder="Add any specific notes for this report..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                <Download className="mr-2 size-4" />
                Export Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          <span>Real-time data streaming active</span>
        </div>
      </div>
    </div>
  );
}