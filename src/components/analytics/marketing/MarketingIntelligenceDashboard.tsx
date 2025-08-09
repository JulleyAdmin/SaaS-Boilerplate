'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Users,
  IndianRupee,
  Calendar,
  Filter,
  Download,
  Eye,
  MousePointer,
  UserCheck,
  ShoppingCart,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Smartphone,
  Facebook,
  Instagram,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
} from 'lucide-react';
import { campaignData, generateMonthlyTrends } from '@/lib/demo/analyticsData';
import { toast } from '@/components/ui/use-toast';

const MarketingIntelligenceDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [campaignType, setCampaignType] = useState('all');
  const [channel, setChannel] = useState('all');
  const [loading, setLoading] = useState(false);

  // Channel performance data
  const channelData = [
    { channel: 'WhatsApp', reach: 45000, engagement: 8900, conversions: 892, cost: 280000, roi: 18.5 },
    { channel: 'SMS', reach: 38000, engagement: 5600, conversions: 1234, cost: 180000, roi: 22.3 },
    { channel: 'Facebook', reach: 67000, engagement: 12300, conversions: 567, cost: 450000, roi: 14.2 },
    { channel: 'Instagram', reach: 34000, engagement: 8900, conversions: 345, cost: 320000, roi: 11.2 },
    { channel: 'Google Ads', reach: 28000, engagement: 3400, conversions: 423, cost: 680000, roi: 9.8 },
    { channel: 'Email', reach: 23000, engagement: 4500, conversions: 678, cost: 120000, roi: 19.7 },
  ];

  // Customer acquisition funnel
  const acquisitionFunnel = [
    { stage: 'Impressions', value: 285000, color: '#3B82F6' },
    { stage: 'Clicks', value: 34200, color: '#10B981' },
    { stage: 'Inquiries', value: 8900, color: '#F59E0B' },
    { stage: 'Appointments', value: 4567, color: '#8B5CF6' },
    { stage: 'Conversions', value: 2134, color: '#EC4899' },
    { stage: 'Retention', value: 1678, color: '#EF4444' },
  ];

  // Campaign performance comparison
  const campaignComparison = campaignData.map(campaign => ({
    name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name,
    budget: campaign.budget / 1000,
    spent: campaign.spent / 1000,
    revenue: campaign.revenue / 1000,
    roi: campaign.roi,
  }));

  // Attribution model data
  const attributionData = [
    { model: 'First Touch', value: 34, fill: '#3B82F6' },
    { model: 'Last Touch', value: 42, fill: '#10B981' },
    { model: 'Linear', value: 28, fill: '#F59E0B' },
    { model: 'Time Decay', value: 31, fill: '#8B5CF6' },
    { model: 'Position Based', value: 26, fill: '#EC4899' },
  ];

  // Audience segments performance
  const segmentData = [
    { segment: 'Young Adults', size: 45000, engaged: 12340, conversion: 27.4, value: 8500 },
    { segment: 'Families', size: 32000, engaged: 8900, conversion: 27.8, value: 15000 },
    { segment: 'Senior Citizens', size: 28000, engaged: 9800, conversion: 35.0, value: 12000 },
    { segment: 'Corporate', size: 38000, engaged: 15600, conversion: 41.1, value: 10000 },
    { segment: 'Chronic Patients', size: 15000, engaged: 8900, conversion: 59.3, value: 25000 },
  ];

  // Monthly trend data
  const monthlyData = generateMonthlyTrends();

  // Content performance
  const contentPerformance = [
    { type: 'Educational', posts: 45, engagement: 12340, shares: 890, clicks: 3456 },
    { type: 'Promotional', posts: 32, engagement: 8900, shares: 567, clicks: 2345 },
    { type: 'Testimonials', posts: 28, engagement: 15600, shares: 1234, clicks: 4567 },
    { type: 'Health Tips', posts: 56, engagement: 23400, shares: 2345, clicks: 6789 },
    { type: 'Events', posts: 12, engagement: 4500, shares: 234, clicks: 890 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'];

  const handleExportReport = () => {
    toast({
      title: 'Export Started',
      description: 'Downloading marketing analytics report...',
    });
  };

  const getChangeIndicator = (value: number) => {
    if (value > 0) {
      return <ArrowUpRight className="size-4 text-green-600" />;
    } else if (value < 0) {
      return <ArrowDownRight className="size-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Intelligence</h1>
          <p className="text-muted-foreground">
            Campaign performance, ROI tracking, and customer insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.85L</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="mr-1 size-3" />
              +23% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3%</div>
            <Progress value={12.3} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,139</div>
            <p className="text-xs text-muted-foreground mt-1">New patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16.8x</div>
            <p className="text-xs text-muted-foreground mt-1">₹16.8 per ₹1 spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost per Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹485</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowDownRight className="mr-1 size-3" />
              -12% improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Budget vs Revenue comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `₹${value}K`} />
                    <Legend />
                    <Bar dataKey="budget" fill="#94A3B8" name="Budget" />
                    <Bar dataKey="spent" fill="#F59E0B" name="Spent" />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Acquisition Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition Funnel</CardTitle>
                <CardDescription>Journey from impression to retention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {acquisitionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <span className="text-sm text-muted-foreground">
                          {stage.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={(stage.value / acquisitionFunnel[0].value) * 100} 
                          className="h-3"
                        />
                        {index > 0 && (
                          <span className="absolute right-0 -top-5 text-xs text-muted-foreground">
                            {((stage.value / acquisitionFunnel[index - 1].value) * 100).toFixed(1)}% conv
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Currently running marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignData.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {campaign.channels.join(', ')} • {campaign.reached.toLocaleString()} reached
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Budget: ₹{(campaign.budget / 1000).toFixed(0)}K</span>
                        <span>Spent: ₹{(campaign.spent / 1000).toFixed(0)}K</span>
                        <span className="font-medium text-green-600">ROI: {campaign.roi}x</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{campaign.conversions}</p>
                      <p className="text-sm text-muted-foreground">conversions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>ROI by marketing channel</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="channel" type="category" width={80} />
                    <Tooltip formatter={(value: any) => `${value}x ROI`} />
                    <Bar dataKey="roi" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Channel Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Metrics</CardTitle>
                <CardDescription>Detailed performance by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.slice(0, 4).map((channel) => (
                    <div key={channel.channel} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{channel.channel}</span>
                        <Badge variant="outline">{channel.roi}x ROI</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Reach</p>
                          <p className="font-medium">{(channel.reach / 1000).toFixed(1)}K</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversions</p>
                          <p className="font-medium">{channel.conversions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cost</p>
                          <p className="font-medium">₹{(channel.cost / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Channel Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Trends</CardTitle>
              <CardDescription>Monthly performance across channels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#3B82F6" name="Total Reach" />
                  <Line type="monotone" dataKey="newPatients" stroke="#10B981" name="Conversions" />
                  <Line type="monotone" dataKey="referrals" stroke="#F59E0B" name="Referrals" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Segment Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Segments</CardTitle>
                <CardDescription>Performance by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={segmentData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="segment" />
                    <PolarRadiusAxis angle={90} domain={[0, 60]} />
                    <Radar name="Conversion %" dataKey="conversion" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Segment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Segment Details</CardTitle>
                <CardDescription>Size, engagement, and value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentData.map((segment) => (
                    <div key={segment.segment} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{segment.segment}</p>
                        <p className="text-sm text-muted-foreground">
                          {(segment.size / 1000).toFixed(0)}K audience • ₹{segment.value.toLocaleString()} avg value
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{segment.conversion.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">conversion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>Age, gender, and location distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Age Distribution */}
                <div>
                  <h4 className="font-medium mb-3">Age Groups</h4>
                  <div className="space-y-2">
                    {[
                      { age: '18-25', percentage: 22 },
                      { age: '26-35', percentage: 34 },
                      { age: '36-50', percentage: 28 },
                      { age: '51-65', percentage: 12 },
                      { age: '65+', percentage: 4 },
                    ].map((group) => (
                      <div key={group.age} className="flex items-center justify-between">
                        <span className="text-sm">{group.age}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={group.percentage} className="w-20 h-2" />
                          <span className="text-sm font-medium w-10">{group.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                <div>
                  <h4 className="font-medium mb-3">Gender</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Male', value: 48, fill: '#3B82F6' },
                          { name: 'Female', value: 52, fill: '#EC4899' },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Locations */}
                <div>
                  <h4 className="font-medium mb-3">Top Locations</h4>
                  <div className="space-y-2">
                    {[
                      { area: 'Koramangala', patients: 456 },
                      { area: 'Indiranagar', patients: 389 },
                      { area: 'Whitefield', patients: 367 },
                      { area: 'HSR Layout', patients: 334 },
                      { area: 'Jayanagar', patients: 312 },
                    ].map((location) => (
                      <div key={location.area} className="flex items-center justify-between">
                        <span className="text-sm">{location.area}</span>
                        <Badge variant="outline">{location.patients}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attribution Tab */}
        <TabsContent value="attribution" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Attribution Models */}
            <Card>
              <CardHeader>
                <CardTitle>Attribution Models</CardTitle>
                <CardDescription>Credit distribution across touchpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {attributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Journey */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Journey</CardTitle>
                <CardDescription>Average touchpoints before conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="size-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Website Visit</p>
                        <p className="text-sm text-muted-foreground">First touchpoint</p>
                      </div>
                    </div>
                    <Badge>78%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="size-5 text-green-500" />
                      <div>
                        <p className="font-medium">WhatsApp Inquiry</p>
                        <p className="text-sm text-muted-foreground">Second touchpoint</p>
                      </div>
                    </div>
                    <Badge>45%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="size-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Phone Call</p>
                        <p className="text-sm text-muted-foreground">Third touchpoint</p>
                      </div>
                    </div>
                    <Badge>32%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Appointment Booking</p>
                        <p className="text-sm text-muted-foreground">Conversion</p>
                      </div>
                    </div>
                    <Badge variant="default">23%</Badge>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Average Journey</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3.4 touchpoints • 5.2 days • 67% complete journey
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Engagement metrics by content type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#3B82F6" name="Engagement" />
                  <Bar dataKey="shares" fill="#10B981" name="Shares" />
                  <Bar dataKey="clicks" fill="#F59E0B" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Top Performing Content</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>"Heart Health Tips for Seniors"</span>
                      <Badge variant="outline">23K views</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>"Free Health Camp Announcement"</span>
                      <Badge variant="outline">18K views</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>"Patient Success Story - Cardiac"</span>
                      <Badge variant="outline">15K views</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Content Strategy Insights</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Health tips content gets 45% more engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Video content has 3x higher conversion rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Best posting time: 10 AM - 12 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingIntelligenceDashboard;