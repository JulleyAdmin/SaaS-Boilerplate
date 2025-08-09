'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sankey,
  Rectangle,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowRight,
  Users,
  Building2,
  Stethoscope,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FlowNode {
  name: string;
  value?: number;
}

interface FlowLink {
  source: number;
  target: number;
  value: number;
}

const ReferralFlowDiagram: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [department, setDepartment] = useState('all');
  const [viewType, setViewType] = useState<'sankey' | 'funnel' | 'journey'>('sankey');

  // Sankey diagram data for referral flow
  const sankeyData = {
    nodes: [
      // Sources (Level 0)
      { name: 'Doctors' },
      { name: 'Patients' },
      { name: 'Corporate' },
      { name: 'Insurance' },
      { name: 'Health Camps' },
      
      // First Contact (Level 1)
      { name: 'Phone Inquiry' },
      { name: 'Walk-in' },
      { name: 'Online Booking' },
      { name: 'WhatsApp' },
      
      // Department (Level 2)
      { name: 'General Medicine' },
      { name: 'Cardiology' },
      { name: 'Orthopedics' },
      { name: 'Pediatrics' },
      { name: 'Gynecology' },
      { name: 'Others' },
      
      // Outcome (Level 3)
      { name: 'OPD Consultation' },
      { name: 'Diagnostics' },
      { name: 'Surgery' },
      { name: 'Admission' },
      { name: 'Lost/Cancelled' },
    ],
    links: [
      // Sources to First Contact
      { source: 0, target: 5, value: 234 }, // Doctors -> Phone
      { source: 0, target: 6, value: 156 }, // Doctors -> Walk-in
      { source: 0, target: 7, value: 389 }, // Doctors -> Online
      { source: 0, target: 8, value: 113 }, // Doctors -> WhatsApp
      
      { source: 1, target: 5, value: 123 }, // Patients -> Phone
      { source: 1, target: 6, value: 234 }, // Patients -> Walk-in
      { source: 1, target: 7, value: 67 }, // Patients -> Online
      { source: 1, target: 8, value: 32 }, // Patients -> WhatsApp
      
      { source: 2, target: 5, value: 89 }, // Corporate -> Phone
      { source: 2, target: 7, value: 156 }, // Corporate -> Online
      { source: 2, target: 8, value: 44 }, // Corporate -> WhatsApp
      
      { source: 3, target: 5, value: 45 }, // Insurance -> Phone
      { source: 3, target: 7, value: 67 }, // Insurance -> Online
      { source: 3, target: 8, value: 22 }, // Insurance -> WhatsApp
      
      { source: 4, target: 6, value: 76 }, // Health Camps -> Walk-in
      
      // First Contact to Department
      { source: 5, target: 9, value: 234 }, // Phone -> General Medicine
      { source: 5, target: 10, value: 123 }, // Phone -> Cardiology
      { source: 5, target: 11, value: 89 }, // Phone -> Orthopedics
      { source: 5, target: 12, value: 67 }, // Phone -> Pediatrics
      { source: 5, target: 13, value: 45 }, // Phone -> Gynecology
      { source: 5, target: 14, value: 33 }, // Phone -> Others
      
      { source: 6, target: 9, value: 189 }, // Walk-in -> General Medicine
      { source: 6, target: 10, value: 98 }, // Walk-in -> Cardiology
      { source: 6, target: 11, value: 156 }, // Walk-in -> Orthopedics
      { source: 6, target: 12, value: 123 }, // Walk-in -> Pediatrics
      { source: 6, target: 13, value: 89 }, // Walk-in -> Gynecology
      { source: 6, target: 14, value: 45 }, // Walk-in -> Others
      
      { source: 7, target: 9, value: 234 }, // Online -> General Medicine
      { source: 7, target: 10, value: 145 }, // Online -> Cardiology
      { source: 7, target: 11, value: 123 }, // Online -> Orthopedics
      { source: 7, target: 12, value: 89 }, // Online -> Pediatrics
      { source: 7, target: 13, value: 67 }, // Online -> Gynecology
      { source: 7, target: 14, value: 54 }, // Online -> Others
      
      { source: 8, target: 9, value: 78 }, // WhatsApp -> General Medicine
      { source: 8, target: 10, value: 45 }, // WhatsApp -> Cardiology
      { source: 8, target: 11, value: 34 }, // WhatsApp -> Orthopedics
      { source: 8, target: 12, value: 23 }, // WhatsApp -> Pediatrics
      { source: 8, target: 13, value: 21 }, // WhatsApp -> Gynecology
      { source: 8, target: 14, value: 10 }, // WhatsApp -> Others
      
      // Department to Outcome
      { source: 9, target: 15, value: 456 }, // General Medicine -> OPD
      { source: 9, target: 16, value: 234 }, // General Medicine -> Diagnostics
      { source: 9, target: 19, value: 45 }, // General Medicine -> Admission
      { source: 9, target: 20, value: 23 }, // General Medicine -> Lost
      
      { source: 10, target: 15, value: 189 }, // Cardiology -> OPD
      { source: 10, target: 16, value: 145 }, // Cardiology -> Diagnostics
      { source: 10, target: 17, value: 67 }, // Cardiology -> Surgery
      { source: 10, target: 18, value: 89 }, // Cardiology -> Admission
      { source: 10, target: 20, value: 21 }, // Cardiology -> Lost
      
      { source: 11, target: 15, value: 234 }, // Orthopedics -> OPD
      { source: 11, target: 16, value: 123 }, // Orthopedics -> Diagnostics
      { source: 11, target: 17, value: 89 }, // Orthopedics -> Surgery
      { source: 11, target: 18, value: 45 }, // Orthopedics -> Admission
      { source: 11, target: 20, value: 12 }, // Orthopedics -> Lost
      
      { source: 12, target: 15, value: 234 }, // Pediatrics -> OPD
      { source: 12, target: 16, value: 89 }, // Pediatrics -> Diagnostics
      { source: 12, target: 18, value: 34 }, // Pediatrics -> Admission
      { source: 12, target: 20, value: 8 }, // Pediatrics -> Lost
      
      { source: 13, target: 15, value: 145 }, // Gynecology -> OPD
      { source: 13, target: 16, value: 67 }, // Gynecology -> Diagnostics
      { source: 13, target: 17, value: 23 }, // Gynecology -> Surgery
      { source: 13, target: 18, value: 12 }, // Gynecology -> Admission
      { source: 13, target: 20, value: 5 }, // Gynecology -> Lost
      
      { source: 14, target: 15, value: 89 }, // Others -> OPD
      { source: 14, target: 16, value: 34 }, // Others -> Diagnostics
      { source: 14, target: 18, value: 12 }, // Others -> Admission
      { source: 14, target: 20, value: 7 }, // Others -> Lost
    ],
  };

  // Funnel data for conversion tracking
  const funnelData = [
    { stage: 'Referrals Received', value: 1847, percentage: 100, color: '#3B82F6' },
    { stage: 'Contacted', value: 1678, percentage: 91, color: '#10B981' },
    { stage: 'Appointments Booked', value: 1234, percentage: 67, color: '#F59E0B' },
    { stage: 'Consultations Done', value: 987, percentage: 53, color: '#8B5CF6' },
    { stage: 'Treatments Started', value: 765, percentage: 41, color: '#EC4899' },
    { stage: 'Completed/Admitted', value: 612, percentage: 33, color: '#EF4444' },
  ];

  // Patient journey timeline
  const journeyData = [
    { day: 'Day 0', stage: 'Referral', patients: 1847, dropoff: 0 },
    { day: 'Day 1', stage: 'First Contact', patients: 1678, dropoff: 169 },
    { day: 'Day 3', stage: 'Appointment', patients: 1234, dropoff: 444 },
    { day: 'Day 5', stage: 'Consultation', patients: 987, dropoff: 247 },
    { day: 'Day 7', stage: 'Treatment Plan', patients: 765, dropoff: 222 },
    { day: 'Day 14', stage: 'Follow-up', patients: 612, dropoff: 153 },
  ];

  // Department-wise flow
  const departmentFlow = [
    { department: 'General Medicine', incoming: 735, opd: 456, diagnostics: 234, admission: 45 },
    { department: 'Cardiology', incoming: 511, opd: 189, diagnostics: 145, surgery: 67, admission: 89 },
    { department: 'Orthopedics', incoming: 502, opd: 234, diagnostics: 123, surgery: 89, admission: 45 },
    { department: 'Pediatrics', incoming: 302, opd: 234, diagnostics: 89, admission: 34 },
    { department: 'Gynecology', incoming: 252, opd: 145, diagnostics: 67, surgery: 23, admission: 12 },
  ];

  // Lost referral analysis
  const lostReferrals = [
    { reason: 'Long Wait Time', count: 45, percentage: 28 },
    { reason: 'Cost Concerns', count: 38, percentage: 24 },
    { reason: 'Went to Competitor', count: 32, percentage: 20 },
    { reason: 'Location/Distance', count: 23, percentage: 14 },
    { reason: 'Insurance Issues', count: 12, percentage: 7 },
    { reason: 'Other/Unknown', count: 11, percentage: 7 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'];

  const handleExportFlow = () => {
    toast({
      title: 'Export Started',
      description: 'Downloading referral flow analysis...',
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Patients: {payload[0].value}
          </p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-muted-foreground">
              Conversion: {payload[0].payload.percentage}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Referral Flow Analysis</CardTitle>
              <CardDescription>Visualize patient journey from referral to treatment</CardDescription>
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
                </SelectContent>
              </Select>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="medicine">General Medicine</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportFlow}>
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visualization Tabs */}
      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="journey">Patient Journey</TabsTrigger>
          <TabsTrigger value="department">Department Flow</TabsTrigger>
        </TabsList>

        {/* Conversion Funnel */}
        <TabsContent value="funnel" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Referral Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={funnelData} 
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" shape={(props: any) => {
                      const { fill, x, y, width, height } = props;
                      return (
                        <g>
                          <Rectangle {...props} fill={COLORS[props.index % COLORS.length]} />
                          <text
                            x={x + width + 5}
                            y={y + height / 2}
                            fill="#666"
                            textAnchor="start"
                            dominantBaseline="middle"
                            fontSize={12}
                          >
                            {props.percentage}%
                          </text>
                        </g>
                      );
                    }} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Conversion Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">91%</p>
                    <p className="text-xs text-muted-foreground">Contact Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">67%</p>
                    <p className="text-xs text-muted-foreground">Booking Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">33%</p>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lost Referral Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={lostReferrals}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {lostReferrals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {lostReferrals.slice(0, 3).map((reason, index) => (
                    <div key={reason.reason} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-muted-foreground">{reason.reason}</span>
                      </div>
                      <span className="font-medium">{reason.count} ({reason.percentage}%)</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="size-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Action Required</p>
                      <p className="text-xs text-amber-700 mt-1">
                        28% lost due to wait time. Consider express lanes for referral patients.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patient Journey */}
        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Journey Timeline</CardTitle>
              <CardDescription>Average time from referral to treatment completion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={journeyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Active Patients"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dropoff" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Drop-offs"
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Journey Stages */}
              <div className="mt-6 space-y-4">
                {journeyData.map((stage, index) => (
                  <div key={stage.day} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{stage.stage}</p>
                        <p className="text-sm text-muted-foreground">{stage.day}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{stage.patients} patients</p>
                        {stage.dropoff > 0 && (
                          <p className="text-sm text-red-600">-{stage.dropoff} lost</p>
                        )}
                      </div>
                      {index < journeyData.length - 1 && (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Insights */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <Clock className="size-5 text-blue-500 mb-2" />
                  <p className="font-medium">3.2 days</p>
                  <p className="text-sm text-muted-foreground">Avg time to appointment</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Target className="size-5 text-green-500 mb-2" />
                  <p className="font-medium">67%</p>
                  <p className="text-sm text-muted-foreground">Book appointments</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Activity className="size-5 text-purple-500 mb-2" />
                  <p className="font-medium">91%</p>
                  <p className="text-sm text-muted-foreground">First contact success</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Flow */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Referral Distribution</CardTitle>
              <CardDescription>How referrals flow through different departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentFlow.map((dept) => (
                  <div key={dept.department} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{dept.department}</h4>
                      <Badge variant="outline">{dept.incoming} referrals</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">OPD Consultations</span>
                          <span className="font-medium">{dept.opd}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(dept.opd / dept.incoming) * 100}%` }}
                          />
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Diagnostics</span>
                          <span className="font-medium">{dept.diagnostics}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(dept.diagnostics / dept.incoming) * 100}%` }}
                          />
                        </div>
                      </div>
                      {dept.surgery && (
                        <>
                          <ArrowRight className="size-4 text-muted-foreground" />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Surgery</span>
                              <span className="font-medium">{dept.surgery}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${(dept.surgery / dept.incoming) * 100}%` }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Admission</span>
                          <span className="font-medium">{dept.admission}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(dept.admission / dept.incoming) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Department Insights */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="size-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Key Insight</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Cardiology has the highest surgery conversion rate (13%) from referrals. 
                      Consider specialized cardiac care packages for referral patients.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source to Department Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Referral Source vs Department Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Source</th>
                      <th className="text-center px-2">General Medicine</th>
                      <th className="text-center px-2">Cardiology</th>
                      <th className="text-center px-2">Orthopedics</th>
                      <th className="text-center px-2">Pediatrics</th>
                      <th className="text-center px-2">Gynecology</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Doctors</td>
                      <td className="text-center">234</td>
                      <td className="text-center text-green-600 font-medium">312</td>
                      <td className="text-center">189</td>
                      <td className="text-center">98</td>
                      <td className="text-center">59</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Patients</td>
                      <td className="text-center text-green-600 font-medium">189</td>
                      <td className="text-center">67</td>
                      <td className="text-center">123</td>
                      <td className="text-center">56</td>
                      <td className="text-center">21</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Corporate</td>
                      <td className="text-center">156</td>
                      <td className="text-center">89</td>
                      <td className="text-center">34</td>
                      <td className="text-center">8</td>
                      <td className="text-center">2</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Insurance</td>
                      <td className="text-center">89</td>
                      <td className="text-center">34</td>
                      <td className="text-center">8</td>
                      <td className="text-center">2</td>
                      <td className="text-center">1</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Health Camps</td>
                      <td className="text-center">67</td>
                      <td className="text-center">9</td>
                      <td className="text-center">0</td>
                      <td className="text-center">0</td>
                      <td className="text-center">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferralFlowDiagram;