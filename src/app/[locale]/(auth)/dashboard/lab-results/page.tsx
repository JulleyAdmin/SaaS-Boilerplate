'use client';

import { AlertTriangle, CheckCircle, Download, Filter, Search, TestTube } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LabResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const labResults = [
    {
      testId: 'LAB-2024-001',
      patientName: 'John Doe',
      patientId: 'P-12345',
      testType: 'Complete Blood Count',
      orderedBy: 'Dr. Sarah Wilson',
      collectionDate: '2024-01-15',
      resultDate: '2024-01-15',
      status: 'completed',
      priority: 'routine',
      critical: false,
      results: [
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5-17.5', status: 'normal' },
        { parameter: 'WBC Count', value: '8.5', unit: '×10³/μL', range: '4.0-11.0', status: 'normal' },
        { parameter: 'Platelet Count', value: '180', unit: '×10³/μL', range: '150-450', status: 'normal' },
      ],
    },
    {
      testId: 'LAB-2024-002',
      patientName: 'Jane Smith',
      patientId: 'P-12346',
      testType: 'Lipid Profile',
      orderedBy: 'Dr. Michael Brown',
      collectionDate: '2024-01-14',
      resultDate: '2024-01-14',
      status: 'completed',
      priority: 'urgent',
      critical: true,
      results: [
        { parameter: 'Total Cholesterol', value: '280', unit: 'mg/dL', range: '<200', status: 'high' },
        { parameter: 'LDL Cholesterol', value: '180', unit: 'mg/dL', range: '<100', status: 'high' },
        { parameter: 'HDL Cholesterol', value: '35', unit: 'mg/dL', range: '>40', status: 'low' },
      ],
    },
    {
      testId: 'LAB-2024-003',
      patientName: 'Ram Kumar',
      patientId: 'P-12347',
      testType: 'Blood Glucose',
      orderedBy: 'Dr. Priya Sharma',
      collectionDate: '2024-01-13',
      resultDate: 'Pending',
      status: 'processing',
      priority: 'routine',
      critical: false,
      results: [],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'stat':
        return 'destructive';
      case 'routine':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getResultStatus = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="size-4 text-green-600" />;
      case 'high':
      case 'low':
        return <AlertTriangle className="size-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lab Results</h1>
          <p className="text-muted-foreground">
            View and manage laboratory test results and reports
          </p>
        </div>
        <Button>
          <Download className="mr-2 size-4" />
          Export Results
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">742</div>
            <p className="text-xs text-muted-foreground">
              Results available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Values</CardTitle>
            <AlertTriangle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. TAT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4hrs</div>
            <p className="text-xs text-muted-foreground">
              Turnaround time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lab Results Management */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Results</CardTitle>
          <CardDescription>
            View patient test results and laboratory reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, test, or result..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {labResults.map(test => (
                  <div key={test.testId} className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{test.testId}</h3>
                          <Badge variant={getStatusColor(test.status) as any}>
                            {test.status}
                          </Badge>
                          <Badge variant={getPriorityColor(test.priority) as any}>
                            {test.priority}
                          </Badge>
                          {test.critical && (
                            <Badge variant="destructive">Critical</Badge>
                          )}
                        </div>
                        <p className="font-medium">{test.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {test.patientId}
                          {' '}
                          •
                          {test.testType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ordered by:
                          {' '}
                          {test.orderedBy}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-muted-foreground">
                          Collected:
                          {' '}
                          {test.collectionDate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Result:
                          {' '}
                          {test.resultDate}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Report</Button>
                          {test.status === 'completed' && (
                            <Button size="sm">
                              <Download className="mr-1 size-3" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {test.results.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Results:</h4>
                        <div className="grid gap-2">
                          {test.results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md bg-muted p-3">
                              <div className="flex items-center gap-2">
                                {getResultStatus(result.status)}
                                <span className="font-medium">{result.parameter}</span>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {result.value}
                                  {' '}
                                  {result.unit}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Range:
                                  {' '}
                                  {result.range}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
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
