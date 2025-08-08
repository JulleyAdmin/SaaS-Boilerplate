'use client';

import { Filter, Pill, Plus, Printer, Search } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const prescriptions = [
    {
      prescriptionId: 'RX-2024-001',
      patientName: 'John Doe',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      date: '2024-01-15',
      status: 'dispensed',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
      ],
    },
    {
      prescriptionId: 'RX-2024-002',
      patientName: 'Jane Smith',
      doctor: 'Dr. Michael Brown',
      department: 'Orthopedics',
      date: '2024-01-14',
      status: 'pending',
      medications: [
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'Three times daily', duration: '5 days' },
      ],
    },
    {
      prescriptionId: 'RX-2024-003',
      patientName: 'Ram Kumar',
      doctor: 'Dr. Priya Sharma',
      department: 'General Medicine',
      date: '2024-01-13',
      status: 'partial',
      medications: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'As needed', duration: '7 days' },
        { name: 'Cough Syrup', dosage: '10ml', frequency: 'Three times daily', duration: '5 days' },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispensed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'partial':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">
            Manage patient prescriptions, medication orders, and pharmacy dispensing
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          New Prescription
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
            <Pill className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispensed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,132</div>
            <p className="text-xs text-muted-foreground">
              Completed orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">
              Awaiting pharmacy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fill Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23min</div>
            <p className="text-xs text-muted-foreground">
              Processing time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prescription Management */}
      <Card>
        <CardHeader>
          <CardTitle>Prescription Orders</CardTitle>
          <CardDescription>
            View and manage patient prescriptions and medication orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions..."
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
              <Printer className="mr-2 size-4" />
              Print Queue
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Prescriptions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="dispensed">Dispensed</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {prescriptions.map(prescription => (
                  <div key={prescription.prescriptionId} className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{prescription.prescriptionId}</h3>
                          <Badge variant={getStatusColor(prescription.status) as any}>
                            {prescription.status}
                          </Badge>
                        </div>
                        <p className="font-medium">{prescription.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {prescription.department}
                          {' '}
                          •
                          {prescription.doctor}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-muted-foreground">{prescription.date}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Printer className="mr-1 size-3" />
                            Print
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Medications:</h4>
                      {prescription.medications.map((med, index) => (
                        <div key={index} className="rounded-md bg-muted p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{med.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {med.dosage}
                                {' '}
                                •
                                {med.frequency}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">{med.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
