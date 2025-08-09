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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Heart,
  Award,
  Calendar,
  Target,
  Activity,
  MapPin,
} from 'lucide-react';

const CSRAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('year');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/csr/analytics?range=${dateRange}`);
      const data = await response.json();
      
      if (data.data) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching CSR analytics:', error);
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

  // Mock data for visualization
  const impactMetricsData = [
    { category: 'Health Camps', value: 8500, target: 10000 },
    { category: 'Vaccinations', value: 12000, target: 15000 },
    { category: 'Screenings', value: 6500, target: 8000 },
    { category: 'Education', value: 4200, target: 5000 },
    { category: 'Blood Donation', value: 850, target: 1000 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', beneficiaries: 2100, volunteers: 45, events: 8 },
    { month: 'Feb', beneficiaries: 2400, volunteers: 52, events: 10 },
    { month: 'Mar', beneficiaries: 2800, volunteers: 58, events: 12 },
    { month: 'Apr', beneficiaries: 3200, volunteers: 65, events: 14 },
    { month: 'May', beneficiaries: 3500, volunteers: 72, events: 16 },
    { month: 'Jun', beneficiaries: 3800, volunteers: 78, events: 18 },
  ];

  const demographicData = [
    { name: 'Children (0-12)', value: 35, color: '#3B82F6' },
    { name: 'Youth (13-25)', value: 25, color: '#10B981' },
    { name: 'Adults (26-60)', value: 30, color: '#F59E0B' },
    { name: 'Seniors (60+)', value: 10, color: '#8B5CF6' },
  ];

  const programEffectivenessData = [
    { subject: 'Reach', A: 85, fullMark: 100 },
    { subject: 'Engagement', A: 78, fullMark: 100 },
    { subject: 'Health Outcomes', A: 82, fullMark: 100 },
    { subject: 'Cost Efficiency', A: 90, fullMark: 100 },
    { subject: 'Volunteer Satisfaction', A: 88, fullMark: 100 },
    { subject: 'Community Feedback', A: 92, fullMark: 100 },
  ];

  const topProgramsData = [
    { name: 'Rural Health Camps', beneficiaries: 4500, satisfaction: 92 },
    { name: 'School Vaccination Drive', beneficiaries: 3200, satisfaction: 95 },
    { name: 'Diabetes Screening', beneficiaries: 2800, satisfaction: 88 },
    { name: 'Mental Health Awareness', beneficiaries: 2100, satisfaction: 90 },
    { name: 'Senior Care Initiative', beneficiaries: 1500, satisfaction: 94 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CSR Impact Analytics</h2>
          <p className="text-gray-600">Community health programs and social impact metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Impact Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Beneficiaries</p>
                <p className="text-2xl font-bold">31,250</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18.5% from last year
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
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Activity className="w-4 h-4 mr-1" />
                  6 new this quarter
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Volunteer Hours</p>
                <p className="text-2xl font-bold">8,420</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <Award className="w-4 h-4 mr-1" />
                  Worth ₹16.8L
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Community Rating</p>
                <p className="text-2xl font-bold">4.8/5</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Award className="w-4 h-4 mr-1" />
                  Excellent feedback
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="impact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
          <TabsTrigger value="programs">Program Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Impact by Category</CardTitle>
                <CardDescription>Beneficiaries reached vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={impactMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" name="Actual" />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Program Effectiveness Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Program Effectiveness</CardTitle>
                <CardDescription>Multi-dimensional assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={programEffectivenessData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Programs</CardTitle>
              <CardDescription>Programs with highest community impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProgramsData.map((program, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{program.name}</h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          <Users className="w-4 h-4 inline mr-1" />
                          {program.beneficiaries.toLocaleString()} beneficiaries
                        </span>
                        <span className="text-sm text-gray-600">
                          <Award className="w-4 h-4 inline mr-1" />
                          {program.satisfaction}% satisfaction
                        </span>
                      </div>
                    </div>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Beneficiary Demographics</CardTitle>
                <CardDescription>Age distribution of program participants</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={demographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Coverage</CardTitle>
                <CardDescription>Program reach across regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Urban Areas', 'Rural Villages', 'Tribal Regions', 'Slum Areas'].map((area, index) => {
                    const coverage = [65, 85, 45, 70][index];
                    return (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {area}
                          </span>
                          <span className="text-sm">{coverage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${coverage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Program growth and volunteer engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="beneficiaries"
                    stroke="#3B82F6"
                    name="Beneficiaries"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="volunteers"
                    stroke="#10B981"
                    name="Volunteers"
                    strokeWidth={2}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="events"
                    fill="#F59E0B"
                    name="Events"
                    opacity={0.6}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CSRAnalyticsDashboard;