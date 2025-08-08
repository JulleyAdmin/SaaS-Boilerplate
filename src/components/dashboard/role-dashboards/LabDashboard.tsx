'use client';

import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  FlaskConical,
  TestTube,
  TrendingUp,
  Upload,
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
  generateLabResult,
  generatePatient,
  randomInt,
} from '@/mocks/hms';

/**
 * Lab Dashboard Component
 * Manages lab tests, sample processing, and report generation
 */
export function LabDashboard() {

  // Generate mock data
  const mockData = useMemo(() => {
    const patients = Array.from({ length: 15 }, () => generatePatient('clinic-1'));

    const labResults = patients.map(patient =>
      generateLabResult('consultation-1', 'clinic-1', patient.patientId),
    );

    return {
      patients,
      labResults,
      stats: {
        totalTests: 174, // Fixed value to avoid hydration mismatch
        pendingSamples: 32, // Fixed value to avoid hydration mismatch
        processingTests: 18, // Fixed value to avoid hydration mismatch
        completedToday: 98, // Fixed value to avoid hydration mismatch
        criticalResults: 5, // Fixed value to avoid hydration mismatch
        turnaroundTime: 3, // Fixed value to avoid hydration mismatch
      },
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tests</CardTitle>
            <TestTube className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.stats.completedToday}
              {' '}
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Samples</CardTitle>
            <FlaskConical className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.pendingSamples}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.stats.processingTests}
              {' '}
              in processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Results</CardTitle>
            <AlertCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockData.stats.criticalResults}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate notification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg TAT</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.stats.turnaroundTime}
              h
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 3h
            </p>
            <Progress
              value={(3 / mockData.stats.turnaroundTime) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Test Queue */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Test Queue</CardTitle>
            <CardDescription>Sample processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4 space-y-3">
                {mockData.labResults.slice(0, 5).map((result, index) => {
                  const patient = mockData.patients[index];
                  return (
                    <div
                      key={result.resultId}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {result.testCode.slice(-3)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {patient.firstName}
                            {' '}
                            {patient.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {result.testName}
                            {' '}
                            • Sample collected 30 min ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {index === 0 && <Badge variant="destructive">STAT</Badge>}
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/lab/process/${result.resultId}`}>
                            Process
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="processing" className="mt-4 space-y-3">
                {mockData.labResults.slice(5, 8).map(result => (
                  <div
                    key={result.resultId}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Activity className="size-5 animate-pulse text-blue-500" />
                      <div>
                        <p className="font-medium">{result.testName}</p>
                        <p className="text-sm text-muted-foreground">
                          Started 15 minutes ago • Est. 45 min remaining
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <p className="py-8 text-center text-muted-foreground">
                  View completed tests in reports section
                </p>
              </TabsContent>

              <TabsContent value="critical" className="mt-4 space-y-3">
                {mockData.labResults
                  .filter(r => r.criticalValue)
                  .slice(0, 3)
                  .map((result, index) => {
                    const patient = mockData.patients[index];
                    return (
                      <div
                        key={result.resultId}
                        className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <AlertCircle className="size-5 text-red-500" />
                          <div>
                            <p className="font-medium">
                              {patient.firstName}
                              {' '}
                              {patient.lastName}
                            </p>
                            <p className="text-sm text-red-700">
                              {result.testName}
                              :
                              {result.testValue}
                              {' '}
                              (Critical)
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive">
                          Notify Doctor
                        </Button>
                      </div>
                    );
                  })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Actions & Information */}
        <div className="space-y-6 lg:col-span-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/lab/sample-collection">
                  <TestTube className="mr-2 size-4" />
                  Sample Collection
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/lab/results-entry">
                  <Upload className="mr-2 size-4" />
                  Enter Results
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/lab/reports/generate">
                  <FileText className="mr-2 size-4" />
                  Generate Reports
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/lab/quality-control">
                  <BarChart3 className="mr-2 size-4" />
                  Quality Control
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>Lab equipment overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="size-4 text-green-500" />
                  <span className="text-sm">Hematology Analyzer</span>
                </div>
                <Badge variant="outline" className="bg-green-50">Operational</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="size-4 text-green-500" />
                  <span className="text-sm">Chemistry Analyzer</span>
                </div>
                <Badge variant="outline" className="bg-green-50">Operational</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="size-4 text-amber-500" />
                  <span className="text-sm">Electrolyte Analyzer</span>
                </div>
                <Badge variant="outline" className="bg-amber-50">Maintenance Due</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="size-4 text-green-500" />
                  <span className="text-sm">Microscope Station</span>
                </div>
                <Badge variant="outline" className="bg-green-50">Available</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Common Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Tests Today</CardTitle>
              <CardDescription>Most requested</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Complete Blood Count', count: 35, tat: '2h' },
                { name: 'Blood Sugar Fasting', count: 28, tat: '1h' },
                { name: 'Lipid Profile', count: 22, tat: '3h' },
                { name: 'Liver Function Test', count: 18, tat: '4h' },
                { name: 'Thyroid Profile', count: 15, tat: '4h' },
              ].map(test => (
                <div key={test.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{test.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {test.count}
                      {' '}
                      tests • TAT:
                      {' '}
                      {test.tat}
                    </p>
                  </div>
                  <TrendingUp className="size-4 text-green-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
