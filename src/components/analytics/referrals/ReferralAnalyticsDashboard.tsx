'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  UserPlus,
  TrendingUp,
  IndianRupee,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Stethoscope,
  Calendar,
  Clock,
  Target,
  Gift,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Share2,
  Download,
  Filter,
} from 'lucide-react';
import ReferrerLeaderboard from './ReferrerLeaderboard';
import ReferralFlowDiagram from './ReferralFlowDiagram';
import ReferralROICalculator from './ReferralROICalculator';

interface ReferrerData {
  id: string;
  name: string;
  type: 'Doctor' | 'Patient' | 'Corporate' | 'Insurance';
  specialty?: string;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  avgPatientValue: number;
  lastReferralDate: string;
  trend: 'up' | 'down' | 'stable';
}

interface ReferralMetrics {
  totalReferrals: number;
  conversionRate: number;
  avgConversionTime: number;
  totalRevenue: number;
  avgReferralValue: number;
  topReferrerType: string;
}

export default function ReferralAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30days');
  const [referrerType, setReferrerType] = useState('all');
  const [specialty, setSpecialty] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock metrics data
  const metrics: ReferralMetrics = {
    totalReferrals: 1847,
    conversionRate: 68.5,
    avgConversionTime: 3.2,
    totalRevenue: 8950000,
    avgReferralValue: 12500,
    topReferrerType: 'Doctor',
  };

  // Mock referrer data
  const topReferrers: ReferrerData[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      type: 'Doctor',
      specialty: 'General Physician',
      totalReferrals: 156,
      activeReferrals: 23,
      conversionRate: 82,
      totalRevenue: 1950000,
      avgPatientValue: 12500,
      lastReferralDate: '2024-01-15',
      trend: 'up',
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      type: 'Doctor',
      specialty: 'Pediatrician',
      totalReferrals: 134,
      activeReferrals: 18,
      conversionRate: 78,
      totalRevenue: 1675000,
      avgPatientValue: 12500,
      lastReferralDate: '2024-01-14',
      trend: 'up',
    },
    {
      id: '3',
      name: 'Apollo Clinics',
      type: 'Corporate',
      totalReferrals: 98,
      activeReferrals: 12,
      conversionRate: 71,
      totalRevenue: 1225000,
      avgPatientValue: 12500,
      lastReferralDate: '2024-01-13',
      trend: 'stable',
    },
    {
      id: '4',
      name: 'Star Health Insurance',
      type: 'Insurance',
      totalReferrals: 87,
      activeReferrals: 15,
      conversionRate: 65,
      totalRevenue: 1087500,
      avgPatientValue: 12500,
      lastReferralDate: '2024-01-12',
      trend: 'down',
    },
    {
      id: '5',
      name: 'Dr. Amit Verma',
      type: 'Doctor',
      specialty: 'Cardiologist',
      totalReferrals: 76,
      activeReferrals: 9,
      conversionRate: 88,
      totalRevenue: 950000,
      avgPatientValue: 12500,
      lastReferralDate: '2024-01-11',
      trend: 'up',
    },
  ];

  // Referral source breakdown
  const referralSources = [
    { source: 'Doctors', count: 892, percentage: 48, revenue: 4460000, color: '#3B82F6' },
    { source: 'Patients', count: 456, percentage: 25, revenue: 2280000, color: '#10B981' },
    { source: 'Corporate', count: 289, percentage: 16, revenue: 1445000, color: '#F59E0B' },
    { source: 'Insurance', count: 134, percentage: 7, revenue: 670000, color: '#8B5CF6' },
    { source: 'Health Camps', count: 76, percentage: 4, revenue: 380000, color: '#EC4899' },
  ];

  // Referral conversion funnel
  const conversionFunnel = [
    { stage: 'Referrals Received', count: 1847, percentage: 100 },
    { stage: 'Contacted', count: 1678, percentage: 91 },
    { stage: 'Appointments Booked', count: 1234, percentage: 67 },
    { stage: 'Consultations Done', count: 987, percentage: 53 },
    { stage: 'Treatments Started', count: 765, percentage: 41 },
    { stage: 'Completed', count: 612, percentage: 33 },
  ];

  // Monthly referral trends
  const monthlyTrends = [
    { month: 'Jan', referrals: 145, converted: 98, revenue: 1225000 },
    { month: 'Feb', referrals: 167, converted: 112, revenue: 1400000 },
    { month: 'Mar', referrals: 189, converted: 134, revenue: 1675000 },
    { month: 'Apr', referrals: 198, converted: 145, revenue: 1812500 },
    { month: 'May', referrals: 212, converted: 156, revenue: 1950000 },
    { month: 'Jun', referrals: 234, converted: 178, revenue: 2225000 },
  ];

  // Specialty-wise referrals
  const specialtyReferrals = [
    { specialty: 'Cardiology', referrals: 234, conversion: 85, avgValue: 18500 },
    { specialty: 'Orthopedics', referrals: 189, conversion: 78, avgValue: 22000 },
    { specialty: 'Neurology', referrals: 156, conversion: 72, avgValue: 25000 },
    { specialty: 'Gastroenterology', referrals: 145, conversion: 81, avgValue: 15000 },
    { specialty: 'Oncology', referrals: 123, conversion: 68, avgValue: 35000 },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ArrowUpRight className="size-4 text-green-600" />;
    if (trend === 'down') return <ArrowDownRight className="size-4 text-red-600" />;
    return <ArrowUpRight className="size-4 text-gray-400" />;
  };

  const getReferrerIcon = (type: string) => {
    switch (type) {
      case 'Doctor':
        return <Stethoscope className="size-4" />;
      case 'Patient':
        return <Users className="size-4" />;
      case 'Corporate':
        return <Building2 className="size-4" />;
      case 'Insurance':
        return <Award className="size-4" />;
      default:
        return <Users className="size-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referral Analytics</h1>
          <p className="text-muted-foreground">
            Track referral performance, conversion rates, and ROI
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
          <Select value={referrerType} onValueChange={setReferrerType}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="doctor">Doctors</SelectItem>
              <SelectItem value="patient">Patients</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReferrals.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 size-3" />
              +23% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <Progress value={metrics.conversionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgConversionTime} days</div>
            <p className="text-xs text-muted-foreground mt-1">From referral to visit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="size-4 mr-1" />
              {(metrics.totalRevenue / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground mt-1">From referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Referral Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics.avgReferralValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Per patient</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Stethoscope className="size-5 text-blue-500" />
              <div>
                <div className="font-bold">{metrics.topReferrerType}s</div>
                <p className="text-xs text-muted-foreground">48% of referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="flow">Referral Flow</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          <TabsTrigger value="incentives">Incentives</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Top Referrers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Highest performing referral sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topReferrers.map((referrer, index) => (
                    <div key={referrer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="size-10">
                          <AvatarFallback>{referrer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{referrer.name}</span>
                            {getReferrerIcon(referrer.type)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{referrer.totalReferrals} referrals</span>
                            <span>•</span>
                            <span>{referrer.conversionRate}% conversion</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">₹{(referrer.totalRevenue / 100000).toFixed(1)}L</span>
                          {getTrendIcon(referrer.trend)}
                        </div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Referrers
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Referral Sources Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <CardDescription>Distribution by source type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralSources.map((source) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: source.color }}
                          />
                          <span className="text-sm font-medium">{source.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{source.count}</Badge>
                          <span className="text-sm text-muted-foreground">
                            ₹{(source.revenue / 100000).toFixed(1)}L
                          </span>
                        </div>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Conversion Funnel</CardTitle>
              <CardDescription>Patient journey from referral to treatment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{stage.count}</Badge>
                        <span className="text-sm text-muted-foreground">{stage.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={stage.percentage} className="h-3" />
                    {index < conversionFunnel.length - 1 && (
                      <div className="absolute left-4 top-12 h-4 w-0.5 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <ReferrerLeaderboard />
        </TabsContent>

        {/* Referral Flow Tab */}
        <TabsContent value="flow">
          <ReferralFlowDiagram />
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Specialty-wise Referral Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specialtyReferrals.map((specialty) => (
                    <div key={specialty.specialty} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{specialty.specialty}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{specialty.referrals} referrals</Badge>
                          <span className="text-sm text-green-600">{specialty.conversion}% conv</span>
                        </div>
                      </div>
                      <Progress value={specialty.conversion} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Avg value: ₹{specialty.avgValue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="size-5 text-green-500" />
                      <div>
                        <p className="font-medium">Same Day</p>
                        <p className="text-sm text-muted-foreground">Emergency/Urgent</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">23%</p>
                      <p className="text-sm text-muted-foreground">234 patients</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="size-5 text-blue-500" />
                      <div>
                        <p className="font-medium">1-3 Days</p>
                        <p className="text-sm text-muted-foreground">Planned visits</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">45%</p>
                      <p className="text-sm text-muted-foreground">456 patients</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="size-5 text-orange-500" />
                      <div>
                        <p className="font-medium">4-7 Days</p>
                        <p className="text-sm text-muted-foreground">Follow-ups</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">22%</p>
                      <p className="text-sm text-muted-foreground">223 patients</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="size-5 text-red-500" />
                      <div>
                        <p className="font-medium">&gt;7 Days</p>
                        <p className="text-sm text-muted-foreground">Delayed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">10%</p>
                      <p className="text-sm text-muted-foreground">101 patients</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ROI Analysis Tab */}
        <TabsContent value="roi">
          <ReferralROICalculator />
        </TabsContent>

        {/* Incentives Tab */}
        <TabsContent value="incentives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Incentive Management</CardTitle>
              <CardDescription>Track and manage referrer rewards and incentives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pending Incentives */}
                <div>
                  <h4 className="font-medium mb-3">Pending Incentives</h4>
                  <div className="space-y-3">
                    {topReferrers.slice(0, 3).map((referrer) => (
                      <div key={referrer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>{referrer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{referrer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {referrer.activeReferrals} qualified referrals
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            ₹{(referrer.activeReferrals * 500).toLocaleString()}
                          </Badge>
                          <Button size="sm">
                            <Gift className="mr-2 size-3" />
                            Process
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incentive Rules */}
                <div>
                  <h4 className="font-medium mb-3">Active Incentive Rules</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="size-5 text-blue-500" />
                        <h5 className="font-medium">Doctor Referral Program</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        ₹500 per converted OPD, ₹2000 per surgery referral
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>Active Participants</span>
                        <Badge>156</Badge>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="size-5 text-green-500" />
                        <h5 className="font-medium">Patient Referral Rewards</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        ₹200 cashback on next visit for successful referral
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>Active Participants</span>
                        <Badge>423</Badge>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="size-5 text-purple-500" />
                        <h5 className="font-medium">Corporate Tie-up Benefits</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        10% discount on bulk health checkups, priority slots
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>Active Partners</span>
                        <Badge>34</Badge>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="size-5 text-orange-500" />
                        <h5 className="font-medium">Milestone Rewards</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Bonus rewards at 25, 50, 100 successful referrals
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>Achieved This Month</span>
                        <Badge>12</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Communication */}
                <div>
                  <h4 className="font-medium mb-3">Referrer Communication</h4>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Send className="mr-2 size-4" />
                      Send Thank You Notes
                    </Button>
                    <Button variant="outline">
                      <Calendar className="mr-2 size-4" />
                      Schedule Meet & Greet
                    </Button>
                    <Button variant="outline">
                      <Share2 className="mr-2 size-4" />
                      Share Monthly Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}