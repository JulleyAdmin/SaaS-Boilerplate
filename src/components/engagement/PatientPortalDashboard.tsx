'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  FileText,
  Heart,
  Activity,
  Pill,
  Users,
  Video,
  Download,
  ChevronRight,
  Bell,
  Shield,
  Target,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  Phone,
  MessageSquare,
  User,
  CreditCard,
  Home,
  Stethoscope,
} from 'lucide-react';

interface PatientPortalDashboardProps {
  patientId?: string;
  patientName?: string;
}

const PatientPortalDashboard: React.FC<PatientPortalDashboardProps> = ({
  patientId = 'patient-001',
  patientName = 'Rajesh Kumar',
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [journeyData, setJourneyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patient/journey?patientId=${patientId}`);
      const data = await response.json();
      setJourneyData(data.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sharma',
      specialty: 'Cardiologist',
      date: '15 Jan 2025',
      time: '10:30 AM',
      type: 'Follow-up',
      mode: 'In-Person',
    },
    {
      id: 2,
      doctor: 'Dr. Patel',
      specialty: 'Diabetologist',
      date: '22 Jan 2025',
      time: '3:00 PM',
      type: 'Consultation',
      mode: 'Video',
    },
  ];

  const healthGoals = [
    {
      id: 1,
      goal: 'Reduce HbA1c',
      target: '< 7%',
      current: '7.8%',
      progress: 65,
      status: 'improving',
    },
    {
      id: 2,
      goal: 'Daily Steps',
      target: '10,000',
      current: '7,500',
      progress: 75,
      status: 'on-track',
    },
    {
      id: 3,
      goal: 'Weight Loss',
      target: '75 kg',
      current: '78 kg',
      progress: 60,
      status: 'steady',
    },
  ];

  const preventiveCare = [
    {
      type: 'Annual Health Checkup',
      due: '2 weeks',
      status: 'upcoming',
      priority: 'high',
    },
    {
      type: 'Eye Examination',
      due: '1 month',
      status: 'scheduled',
      priority: 'medium',
    },
    {
      type: 'Flu Vaccination',
      due: 'Overdue',
      status: 'overdue',
      priority: 'high',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {patientName}!</h1>
            <p className="text-blue-100">Your health journey at a glance</p>
            <div className="flex gap-4 mt-4">
              <Badge className="bg-white/20 text-white">
                ABHA: XXXX-XXXX-1234
              </Badge>
              <Badge className="bg-white/20 text-white">
                Member Since: Jan 2023
              </Badge>
              {journeyData && (
                <Badge className="bg-white/20 text-white">
                  Engagement Score: {journeyData.engagementScore}%
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Emergency
            </Button>
            <Button variant="secondary" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat Support
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto flex-col p-4">
          <Calendar className="h-6 w-6 mb-2 text-blue-600" />
          <span>Book Appointment</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col p-4">
          <Video className="h-6 w-6 mb-2 text-green-600" />
          <span>Video Consult</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col p-4">
          <Pill className="h-6 w-6 mb-2 text-purple-600" />
          <span>Order Medicine</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col p-4">
          <FileText className="h-6 w-6 mb-2 text-orange-600" />
          <span>View Reports</span>
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">My Health</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="border-l-2 border-blue-500 pl-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{apt.doctor}</p>
                        <p className="text-sm text-gray-600">{apt.specialty}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {apt.date}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {apt.time}
                          </Badge>
                        </div>
                      </div>
                      {apt.mode === 'Video' && <Video className="h-4 w-4 text-blue-600" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Health Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {healthGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{goal.goal}</span>
                      <Badge 
                        variant={goal.status === 'on-track' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {goal.current}
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-gray-600">Target: {goal.target}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Preventive Care */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Preventive Care
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {preventiveCare.map((care, idx) => (
                  <Alert 
                    key={idx}
                    className={care.status === 'overdue' ? 'border-red-300' : 'border-blue-300'}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{care.type}</span>
                        <Badge 
                          variant={care.status === 'overdue' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {care.due}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Health Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Your Health Journey
              </CardTitle>
              <CardDescription>
                Track your progress and stay engaged with your health
              </CardDescription>
            </CardHeader>
            <CardContent>
              {journeyData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {journeyData.engagementScore}%
                    </div>
                    <p className="text-sm text-gray-600">Engagement Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {journeyData.metrics.appointmentAdherence}%
                    </div>
                    <p className="text-sm text-gray-600">Appointment Adherence</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {journeyData.metrics.medicationCompliance}%
                    </div>
                    <p className="text-sm text-gray-600">Medicine Compliance</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {journeyData.touchpoints.length}
                    </div>
                    <p className="text-sm text-gray-600">Recent Interactions</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
              <CardDescription>Your comprehensive health overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Chronic Conditions:</strong> Type 2 Diabetes, Hypertension
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Pill className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Current Medications:</strong> Metformin 500mg, Amlodipine 5mg
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recent Vitals:</strong> BP: 130/85, Sugar: 140 mg/dl, Weight: 78kg
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage all your appointments</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Access your reports, prescriptions, and medical history</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle>Family Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage health records for your family</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPortalDashboard;