'use client';

import { Download, FileText, Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const records = [
    {
      recordId: 'MR-2024-001',
      patientName: 'John Doe',
      patientId: 'P-12345',
      recordType: 'Consultation',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      date: '2024-01-15',
      diagnosis: 'Hypertension',
      status: 'completed',
    },
    {
      recordId: 'MR-2024-002',
      patientName: 'Jane Smith',
      patientId: 'P-12346',
      recordType: 'Surgery',
      doctor: 'Dr. Michael Brown',
      department: 'Orthopedics',
      date: '2024-01-14',
      diagnosis: 'Fracture repair',
      status: 'completed',
    },
    {
      recordId: 'MR-2024-003',
      patientName: 'Ram Kumar',
      patientId: 'P-12347',
      recordType: 'Lab Test',
      doctor: 'Dr. Priya Sharma',
      department: 'Pathology',
      date: '2024-01-13',
      diagnosis: 'Blood work normal',
      status: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">
            Access and manage patient medical records, test results, and treatment history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          New Record
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Digitization rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Medical Records</CardTitle>
          <CardDescription>
            Find patient records by name, ID, diagnosis, or doctor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
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
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="lab">Lab Results</TabsTrigger>
              <TabsTrigger value="imaging">Imaging</TabsTrigger>
              <TabsTrigger value="surgery">Surgery</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {records.map(record => (
                  <div key={record.recordId} className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-accent">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{record.recordId}</h3>
                        <Badge variant={getStatusColor(record.status) as any}>
                          {record.status}
                        </Badge>
                      </div>
                      <p className="font-medium">{record.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.patientId}
                        {' '}
                        •
                        {record.department}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dr:
                        {' '}
                        {record.doctor}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="font-medium">{record.recordType}</p>
                      <p className="text-sm">{record.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
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
