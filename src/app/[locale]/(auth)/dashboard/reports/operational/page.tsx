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
  Clock,
  Bed,
  UserCheck,
  Building,
  AlertCircle,
  CheckCircle,
  Package,
  Truck,
  Settings,
  Zap,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const OperationalReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Operational KPIs
  const operationalKPIs = {
    bedOccupancy: 78.5,
    avgWaitTime: 23,
    staffUtilization: 82,
    equipmentUptime: 96.5,
    patientSatisfaction: 4.3,
    emergencyResponseTime: 8,
    operatingRoomUtilization: 71,
    inventoryTurnover: 4.2,
  };

  // Bed occupancy trends
  const bedOccupancyData = [
    { month: 'Jul', general: 75, icu: 85, emergency: 92, pediatric: 68 },
    { month: 'Aug', general: 78, icu: 88, emergency: 95, pediatric: 72 },
    { month: 'Sep', general: 82, icu: 90, emergency: 88, pediatric: 75 },
    { month: 'Oct', general: 79, icu: 87, emergency: 91, pediatric: 70 },
    { month: 'Nov', general: 81, icu: 92, emergency: 94, pediatric: 73 },
    { month: 'Dec', general: 84, icu: 89, emergency: 96, pediatric: 76 },
  ];

  // Staff productivity data
  const staffProductivityData = [
    { department: 'Emergency', efficiency: 92, satisfaction: 4.2, overtime: 12 },
    { department: 'ICU', efficiency: 88, satisfaction: 4.0, overtime: 18 },
    { department: 'General Ward', efficiency: 85, satisfaction: 4.3, overtime: 8 },
    { department: 'OPD', efficiency: 90, satisfaction: 4.5, overtime: 5 },
    { department: 'Laboratory', efficiency: 94, satisfaction: 4.4, overtime: 6 },
    { department: 'Pharmacy', efficiency: 91, satisfaction: 4.3, overtime: 7 },
    { department: 'Radiology', efficiency: 87, satisfaction: 4.1, overtime: 10 },
    { department: 'Administration', efficiency: 83, satisfaction: 4.0, overtime: 4 },
  ];

  // Resource utilization
  const resourceUtilization = [
    { resource: 'Operating Rooms', utilized: 71, available: 29 },
    { resource: 'ICU Beds', utilized: 89, available: 11 },
    { resource: 'Ventilators', utilized: 65, available: 35 },
    { resource: 'MRI Scanner', utilized: 78, available: 22 },
    { resource: 'CT Scanner', utilized: 82, available: 18 },
    { resource: 'X-Ray Machines', utilized: 91, available: 9 },
    { resource: 'Ambulances', utilized: 73, available: 27 },
    { resource: 'Dialysis Units', utilized: 86, available: 14 },
  ];

  // Wait time analysis
  const waitTimeData = [
    { service: 'Emergency', avgWait: 8, target: 10, variance: 2 },
    { service: 'OPD Consultation', avgWait: 35, target: 30, variance: 8 },
    { service: 'Laboratory', avgWait: 45, target: 40, variance: 10 },
    { service: 'Radiology', avgWait: 25, target: 20, variance: 5 },
    { service: 'Pharmacy', avgWait: 15, target: 15, variance: 3 },
    { service: 'Admission', avgWait: 20, target: 15, variance: 7 },
    { service: 'Discharge', avgWait: 30, target: 25, variance: 12 },
  ];

  // Supply chain metrics
  const supplyChainData = [
    { month: 'Jul', stockouts: 3, onTime: 92, cost: 145000 },
    { month: 'Aug', stockouts: 2, onTime: 94, cost: 138000 },
    { month: 'Sep', stockouts: 4, onTime: 89, cost: 152000 },
    { month: 'Oct', stockouts: 1, onTime: 96, cost: 141000 },
    { month: 'Nov', stockouts: 2, onTime: 93, cost: 147000 },
    { month: 'Dec', stockouts: 3, onTime: 91, cost: 155000 },
  ];

  // Department performance radar
  const departmentPerformance = [
    { metric: 'Efficiency', emergency: 92, icu: 88, ward: 85, opd: 90, lab: 94 },
    { metric: 'Quality', emergency: 88, icu: 95, ward: 87, opd: 86, lab: 92 },
    { metric: 'Safety', emergency: 90, icu: 96, ward: 91, opd: 89, lab: 94 },
    { metric: 'Satisfaction', emergency: 85, icu: 82, ward: 88, opd: 91, lab: 89 },
    { metric: 'Compliance', emergency: 93, icu: 97, ward: 92, opd: 90, lab: 95 },
  ];

  // Equipment maintenance
  const maintenanceData = [
    { equipment: 'MRI Scanner', lastService: '2024-11-15', nextService: '2025-01-15', status: 'Good', uptime: 98 },
    { equipment: 'CT Scanner', lastService: '2024-12-01', nextService: '2025-02-01', status: 'Good', uptime: 96 },
    { equipment: 'Ventilators', lastService: '2024-12-10', nextService: '2025-01-10', status: 'Maintenance Due', uptime: 94 },
    { equipment: 'X-Ray Machine', lastService: '2024-11-20', nextService: '2025-01-20', status: 'Good', uptime: 97 },
    { equipment: 'Dialysis Units', lastService: '2024-12-05', nextService: '2025-02-05', status: 'Good', uptime: 95 },
    { equipment: 'ECG Machines', lastService: '2024-11-25', nextService: '2025-01-25', status: 'Good', uptime: 99 },
    { equipment: 'Defibrillators', lastService: '2024-12-08', nextService: '2025-01-08', status: 'Critical', uptime: 92 },
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
          <h1 className="text-3xl font-bold">Operational Reports</h1>
          <p className="text-gray-600 mt-1">
            Hospital operations, efficiency metrics, and resource utilization
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
              <label className="text-sm font-medium mb-1 block">Metric Focus</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Metrics</option>
                <option value="efficiency">Efficiency</option>
                <option value="utilization">Utilization</option>
                <option value="quality">Quality</option>
                <option value="supply">Supply Chain</option>
              </select>
            </div>
            <Button className="ml-auto">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Operational KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <Bed className="w-6 h-6 text-cyan-500 mb-2" />
              <p className="text-xs text-gray-600">Bed Occupancy</p>
              <p className="text-xl font-bold">{operationalKPIs.bedOccupancy}%</p>
              <p className="text-xs text-green-600 mt-1">↑ Optimal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <Clock className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-xs text-gray-600">Avg Wait Time</p>
              <p className="text-xl font-bold">{operationalKPIs.avgWaitTime} min</p>
              <p className="text-xs text-green-600 mt-1">↓ 5 min</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <UserCheck className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-xs text-gray-600">Staff Utilization</p>
              <p className="text-xl font-bold">{operationalKPIs.staffUtilization}%</p>
              <p className="text-xs text-gray-500 mt-1">Good</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <Settings className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-xs text-gray-600">Equipment Uptime</p>
              <p className="text-xl font-bold">{operationalKPIs.equipmentUptime}%</p>
              <p className="text-xs text-green-600 mt-1">Excellent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <Users className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-xs text-gray-600">Patient Satisfaction</p>
              <p className="text-xl font-bold">{operationalKPIs.patientSatisfaction}/5</p>
              <p className="text-xs text-green-600 mt-1">↑ 0.2</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-xs text-gray-600">Emergency Response</p>
              <p className="text-xl font-bold">{operationalKPIs.emergencyResponseTime} min</p>
              <p className="text-xs text-green-600 mt-1">On Target</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <Building className="w-6 h-6 text-indigo-500 mb-2" />
              <p className="text-xs text-gray-600">OR Utilization</p>
              <p className="text-xl font-bold">{operationalKPIs.operatingRoomUtilization}%</p>
              <p className="text-xs text-gray-500 mt-1">Normal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <Package className="w-6 h-6 text-gray-500 mb-2" />
              <p className="text-xs text-gray-600">Inventory Turnover</p>
              <p className="text-xl font-bold">{operationalKPIs.inventoryTurnover}x</p>
              <p className="text-xs text-green-600 mt-1">Efficient</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different operational aspects */}
      <Tabs defaultValue="utilization" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="utilization">Resource Utilization</TabsTrigger>
          <TabsTrigger value="efficiency">Staff Efficiency</TabsTrigger>
          <TabsTrigger value="wait">Wait Times</TabsTrigger>
          <TabsTrigger value="bed">Bed Management</TabsTrigger>
          <TabsTrigger value="supply">Supply Chain</TabsTrigger>
          <TabsTrigger value="maintenance">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization Rates</CardTitle>
                <CardDescription>Current utilization of hospital resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={resourceUtilization} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="resource" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="utilized" stackId="a" fill="#06B6D4" name="Utilized %" />
                    <Bar dataKey="available" stackId="a" fill="#E5E7EB" name="Available %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance Matrix</CardTitle>
                <CardDescription>Multi-dimensional performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={departmentPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Emergency" dataKey="emergency" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    <Radar name="ICU" dataKey="icu" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    <Radar name="Ward" dataKey="ward" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Radar name="OPD" dataKey="opd" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Productivity & Efficiency</CardTitle>
              <CardDescription>Department-wise staff performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffProductivityData.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{dept.department}</h4>
                      <div className="flex gap-4">
                        <span className="text-sm">
                          <span className="text-gray-600">Efficiency: </span>
                          <span className="font-semibold text-cyan-600">{dept.efficiency}%</span>
                        </span>
                        <span className="text-sm">
                          <span className="text-gray-600">Satisfaction: </span>
                          <span className="font-semibold text-green-600">{dept.satisfaction}/5</span>
                        </span>
                        <span className="text-sm">
                          <span className="text-gray-600">Overtime: </span>
                          <span className={`font-semibold ${dept.overtime > 10 ? 'text-red-600' : 'text-gray-600'}`}>
                            {dept.overtime}%
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${dept.efficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wait" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Wait Time Analysis</CardTitle>
              <CardDescription>Average wait times vs target times (in minutes)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgWait" fill="#06B6D4" name="Average Wait" />
                  <Bar dataKey="target" fill="#10B981" name="Target Time" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {waitTimeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{item.service}</span>
                    <span className={`text-sm font-semibold ${
                      item.avgWait > item.target ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.avgWait > item.target ? `+${item.avgWait - item.target} min` : 'On Target'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bed Occupancy Trends</CardTitle>
              <CardDescription>Department-wise bed utilization over 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={bedOccupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="general" stroke="#06B6D4" name="General Ward" strokeWidth={2} />
                  <Line type="monotone" dataKey="icu" stroke="#8B5CF6" name="ICU" strokeWidth={2} />
                  <Line type="monotone" dataKey="emergency" stroke="#EF4444" name="Emergency" strokeWidth={2} />
                  <Line type="monotone" dataKey="pediatric" stroke="#10B981" name="Pediatric" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">General Ward</p>
                  <p className="text-2xl font-bold text-cyan-600">84%</p>
                  <p className="text-xs text-gray-500">Current</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">ICU</p>
                  <p className="text-2xl font-bold text-purple-600">89%</p>
                  <p className="text-xs text-yellow-600">High</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Emergency</p>
                  <p className="text-2xl font-bold text-red-600">96%</p>
                  <p className="text-xs text-red-600">Critical</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Pediatric</p>
                  <p className="text-2xl font-bold text-green-600">76%</p>
                  <p className="text-xs text-green-600">Optimal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supply" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Performance</CardTitle>
              <CardDescription>Inventory management and procurement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={supplyChainData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="stockouts" stroke="#EF4444" name="Stockouts" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="onTime" stroke="#10B981" name="On-Time Delivery %" strokeWidth={2} />
                  <Bar yAxisId="left" dataKey="cost" fill="#06B6D4" name="Cost (₹)" opacity={0.3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Maintenance Schedule</CardTitle>
              <CardDescription>Critical equipment service status and uptime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className={`w-5 h-5 ${
                          item.status === 'Critical' ? 'text-red-500' :
                          item.status === 'Maintenance Due' ? 'text-yellow-500' :
                          'text-green-500'
                        }`} />
                        <div>
                          <p className="font-semibold">{item.equipment}</p>
                          <p className="text-sm text-gray-600">
                            Last: {item.lastService} | Next: {item.nextService}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'Critical' ? 'bg-red-100 text-red-800' :
                          item.status === 'Maintenance Due' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">Uptime: {item.uptime}%</p>
                      </div>
                    </div>
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

export default OperationalReportsPage;