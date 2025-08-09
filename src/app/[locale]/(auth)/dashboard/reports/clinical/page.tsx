'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  Filter,
  Printer,
  Share2,
  Heart,
  Stethoscope,
  Pill,
  TestTube,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const ClinicalReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data for patient statistics
  const patientStats = {
    totalPatients: 2456,
    newPatients: 342,
    readmissions: 45,
    avgStayDays: 3.5,
    mortalityRate: 1.2,
    recoveryRate: 94.5,
  };

  // Department-wise patient distribution
  const departmentData = [
    { name: 'General Medicine', patients: 450, percentage: 18.3 },
    { name: 'Cardiology', patients: 380, percentage: 15.5 },
    { name: 'Orthopedics', patients: 320, percentage: 13.0 },
    { name: 'Pediatrics', patients: 290, percentage: 11.8 },
    { name: 'Gynecology', patients: 270, percentage: 11.0 },
    { name: 'Emergency', patients: 410, percentage: 16.7 },
    { name: 'ICU', patients: 120, percentage: 4.9 },
    { name: 'Others', patients: 216, percentage: 8.8 },
  ];

  // Disease prevalence data
  const diseaseData = [
    { disease: 'Hypertension', cases: 423, severity: 'Moderate' },
    { disease: 'Diabetes', cases: 389, severity: 'High' },
    { disease: 'Respiratory Infections', cases: 342, severity: 'Low' },
    { disease: 'Heart Disease', cases: 267, severity: 'High' },
    { disease: 'Arthritis', cases: 198, severity: 'Moderate' },
    { disease: 'Gastroenteritis', cases: 176, severity: 'Low' },
    { disease: 'Fractures', cases: 143, severity: 'Moderate' },
    { disease: 'Mental Health', cases: 98, severity: 'High' },
  ];

  // Treatment outcomes
  const outcomeData = [
    { month: 'Jul', recovered: 420, ongoing: 89, critical: 12 },
    { month: 'Aug', recovered: 445, ongoing: 95, critical: 15 },
    { month: 'Sep', recovered: 478, ongoing: 102, critical: 18 },
    { month: 'Oct', recovered: 492, ongoing: 98, critical: 14 },
    { month: 'Nov', recovered: 510, ongoing: 105, critical: 16 },
    { month: 'Dec', recovered: 523, ongoing: 110, critical: 20 },
  ];

  // Procedure statistics
  const procedureStats = [
    { procedure: 'Surgeries', count: 234, success: 98.2 },
    { procedure: 'Dialysis', count: 456, success: 100 },
    { procedure: 'Chemotherapy', count: 89, success: 87.5 },
    { procedure: 'MRI Scans', count: 678, success: 100 },
    { procedure: 'CT Scans', count: 543, success: 100 },
    { procedure: 'X-Rays', count: 1234, success: 100 },
    { procedure: 'Blood Tests', count: 3456, success: 99.8 },
    { procedure: 'ECG', count: 892, success: 100 },
  ];

  // Medication usage
  const medicationData = [
    { category: 'Antibiotics', usage: 34, trend: 'up' },
    { category: 'Analgesics', usage: 28, trend: 'stable' },
    { category: 'Cardiovascular', usage: 22, trend: 'up' },
    { category: 'Respiratory', usage: 18, trend: 'down' },
    { category: 'Gastrointestinal', usage: 15, trend: 'stable' },
    { category: 'Endocrine', usage: 12, trend: 'up' },
    { category: 'Others', usage: 21, trend: 'stable' },
  ];

  const COLORS = ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#6B7280'];

  const handleExport = (format: string) => {
    console.log(`Exporting report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Clinical Reports</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive clinical data analysis and patient care metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <FileText className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm font-medium mb-1 block">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Departments</option>
                <option value="medicine">General Medicine</option>
                <option value="cardiology">Cardiology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <Button className="ml-auto">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold">{patientStats.totalPatients.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
              </div>
              <Users className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Admissions</p>
                <p className="text-2xl font-bold">{patientStats.newPatients}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Stay</p>
                <p className="text-2xl font-bold">{patientStats.avgStayDays} days</p>
                <p className="text-xs text-gray-500 mt-1">Per patient</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recovery Rate</p>
                <p className="text-2xl font-bold">{patientStats.recoveryRate}%</p>
                <p className="text-xs text-green-600 mt-1">↑ 2% improvement</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Readmissions</p>
                <p className="text-2xl font-bold">{patientStats.readmissions}</p>
                <p className="text-xs text-yellow-600 mt-1">Within 30 days</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mortality Rate</p>
                <p className="text-2xl font-bold">{patientStats.mortalityRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Below average</p>
              </div>
              <Activity className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different report sections */}
      <Tabs defaultValue="department" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="department">Department Analysis</TabsTrigger>
          <TabsTrigger value="disease">Disease Patterns</TabsTrigger>
          <TabsTrigger value="outcomes">Treatment Outcomes</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="medication">Medication Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="department" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Patient Distribution</CardTitle>
                <CardDescription>Patient count by department this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Utilization</CardTitle>
                <CardDescription>Percentage distribution of patients</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="patients"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disease" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disease Prevalence Analysis</CardTitle>
              <CardDescription>Most common conditions treated this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diseaseData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{item.disease}</span>
                        <span className="text-sm text-gray-600">{item.cases} cases</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.severity === 'High'
                              ? 'bg-red-500'
                              : item.severity === 'Moderate'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(item.cases / 423) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span
                      className={`ml-4 px-2 py-1 text-xs rounded-full ${
                        item.severity === 'High'
                          ? 'bg-red-100 text-red-800'
                          : item.severity === 'Moderate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Outcomes Trend</CardTitle>
              <CardDescription>Patient recovery statistics over last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={outcomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="recovered" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="ongoing" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                  <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Procedures Statistics</CardTitle>
              <CardDescription>Procedures performed and success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {procedureStats.map((proc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-cyan-500" />
                      <div>
                        <p className="font-medium">{proc.procedure}</p>
                        <p className="text-sm text-gray-600">{proc.count} procedures</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{proc.success}%</p>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Usage Patterns</CardTitle>
              <CardDescription>Distribution of prescribed medications by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={medicationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {medicationData.map((med, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{med.category}</span>
                    <span className={`flex items-center gap-1 ${
                      med.trend === 'up' ? 'text-green-600' : 
                      med.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {med.usage}%
                      {med.trend === 'up' ? '↑' : med.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicalReportsPage;