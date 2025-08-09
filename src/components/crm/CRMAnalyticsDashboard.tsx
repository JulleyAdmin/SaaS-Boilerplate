'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  Award,
  Activity,
  Mail,
} from 'lucide-react';

const CRMAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crm/analytics?range=${dateRange}`);
      const data = await response.json();
      
      if (data.data) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching CRM analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hospital-specific lead source data
  const leadSourceData = [
    { name: 'Online Search', value: 25, color: '#3B82F6' },
    { name: 'Patient Referral', value: 22, color: '#10B981' },
    { name: 'Doctor Referral', value: 18, color: '#06B6D4' },
    { name: 'Insurance TPA', value: 15, color: '#F59E0B' },
    { name: 'Walk-in', value: 12, color: '#8B5CF6' },
    { name: 'Health Camps', value: 8, color: '#EC4899' },
  ];

  // Hospital patient acquisition funnel
  const conversionFunnelData = [
    { stage: 'Inquiries', count: 1000, conversion: 100 },
    { stage: 'Contacted', count: 750, conversion: 75 },
    { stage: 'Appointments', count: 450, conversion: 45 },
    { stage: 'Consultations', count: 380, conversion: 38 },
    { stage: 'Treatments', count: 220, conversion: 22 },
    { stage: 'Admissions', count: 120, conversion: 12 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', inquiries: 145, appointments: 68, admissions: 12, revenue: 450000 },
    { month: 'Feb', inquiries: 165, appointments: 75, admissions: 15, revenue: 520000 },
    { month: 'Mar', inquiries: 180, appointments: 82, admissions: 18, revenue: 580000 },
    { month: 'Apr', inquiries: 195, appointments: 92, admissions: 22, revenue: 650000 },
    { month: 'May', inquiries: 210, appointments: 98, admissions: 25, revenue: 720000 },
    { month: 'Jun', inquiries: 225, appointments: 105, admissions: 28, revenue: 780000 },
  ];

  const campaignPerformanceData = [
    { campaign: 'Heart Health Month', sent: 5000, opened: 2500, clicked: 800, appointments: 120, cost: 25000 },
    { campaign: 'Women Wellness', sent: 3000, opened: 1800, clicked: 600, appointments: 90, cost: 18000 },
    { campaign: 'Diabetes Screening', sent: 4000, opened: 2200, clicked: 750, appointments: 110, cost: 22000 },
    { campaign: 'Senior Care Package', sent: 2500, opened: 1500, clicked: 500, appointments: 75, cost: 15000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Patient Acquisition Analytics</h2>
          <p className="text-gray-600">Track patient journey from inquiry to admission</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold">1,225</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admission Rate</p>
                <p className="text-2xl font-bold">12.2%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2.1% improvement
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
                <p className="text-2xl font-bold">₹78.5L</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18.3% growth
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Patient Value</p>
                <p className="text-2xl font-bold">₹65.2K</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Award className="w-4 h-4 mr-1" />
                  Per admission
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
                <CardDescription>Lead generation and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="leads"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name="Leads"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="conversions"
                      stroke="#10B981"
                      name="Conversions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Distribution of leads by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Lead progression through sales stages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={conversionFunnelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" name="Count" />
                  <Bar dataKey="conversion" fill="#10B981" name="Conversion %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Email campaign metrics and effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformanceData.map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{campaign.campaign}</h4>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {campaign.sent} sent
                          </span>
                          <span>
                            {((campaign.opened / campaign.sent) * 100).toFixed(1)}% open rate
                          </span>
                          <span>
                            {((campaign.clicked / campaign.opened) * 100).toFixed(1)}% CTR
                          </span>
                        </div>
                      </div>
                      <Badge variant={campaign.converted > 100 ? "default" : "secondary"}>
                        {campaign.converted} conversions
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(campaign.converted / campaign.sent) * 100 * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Analysis</CardTitle>
              <CardDescription>Detailed breakdown of lead acquisition channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSourceData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: source.color }}
                      />
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <p className="text-sm text-gray-600">
                          {Math.round(1225 * (source.value / 100))} leads
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{source.value}%</p>
                      <p className="text-sm text-gray-600">of total</p>
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

export default CRMAnalyticsDashboard;