'use client';

import {
  AlertCircle,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Heart,
  Pill,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Mock data imports (will be replaced with real API calls)
import {
  generateAppointment,
  generateClinicalStatistics,
  generatePatient,
  generateUser,
} from '@/mocks/hms';

/**
 * Doctor Dashboard Component
 * Displays key metrics, appointments, and patient information for doctors
 */
export function DoctorDashboard() {
  // Generate mock data (replace with real API calls)
  const mockData = useMemo(() => {
    const doctor = generateUser('clinic-1', 'dept-1', 'Senior-Doctor');
    const patients = Array.from({ length: 5 }, () => generatePatient('clinic-1'));
    const todayAppointments = patients.map(patient =>
      generateAppointment(patient, doctor, 'General Medicine', 'scheduled'),
    );
    const stats = generateClinicalStatistics(todayAppointments, [], []);

    return {
      doctor,
      patients,
      todayAppointments,
      stats,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">3 completed</span>
              , 2 pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              +12 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Consultation Time</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.stats.averageConsultationTime}
              {' '}
              min
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 20 min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
            <Heart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.stats.patientSatisfactionScore}
              /5.0
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline size-3 text-green-600" />
              {' '}
              +0.2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Today's Schedule */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scheduled">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="queue">In Queue</TabsTrigger>
              </TabsList>

              <TabsContent value="scheduled" className="mt-4 space-y-3">
                {mockData.todayAppointments.map((appointment, index) => {
                  const patient = mockData.patients[index];
                  return (
                    <div
                      key={appointment.appointmentId}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {appointment.tokenNumber}
                        </div>
                        <div>
                          <p className="font-medium">
                            {patient.firstName}
                            {' '}
                            {patient.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.appointmentTime}
                            {' '}
                            •
                            {appointment.reasonForVisit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={appointment.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {appointment.priority}
                        </Badge>
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/consultations/new?appointmentId=${appointment.appointmentId}`}>
                            Start Consultation
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <p className="py-8 text-center text-muted-foreground">
                  No completed appointments yet today
                </p>
              </TabsContent>

              <TabsContent value="queue" className="mt-4">
                <p className="py-8 text-center text-muted-foreground">
                  No patients in queue currently
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6 lg:col-span-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/patients">
                  <UserCheck className="mr-2 size-4" />
                  View All Patients
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/prescriptions/new">
                  <Pill className="mr-2 size-4" />
                  Write Prescription
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/lab-orders/new">
                  <ClipboardList className="mr-2 size-4" />
                  Order Lab Tests
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/reports">
                  <FileText className="mr-2 size-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Important notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 size-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Critical Lab Result</p>
                  <p className="text-xs text-muted-foreground">
                    Patient Rajesh Kumar - High blood sugar (450 mg/dL)
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 size-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Follow-up Required</p>
                  <p className="text-xs text-muted-foreground">
                    3 patients need follow-up this week
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Diagnoses */}
          <Card>
            <CardHeader>
              <CardTitle>Common Diagnoses</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.stats.commonDiagnoses.slice(0, 3).map((item: { diagnosis: string; count: number }, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.diagnosis}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
