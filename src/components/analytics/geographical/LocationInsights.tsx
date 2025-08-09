'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
  MapPin,
  TrendingUp,
  Users,
  IndianRupee,
  Clock,
  Calendar,
  ChevronRight,
  AlertCircle,
  Target,
  Activity,
  BarChart3,
} from 'lucide-react';

const LocationInsights: React.FC = () => {
  // Catchment area distribution data
  const catchmentData = [
    { distance: '0-5 km', patients: 1245, percentage: 42, avgRevenue: 8500, retention: 92 },
    { distance: '5-10 km', patients: 678, percentage: 23, avgRevenue: 7200, retention: 85 },
    { distance: '10-15 km', patients: 456, percentage: 15, avgRevenue: 6800, retention: 78 },
    { distance: '15-20 km', patients: 334, percentage: 11, avgRevenue: 5900, retention: 71 },
    { distance: '20-30 km', patients: 178, percentage: 6, avgRevenue: 5200, retention: 65 },
    { distance: '>30 km', patients: 89, percentage: 3, avgRevenue: 4800, retention: 58 },
  ];

  // Disease prevalence by location
  const diseasePrevalenceData = [
    { area: 'Koramangala', diabetes: 145, hypertension: 189, cardiac: 78, respiratory: 56, ortho: 89 },
    { area: 'Indiranagar', diabetes: 134, hypertension: 167, cardiac: 89, respiratory: 45, ortho: 76 },
    { area: 'Whitefield', diabetes: 178, hypertension: 156, cardiac: 67, respiratory: 78, ortho: 95 },
    { area: 'HSR Layout', diabetes: 123, hypertension: 145, cardiac: 56, respiratory: 38, ortho: 82 },
    { area: 'Jayanagar', diabetes: 98, hypertension: 134, cardiac: 71, respiratory: 42, ortho: 68 },
  ];

  // Patient demographics by location
  const demographicsData = [
    { 
      area: 'Koramangala',
      ageGroups: { '0-18': 15, '19-35': 35, '36-50': 28, '51-65': 15, '65+': 7 },
      gender: { male: 52, female: 48 },
      insurance: { government: 23, private: 45, self: 32 }
    },
    {
      area: 'Indiranagar',
      ageGroups: { '0-18': 12, '19-35': 38, '36-50': 30, '51-65': 13, '65+': 7 },
      gender: { male: 49, female: 51 },
      insurance: { government: 18, private: 52, self: 30 }
    },
    {
      area: 'Whitefield',
      ageGroups: { '0-18': 18, '19-35': 42, '36-50': 25, '51-65': 10, '65+': 5 },
      gender: { male: 54, female: 46 },
      insurance: { government: 15, private: 58, self: 27 }
    },
  ];

  // Transportation insights
  const transportData = [
    { mode: 'Personal Vehicle', percentage: 45, avgTime: 25 },
    { mode: 'Auto/Taxi', percentage: 28, avgTime: 35 },
    { mode: 'Public Transport', percentage: 18, avgTime: 55 },
    { mode: 'Hospital Shuttle', percentage: 6, avgTime: 40 },
    { mode: 'Walk', percentage: 3, avgTime: 15 },
  ];

  // Time-based patient flow
  const timeBasedFlow = [
    { hour: '8AM', koramangala: 45, indiranagar: 38, whitefield: 32, others: 28 },
    { hour: '10AM', koramangala: 78, indiranagar: 65, whitefield: 58, others: 52 },
    { hour: '12PM', koramangala: 92, indiranagar: 85, whitefield: 76, others: 68 },
    { hour: '2PM', koramangala: 68, indiranagar: 62, whitefield: 55, others: 48 },
    { hour: '4PM', koramangala: 85, indiranagar: 78, whitefield: 72, others: 65 },
    { hour: '6PM', koramangala: 58, indiranagar: 52, whitefield: 45, others: 38 },
    { hour: '8PM', koramangala: 32, indiranagar: 28, whitefield: 22, others: 18 },
  ];

  // Radar chart data for location comparison
  const locationComparisonData = [
    { metric: 'Patient Volume', koramangala: 85, indiranagar: 78, whitefield: 72, hsrLayout: 68, jayanagar: 65 },
    { metric: 'Revenue', koramangala: 88, indiranagar: 82, whitefield: 68, hsrLayout: 72, jayanagar: 70 },
    { metric: 'Retention', koramangala: 92, indiranagar: 88, whitefield: 75, hsrLayout: 80, jayanagar: 85 },
    { metric: 'Growth', koramangala: 72, indiranagar: 68, whitefield: 85, hsrLayout: 78, jayanagar: 62 },
    { metric: 'Satisfaction', koramangala: 88, indiranagar: 90, whitefield: 82, hsrLayout: 85, jayanagar: 87 },
    { metric: 'Accessibility', koramangala: 95, indiranagar: 92, whitefield: 65, hsrLayout: 88, jayanagar: 90 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Catchment Area Analysis */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Catchment Area Distribution</CardTitle>
            <CardDescription>Patient distribution by distance from hospital</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={catchmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="distance" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patients" fill="#3B82F6" name="Patients" />
                <Bar dataKey="retention" fill="#10B981" name="Retention %" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {catchmentData.slice(0, 3).map((item) => (
                <div key={item.distance} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.distance}</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{item.patients} patients</Badge>
                    <span className="font-medium">₹{item.avgRevenue} avg</span>
                    <span className="text-green-600">{item.retention}% retention</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transportation Patterns</CardTitle>
            <CardDescription>How patients reach the hospital</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={transportData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mode, percentage }) => `${mode}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {transportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {transportData.map((item, index) => (
                <div key={item.mode} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.mode}</span>
                  <span className="font-medium ml-auto">{item.avgTime}min</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disease Prevalence by Location */}
      <Card>
        <CardHeader>
          <CardTitle>Disease Prevalence by Location</CardTitle>
          <CardDescription>Common health conditions in different areas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diseasePrevalenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="diabetes" stackId="a" fill="#3B82F6" />
              <Bar dataKey="hypertension" stackId="a" fill="#10B981" />
              <Bar dataKey="cardiac" stackId="a" fill="#F59E0B" />
              <Bar dataKey="respiratory" stackId="a" fill="#EF4444" />
              <Bar dataKey="ortho" stackId="a" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Health Pattern Insight</p>
                <p className="text-sm text-amber-700 mt-1">
                  High diabetes prevalence in Whitefield (178 cases) suggests opportunity for specialized diabetes care program. 
                  Consider launching targeted screening camps and preventive care initiatives.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Performance Comparison */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Performance Matrix</CardTitle>
            <CardDescription>Multi-dimensional comparison of key areas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={locationComparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Koramangala" dataKey="koramangala" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Radar name="Indiranagar" dataKey="indiranagar" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Radar name="Whitefield" dataKey="whitefield" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hour Analysis</CardTitle>
            <CardDescription>Patient flow patterns throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeBasedFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="koramangala" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="indiranagar" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="whitefield" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="others" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Location-Based Insights & Recommendations</CardTitle>
          <CardDescription>Data-driven insights for strategic decision making</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-5 text-blue-500" />
                <h4 className="font-medium">Primary Catchment Focus</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                42% of patients come from 0-5km radius with 92% retention rate. Strengthen local presence through community programs.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <MapPin className="mr-2 size-3" />
                View Local Strategy
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="size-5 text-green-500" />
                <h4 className="font-medium">Whitefield Opportunity</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                High diabetes prevalence (178 cases) with 85% growth potential. Launch specialized diabetes care center.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <ChevronRight className="mr-2 size-3" />
                Create Action Plan
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-5 text-orange-500" />
                <h4 className="font-medium">Transport Optimization</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                28% use auto/taxi with 35min avg time. Partner with ride services for patient convenience and cost reduction.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Users className="mr-2 size-3" />
                Explore Partnerships
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5 text-purple-500" />
                <h4 className="font-medium">Distance vs Revenue</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Patients beyond 15km show 23% lower avg revenue. Consider telemedicine for distant patients to improve engagement.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Calendar className="mr-2 size-3" />
                Launch Teleconsult
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-5 text-red-500" />
                <h4 className="font-medium">Peak Hour Management</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                12PM shows 35% higher footfall across locations. Implement appointment staggering and express lanes.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Clock className="mr-2 size-3" />
                Optimize Scheduling
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="size-5 text-green-600" />
                <h4 className="font-medium">Revenue Optimization</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Koramangala patients show ₹8,500 avg revenue. Replicate service mix in other locations for 18% revenue uplift.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <BarChart3 className="mr-2 size-3" />
                Analyze Service Mix
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationInsights;