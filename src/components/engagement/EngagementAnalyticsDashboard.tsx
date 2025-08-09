'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Activity,
  Award,
  AlertCircle,
  MessageSquare,
  Calendar,
  DollarSign,
  Heart,
  UserCheck,
  UserX,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
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
  Area,
  AreaChart,
} from 'recharts';

const EngagementAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, segmentsRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/patient/segments'),
      ]);
      
      const campaignsData = await campaignsRes.json();
      const segmentsData = await segmentsRes.json();
      
      setCampaigns(campaignsData.data || []);
      setSegments(segmentsData.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const engagementTrend = [
    { month: 'Jan', score: 45, patients: 2100 },
    { month: 'Feb', score: 52, patients: 2250 },
    { month: 'Mar', score: 58, patients: 2400 },
    { month: 'Apr', score: 65, patients: 2600 },
    { month: 'May', score: 72, patients: 2850 },
    { month: 'Jun', score: 78, patients: 3100 },
  ];

  const journeyDistribution = [
    { stage: 'Awareness', value: 15, color: '#94a3b8' },
    { stage: 'Consideration', value: 25, color: '#60a5fa' },
    { stage: 'Active', value: 45, color: '#34d399' },
    { stage: 'Loyal', value: 10, color: '#a78bfa' },
    { stage: 'At Risk', value: 5, color: '#f87171' },
  ];

  const channelPerformance = [
    { channel: 'WhatsApp', sent: 5000, opened: 4200, clicked: 1800, converted: 450 },
    { channel: 'Email', sent: 3500, opened: 2100, clicked: 800, converted: 200 },
    { channel: 'SMS', sent: 4000, opened: 3600, clicked: 1200, converted: 300 },
    { channel: 'Phone', sent: 1000, opened: 950, clicked: 850, converted: 400 },
  ];

  const keyMetrics = [
    {
      title: 'Overall Engagement',
      value: '72%',
      change: '+12%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600',
    },
    {
      title: 'Active Patients',
      value: '8,456',
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Campaign ROI',
      value: '3.2x',
      change: '+0.5x',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'At-Risk Patients',
      value: '567',
      change: '-8%',
      trend: 'down',
      icon: AlertCircle,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patient Engagement Analytics</h1>
          <p className="text-gray-600 mt-1">
            Monitor engagement metrics and campaign performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement Trends</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="segments">Segment Analysis</TabsTrigger>
          <TabsTrigger value="journey">Patient Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Engagement Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Score Trend</CardTitle>
                <CardDescription>
                  Average patient engagement score over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>
                  Communication channel effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="opened" fill="#60a5fa" name="Opened" />
                    <Bar dataKey="clicked" fill="#34d399" name="Clicked" />
                    <Bar dataKey="converted" fill="#a78bfa" name="Converted" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Patient Journey Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Journey Stages</CardTitle>
              <CardDescription>
                Distribution of patients across engagement journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={journeyDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.stage}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {journeyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  {journeyDistribution.map((stage, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={stage.value} className="w-24" />
                        <span className="text-sm font-medium w-12 text-right">
                          {stage.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>
                Performance metrics for running campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.campaignId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{campaign.campaignName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {campaign.targetSegments.join(', ')}
                        </p>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{campaign.metrics.sent}</p>
                        <p className="text-xs text-gray-600">Sent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {Math.round((campaign.metrics.opened / campaign.metrics.sent) * 100)}%
                        </p>
                        <p className="text-xs text-gray-600">Open Rate</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {Math.round((campaign.metrics.clicked / campaign.metrics.sent) * 100)}%
                        </p>
                        <p className="text-xs text-gray-600">Click Rate</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.metrics.converted}</p>
                        <p className="text-xs text-gray-600">Converted</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.metrics.roi}x</p>
                        <p className="text-xs text-gray-600">ROI</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {segments.slice(0, 4).map((segment) => (
              <Card key={segment.segmentId}>
                <CardHeader>
                  <CardTitle className="text-lg">{segment.segmentName}</CardTitle>
                  <CardDescription>{segment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Patient Count</span>
                      <span className="font-semibold">{segment.patientCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Engagement</span>
                      <div className="flex items-center gap-2">
                        <Progress value={segment.avgEngagement} className="w-20" />
                        <span className="font-semibold">{segment.avgEngagement}%</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-2">Top Channels:</p>
                      <div className="flex gap-2">
                        {segment.behavior?.preferredChannels?.map((channel: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journey Analytics</CardTitle>
              <CardDescription>
                Patient movement through engagement stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-600 py-8">
                Advanced journey analytics visualization coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EngagementAnalyticsDashboard;