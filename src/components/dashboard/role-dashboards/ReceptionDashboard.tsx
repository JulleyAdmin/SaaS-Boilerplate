'use client';

import {
  Calendar,
  CheckCircle,
  CreditCard,
  FileText,
  Hash,
  Printer,
  Search,
  Timer,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Mock data imports
import {
  generateAppointment,
  generatePatient,
  generateQueueEntry,
  generateUser,
  randomInt,
} from '@/mocks/hms';

/**
 * Reception Dashboard Component
 * Handles patient registration, appointments, and queue management
 */
export function ReceptionDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Generate mock data
  const mockData = useMemo(() => {
    const patients = Array.from({ length: 20 }, () => generatePatient('clinic-1'));
    const doctors = Array.from({ length: 5 }, (_, i) =>
      generateUser('clinic-1', `dept-${i}`, 'Senior-Doctor'));

    const todayAppointments = patients.slice(0, 15).map((patient, index) => {
      const doctor = doctors[index % 5]; // Use index-based assignment to avoid randomization
      return generateAppointment(patient, doctor, 'General Medicine', index > 10 ? 'completed' : 'scheduled', // Use index-based status
      );
    });

    const queueEntries = todayAppointments
      .filter(apt => apt.status !== 'completed')
      .map((apt) => {
        const patient = patients.find(p => p.patientId === apt.patientId)!;
        return generateQueueEntry(apt, patient);
      });

    return {
      patients,
      doctors,
      todayAppointments,
      queueEntries,
      totalRegistrations: 30, // Fixed value to avoid hydration mismatch
      walkIns: 7, // Fixed value to avoid hydration mismatch
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
              {mockData.todayAppointments.filter(a => a.status === 'completed').length}
              {' '}
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations Today</CardTitle>
            <UserPlus className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.walkIns}
              {' '}
              walk-ins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Queue</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.queueEntries.filter(q => q.status === 'Waiting').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg wait: 25 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,450</div>
            <p className="text-xs text-muted-foreground">
              From 8 patients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, phone, ID, or Aadhaar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
              Search
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/patients/new">
                <UserPlus className="mr-2 size-4" />
                New Registration
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Queue Management */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Queue Management</CardTitle>
            <CardDescription>Current patient queue status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="waiting">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="waiting">
                  Waiting (
                  {mockData.queueEntries.filter(q => q.status === 'Waiting').length}
                  )
                </TabsTrigger>
                <TabsTrigger value="in-consultation">
                  In Consultation (
                  {mockData.queueEntries.filter(q => q.status === 'In-Progress').length}
                  )
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="waiting" className="mt-4 space-y-3">
                {mockData.queueEntries
                  .filter(q => q.status === 'Waiting')
                  .slice(0, 5)
                  .map((queue) => {
                    const patient = mockData.patients.find(p => p.patientId === queue.patientId)!;
                    return (
                      <div
                        key={queue.queueId}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {queue.tokenNumber}
                          </div>
                          <div>
                            <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.phone}
                              {' '}
                              • Waiting for
                              {(queue as any).waitingTime || 15}
                              {' '}
                              min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={(queue.priority || 0) > 5 ? 'destructive' : 'secondary'}>
                            {queue.queueType || 'General'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Call Patient
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>

              <TabsContent value="in-consultation" className="mt-4 space-y-3">
                {mockData.queueEntries
                  .filter(q => q.status === 'In-Progress')
                  .slice(0, 3)
                  .map((queue) => {
                    const doctor = mockData.doctors.find(d => d.userId === queue.doctorId)!;
                    const patient = mockData.patients.find(p => p.patientId === queue.patientId)!;
                    return (
                      <div
                        key={queue.queueId}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <Timer className="size-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                            <p className="text-sm text-muted-foreground">
                              With Dr.
                              {' '}
                              {doctor.firstName}
                              {' '}
                              {doctor.lastName}
                              {' '}
                              •
                              {' '}
                              {(queue as any).consultationTime || 15}
                              {' '}
                              min
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                    );
                  })}
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <p className="py-8 text-center text-muted-foreground">
                  View completed consultations in reports
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions & Tools */}
        <div className="space-y-6 lg:col-span-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/appointments/book">
                  <Calendar className="mr-2 size-4" />
                  Book Appointment
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/token/generate">
                  <Hash className="mr-2 size-4" />
                  Generate Token
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/billing/create">
                  <FileText className="mr-2 size-4" />
                  Create Bill
                </Link>
              </Button>
              <Button className="justify-start" variant="outline">
                <Printer className="mr-2 size-4" />
                Print Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Last actions performed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="size-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm">New patient registered</p>
                  <p className="text-xs text-muted-foreground">ID: HMS-2024-000342</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="size-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm">Appointment booked</p>
                  <p className="text-xs text-muted-foreground">Dr. Sharma - Tomorrow 10:00 AM</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="size-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm">Payment collected</p>
                  <p className="text-xs text-muted-foreground">₹500 - Cash payment</p>
                  <p className="text-xs text-muted-foreground">30 minutes ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Doctor Availability</CardTitle>
              <CardDescription>Currently available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.doctors.slice(0, 3).map(doctor => (
                <div key={doctor.userId} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Dr.
                      {doctor.firstName}
                      {' '}
                      {doctor.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{doctor.specialization || 'General Medicine'}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">Available</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Room
                      {randomInt(101, 110)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
