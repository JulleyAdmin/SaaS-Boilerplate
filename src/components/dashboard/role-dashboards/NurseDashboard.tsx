'use client';

import {
  Activity,
  AlertCircle,
  Bed,
  CheckCircle,
  Clock,
  Droplet,
  Pill,
  Syringe,
  Thermometer,
  Timer,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Mock data imports
import {
  generatePatient,
  generateUser,
  randomInt,
} from '@/mocks/hms';

/**
 * Nurse Dashboard Component
 * Displays ward management, patient vitals, and medication schedules
 */
export function NurseDashboard() {

  // Generate mock data
  const mockData = useMemo(() => {
    const nurse = generateUser('clinic-1', 'dept-1', 'Staff-Nurse');
    const patients = Array.from({ length: 8 }, () => generatePatient('clinic-1'));
    const admittedPatients = patients.filter((p, index) => p.status === 'admitted' || index < 3); // Use index-based selection to avoid randomization

    return {
      nurse,
      patients,
      admittedPatients,
      totalBeds: 30,
      occupiedBeds: admittedPatients.length,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Ward Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ward Occupancy</CardTitle>
            <Bed className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.occupiedBeds}
              /
              {mockData.totalBeds}
            </div>
            <Progress
              value={(mockData.occupiedBeds / mockData.totalBeds) * 100}
              className="mt-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round((mockData.occupiedBeds / mockData.totalBeds) * 100)}
              % occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vitals Pending</CardTitle>
            <Thermometer className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Next round in 45 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications Due</CardTitle>
            <Pill className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <AlertCircle className="inline size-3 text-amber-500" />
              {' '}
              3 critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Shift</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Day Shift</div>
            <p className="text-xs text-muted-foreground">
              07:00 AM - 07:00 PM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Patient List */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Assigned Patients</CardTitle>
            <CardDescription>Patients under your care today</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Patients</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="medications">Medications Due</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-3">
                {mockData.patients.slice(0, 5).map((patient, index) => (
                  <div
                    key={patient.patientId}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {101 + index}
                      </div>
                      <div>
                        <p className="font-medium">
                          {patient.firstName}
                          {' '}
                          {patient.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Bed
                          {' '}
                          {101 + index}
                          {' '}
                          • Age
                          {' '}
                          {patient.age}
                          {' '}
                          •
                          {' '}
                          {patient.gender}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {index === 0 && <Badge variant="destructive">Critical</Badge>}
                      {index === 2 && <Badge variant="outline">Medication Due</Badge>}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/patients/${patient.patientId}/vitals`}>
                          Record Vitals
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="critical" className="mt-4">
                <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
                  <div className="flex items-center space-x-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 font-semibold text-destructive">
                      101
                    </div>
                    <div>
                      <p className="font-medium">
                        {mockData.patients[0].firstName}
                        {' '}
                        {mockData.patients[0].lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Post-operative monitoring • High BP alert
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" asChild>
                    <Link href={`/dashboard/patients/${mockData.patients[0].patientId}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="medications" className="mt-4 space-y-3">
                {mockData.patients.slice(2, 5).map((patient, index) => (
                  <div
                    key={patient.patientId}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center space-x-4">
                      <Timer className="size-5 text-amber-500" />
                      <div>
                        <p className="font-medium">
                          {patient.firstName}
                          {' '}
                          {patient.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Antibiotics due at
                          {' '}
                          {10 + index}
                          :00 AM
                        </p>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/medication-administration/${patient.patientId}`}>
                        Administer
                      </Link>
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Tasks & Activities */}
        <div className="space-y-6 lg:col-span-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/vitals/bulk-record">
                  <Thermometer className="mr-2 size-4" />
                  Bulk Vitals Recording
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/medication-rounds">
                  <Pill className="mr-2 size-4" />
                  Medication Round
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/nursing-notes">
                  <Activity className="mr-2 size-4" />
                  Nursing Notes
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/handover">
                  <Users className="mr-2 size-4" />
                  Shift Handover
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your last actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="size-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm">Vitals recorded for Bed 103</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Syringe className="size-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm">IV medication administered - Bed 105</p>
                  <p className="text-xs text-muted-foreground">25 minutes ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Droplet className="size-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm">Blood sample collected - Bed 107</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Next 2 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">10:00 AM</Badge>
                  <span className="text-sm">Vitals Round - Ward A</span>
                </div>
                <Badge>8 patients</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">10:30 AM</Badge>
                  <span className="text-sm">Medication Round</span>
                </div>
                <Badge>12 patients</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">11:00 AM</Badge>
                  <span className="text-sm">Dressing Change - Bed 101</span>
                </div>
                <Badge variant="destructive">Priority</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
