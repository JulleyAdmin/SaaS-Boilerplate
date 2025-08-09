'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Shield,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Baby,
  User,
  UserPlus,
  Syringe,
  FileText,
  TrendingUp,
  Bell,
  ChevronRight,
  Download,
  Send,
} from 'lucide-react';

const PreventiveCareDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for preventive care programs
  const preventiveCarePrograms = [
    {
      id: 1,
      category: 'vaccination',
      name: 'Adult Vaccination Program',
      description: 'Complete immunization for adults',
      vaccines: [
        { name: 'Influenza', status: 'due', dueDate: 'Jan 2025', priority: 'high' },
        { name: 'Hepatitis B', status: 'completed', completedDate: 'Oct 2024' },
        { name: 'Pneumococcal', status: 'upcoming', dueDate: 'Mar 2025', priority: 'medium' },
        { name: 'COVID-19 Booster', status: 'overdue', dueDate: 'Dec 2024', priority: 'critical' },
      ],
      compliance: 65,
      patientsEnrolled: 3456,
    },
    {
      id: 2,
      category: 'screening',
      name: 'Annual Health Screening',
      description: 'Comprehensive health checkup package',
      tests: [
        { name: 'Complete Blood Count', frequency: 'Annual', lastDone: '6 months ago' },
        { name: 'Lipid Profile', frequency: 'Annual', lastDone: '1 year ago' },
        { name: 'HbA1c', frequency: '6 months', lastDone: '3 months ago' },
        { name: 'ECG', frequency: 'Annual', lastDone: 'Due' },
      ],
      compliance: 78,
      patientsEnrolled: 5678,
    },
    {
      id: 3,
      category: 'maternal',
      name: 'Maternal & Child Health',
      description: 'Prenatal and postnatal care program',
      milestones: [
        { name: 'First Trimester Screening', status: 'completed' },
        { name: 'Anomaly Scan', status: 'scheduled', date: 'Feb 2025' },
        { name: 'Growth Monitoring', status: 'ongoing' },
        { name: 'Vaccination Schedule', status: 'on-track' },
      ],
      compliance: 92,
      patientsEnrolled: 890,
    },
    {
      id: 4,
      category: 'chronic',
      name: 'Chronic Disease Management',
      description: 'Regular monitoring for chronic conditions',
      conditions: ['Diabetes', 'Hypertension', 'Heart Disease', 'COPD'],
      activities: [
        { name: 'Monthly BP Check', compliance: 85 },
        { name: 'Quarterly HbA1c', compliance: 72 },
        { name: 'Annual Eye Exam', compliance: 60 },
        { name: 'Foot Care Assessment', compliance: 45 },
      ],
      compliance: 65,
      patientsEnrolled: 2345,
    },
  ];

  const upcomingReminders = [
    {
      patient: 'Priya Sharma',
      type: 'Vaccination',
      item: 'Flu Shot',
      dueDate: '5 days',
      status: 'pending',
    },
    {
      patient: 'Rajesh Kumar',
      type: 'Screening',
      item: 'Annual Checkup',
      dueDate: '1 week',
      status: 'scheduled',
    },
    {
      patient: 'Anita Patel',
      type: 'Follow-up',
      item: 'Diabetes Review',
      dueDate: 'Tomorrow',
      status: 'urgent',
    },
    {
      patient: 'Vikram Singh',
      type: 'Test',
      item: 'Lipid Profile',
      dueDate: 'Overdue',
      status: 'overdue',
    },
  ];

  const governmentPrograms = [
    {
      name: 'Mission Indradhanush',
      type: 'Immunization',
      coverage: '85%',
      beneficiaries: 1200,
    },
    {
      name: 'Ayushman Bharat',
      type: 'Health Screening',
      coverage: '72%',
      beneficiaries: 3400,
    },
    {
      name: 'PMSMA',
      type: 'Maternal Care',
      coverage: '90%',
      beneficiaries: 450,
    },
    {
      name: 'NPCDCS',
      type: 'NCD Screening',
      coverage: '68%',
      beneficiaries: 2100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Preventive Care Management</h1>
          <p className="text-gray-600 mt-1">
            Proactive health management and disease prevention programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enrolled</p>
                <p className="text-2xl font-bold mt-1">12,369</p>
                <Badge variant="outline" className="mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% this month
                </Badge>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold mt-1">76%</p>
                <Progress value={76} className="mt-2 w-20" />
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due This Week</p>
                <p className="text-2xl font-bold mt-1">234</p>
                <p className="text-xs text-gray-500 mt-1">Appointments</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold mt-1">45</p>
                <Badge variant="destructive" className="mt-2">
                  Needs attention
                </Badge>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="programs">Care Programs</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="government">Government Schemes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Programs
            </Button>
            <Button
              variant={selectedCategory === 'vaccination' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('vaccination')}
            >
              <Syringe className="h-4 w-4 mr-1" />
              Vaccination
            </Button>
            <Button
              variant={selectedCategory === 'screening' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('screening')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Screening
            </Button>
            <Button
              variant={selectedCategory === 'maternal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('maternal')}
            >
              <Baby className="h-4 w-4 mr-1" />
              Maternal
            </Button>
            <Button
              variant={selectedCategory === 'chronic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('chronic')}
            >
              <Heart className="h-4 w-4 mr-1" />
              Chronic Care
            </Button>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {preventiveCarePrograms
              .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
              .map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <CardDescription>{program.description}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {program.patientsEnrolled} enrolled
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Compliance Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Compliance</span>
                          <span className="font-medium">{program.compliance}%</span>
                        </div>
                        <Progress value={program.compliance} />
                      </div>

                      {/* Program-specific content */}
                      {program.vaccines && (
                        <div className="space-y-2">
                          {program.vaccines.slice(0, 3).map((vaccine, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span>{vaccine.name}</span>
                              <Badge
                                variant={
                                  vaccine.status === 'overdue' ? 'destructive' :
                                  vaccine.status === 'due' ? 'default' :
                                  vaccine.status === 'completed' ? 'secondary' : 'outline'
                                }
                                className="text-xs"
                              >
                                {vaccine.status === 'completed' ? vaccine.completedDate : vaccine.dueDate}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      {program.activities && (
                        <div className="space-y-2">
                          {program.activities.slice(0, 3).map((activity, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-sm">{activity.name}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={activity.compliance} className="w-16" />
                                <span className="text-xs font-medium w-10">
                                  {activity.compliance}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reminders</CardTitle>
              <CardDescription>
                Patients due for preventive care interventions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReminders.map((reminder, idx) => (
                  <Alert key={idx} className={
                    reminder.status === 'overdue' ? 'border-red-300' :
                    reminder.status === 'urgent' ? 'border-orange-300' :
                    'border-blue-300'
                  }>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{reminder.patient}</span>
                          <span className="text-gray-600 mx-2">•</span>
                          <span className="text-sm">{reminder.type}: {reminder.item}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              reminder.status === 'overdue' ? 'destructive' :
                              reminder.status === 'urgent' ? 'default' : 'outline'
                            }
                          >
                            {reminder.dueDate}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Bell className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="government" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {governmentPrograms.map((program, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Coverage</span>
                      <div className="flex items-center gap-2">
                        <Progress value={parseInt(program.coverage)} className="w-20" />
                        <span className="font-semibold">{program.coverage}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Beneficiaries</span>
                      <span className="font-semibold">{program.beneficiaries.toLocaleString()}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Preventive Care Analytics</CardTitle>
              <CardDescription>
                Impact and effectiveness metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-600 py-8">
                Detailed analytics visualization coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreventiveCareDashboard;