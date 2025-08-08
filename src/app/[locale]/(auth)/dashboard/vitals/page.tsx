'use client';

import { Activity, Eye, Filter, Heart, Plus, Search, Thermometer, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function VitalsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const vitalsRecords = [
    {
      patientId: 'P-12345',
      patientName: 'John Doe',
      recordedBy: 'Nurse Mary Johnson',
      timestamp: '2024-01-15 14:30',
      vitals: {
        bloodPressure: { systolic: 140, diastolic: 90, status: 'high' },
        heartRate: { value: 85, unit: 'bpm', status: 'normal' },
        temperature: { value: 98.6, unit: '°F', status: 'normal' },
        respiratoryRate: { value: 18, unit: '/min', status: 'normal' },
        oxygenSaturation: { value: 97, unit: '%', status: 'normal' },
        bloodGlucose: { value: 140, unit: 'mg/dL', status: 'high' },
        weight: { value: 75, unit: 'kg', status: 'normal' },
        height: { value: 175, unit: 'cm', status: 'normal' },
      },
      notes: 'Patient reports feeling dizzy. Monitor BP closely.',
    },
    {
      patientId: 'P-12346',
      patientName: 'Jane Smith',
      recordedBy: 'Nurse David Wilson',
      timestamp: '2024-01-15 13:15',
      vitals: {
        bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' },
        heartRate: { value: 72, unit: 'bpm', status: 'normal' },
        temperature: { value: 99.2, unit: '°F', status: 'elevated' },
        respiratoryRate: { value: 16, unit: '/min', status: 'normal' },
        oxygenSaturation: { value: 98, unit: '%', status: 'normal' },
        bloodGlucose: { value: 95, unit: 'mg/dL', status: 'normal' },
        weight: { value: 62, unit: 'kg', status: 'normal' },
        height: { value: 165, unit: 'cm', status: 'normal' },
      },
      notes: 'Post-operative monitoring. Slight fever noted.',
    },
    {
      patientId: 'P-12347',
      patientName: 'Ram Kumar',
      recordedBy: 'Nurse Priya Patel',
      timestamp: '2024-01-15 12:00',
      vitals: {
        bloodPressure: { systolic: 110, diastolic: 70, status: 'normal' },
        heartRate: { value: 68, unit: 'bpm', status: 'normal' },
        temperature: { value: 98.4, unit: '°F', status: 'normal' },
        respiratoryRate: { value: 20, unit: '/min', status: 'normal' },
        oxygenSaturation: { value: 99, unit: '%', status: 'normal' },
        bloodGlucose: { value: 85, unit: 'mg/dL', status: 'normal' },
        weight: { value: 68, unit: 'kg', status: 'normal' },
        height: { value: 172, unit: 'cm', status: 'normal' },
      },
      notes: 'Routine monitoring. All vitals within normal range.',
    },
  ];

  const getVitalStatus = (status: string) => {
    switch (status) {
      case 'normal':
        return 'default';
      case 'elevated':
      case 'high':
        return 'destructive';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getVitalIcon = (status: string) => {
    switch (status) {
      case 'high':
      case 'elevated':
        return <TrendingUp className="size-3 text-red-600" />;
      case 'low':
        return <TrendingDown className="size-3 text-blue-600" />;
      case 'normal':
        return <Activity className="size-3 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vital Signs Monitoring</h1>
          <p className="text-muted-foreground">
            Record, monitor, and track patient vital signs and measurements
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Record Vitals
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <Heart className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Temperature</CardTitle>
            <Thermometer className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7°F</div>
            <p className="text-xs text-muted-foreground">
              Hospital average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Patients</CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              Active monitoring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vitals Management */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Vital Signs</CardTitle>
          <CardDescription>
            Recent vital sign measurements and patient monitoring data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
            <Button variant="outline">
              <Activity className="mr-2 size-4" />
              Real-time View
            </Button>
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList>
              <TabsTrigger value="recent">Recent Readings</TabsTrigger>
              <TabsTrigger value="critical">Critical Alerts</TabsTrigger>
              <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
              <TabsTrigger value="charts">Vital Charts</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="mt-6">
              <div className="space-y-6">
                {vitalsRecords.map((record, index) => (
                  <div key={index} className="rounded-lg border p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{record.patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.patientId}
                          {' '}
                          • Recorded by
                          {record.recordedBy}
                        </p>
                        <p className="text-xs text-muted-foreground">{record.timestamp}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Trends</Button>
                        <Button size="sm">Update Vitals</Button>
                      </div>
                    </div>

                    {/* Vital Signs Grid */}
                    <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Blood Pressure */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Blood Pressure</span>
                          {getVitalIcon(record.vitals.bloodPressure.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.bloodPressure.systolic}
                          /
                          {record.vitals.bloodPressure.diastolic}
                          {' '}
                          mmHg
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.bloodPressure.status) as any} className="text-xs">
                          {record.vitals.bloodPressure.status}
                        </Badge>
                      </div>

                      {/* Heart Rate */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Heart Rate</span>
                          {getVitalIcon(record.vitals.heartRate.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.heartRate.value}
                          {' '}
                          {record.vitals.heartRate.unit}
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.heartRate.status) as any} className="text-xs">
                          {record.vitals.heartRate.status}
                        </Badge>
                      </div>

                      {/* Temperature */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Temperature</span>
                          {getVitalIcon(record.vitals.temperature.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.temperature.value}
                          {record.vitals.temperature.unit}
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.temperature.status) as any} className="text-xs">
                          {record.vitals.temperature.status}
                        </Badge>
                      </div>

                      {/* Oxygen Saturation */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">SpO2</span>
                          {getVitalIcon(record.vitals.oxygenSaturation.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.oxygenSaturation.value}
                          {record.vitals.oxygenSaturation.unit}
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.oxygenSaturation.status) as any} className="text-xs">
                          {record.vitals.oxygenSaturation.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Additional Vitals */}
                    <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Respiratory Rate */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Respiratory Rate</span>
                          {getVitalIcon(record.vitals.respiratoryRate.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.respiratoryRate.value}
                          {' '}
                          {record.vitals.respiratoryRate.unit}
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.respiratoryRate.status) as any} className="text-xs">
                          {record.vitals.respiratoryRate.status}
                        </Badge>
                      </div>

                      {/* Blood Glucose */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Blood Glucose</span>
                          {getVitalIcon(record.vitals.bloodGlucose.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.bloodGlucose.value}
                          {' '}
                          {record.vitals.bloodGlucose.unit}
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.bloodGlucose.status) as any} className="text-xs">
                          {record.vitals.bloodGlucose.status}
                        </Badge>
                      </div>

                      {/* Weight */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Weight</span>
                          {getVitalIcon(record.vitals.weight.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.weight.value}
                          {' '}
                          {record.vitals.weight.unit}
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.weight.status) as any} className="text-xs">
                          {record.vitals.weight.status}
                        </Badge>
                      </div>

                      {/* Height */}
                      <div className="rounded-md bg-muted p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Height</span>
                          {getVitalIcon(record.vitals.height.status)}
                        </div>
                        <p className="font-bold">
                          {record.vitals.height.value}
                          {' '}
                          {record.vitals.height.unit}
                        </p>
                        <Badge variant={getVitalStatus(record.vitals.height.status) as any} className="text-xs">
                          {record.vitals.height.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Notes */}
                    {record.notes && (
                      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
                        <p className="mb-1 text-sm font-medium text-yellow-800">Clinical Notes:</p>
                        <p className="text-sm text-yellow-700">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
