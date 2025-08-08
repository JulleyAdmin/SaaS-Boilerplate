'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  Printer,
  Send,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  TestTube,
  Microscope,
  Building2,
  Phone,
  Mail,
  QrCode,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

interface TestParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'H' | 'L' | 'C';
  method?: string;
}

interface CompletedTest {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  testCode: string;
  testName: string;
  category: string;
  sampleId: string;
  orderedBy: string;
  collectionDate: string;
  reportDate: string;
  urgency: 'routine' | 'urgent' | 'stat';
  status: 'completed' | 'verified' | 'reported';
  technician: string;
  pathologist?: string;
  parameters: TestParameter[];
  comments?: string;
  criticalValue: boolean;
}

interface LabReport {
  reportId: string;
  tests: CompletedTest[];
  patientInfo: {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email?: string;
    address: string;
  };
  reportDate: string;
  totalTests: number;
}

export default function LabReportGeneration() {
  const { toast } = useToast();
  const [selectedTest, setSelectedTest] = useState<CompletedTest | null>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ready-for-report');

  // Mock data for completed tests
  const [completedTests] = useState<CompletedTest[]>([
    {
      id: 'LT001',
      patientId: 'P001',
      patientName: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      testCode: 'CBC001',
      testName: 'Complete Blood Count',
      category: 'Hematology',
      sampleId: 'S20240807001',
      orderedBy: 'Dr. Amit Sharma',
      collectionDate: '2024-08-07T09:30:00',
      reportDate: '2024-08-07T11:30:00',
      urgency: 'stat',
      status: 'completed',
      technician: 'Lab Tech A',
      pathologist: 'Dr. Pathology Specialist',
      criticalValue: true,
      parameters: [
        { name: 'Hemoglobin', value: '8.2', unit: 'g/dL', referenceRange: '12.0-16.0', flag: 'L' },
        { name: 'Total WBC Count', value: '15500', unit: '/cumm', referenceRange: '4000-11000', flag: 'H' },
        { name: 'RBC Count', value: '3.8', unit: 'million/cumm', referenceRange: '4.5-5.5', flag: 'L' },
        { name: 'Platelet Count', value: '185000', unit: '/cumm', referenceRange: '150000-450000' },
        { name: 'Hematocrit', value: '25.6', unit: '%', referenceRange: '36-46', flag: 'L' },
        { name: 'MCV', value: '82', unit: 'fL', referenceRange: '80-100' },
        { name: 'MCH', value: '28', unit: 'pg', referenceRange: '27-32' },
        { name: 'MCHC', value: '34', unit: 'g/dL', referenceRange: '32-36' }
      ],
      comments: 'Low hemoglobin and hematocrit suggest anemia. Elevated WBC count indicates possible infection or inflammation.'
    },
    {
      id: 'LT002',
      patientId: 'P002',
      patientName: 'Priya Patel',
      age: 32,
      gender: 'Female',
      testCode: 'LFT001',
      testName: 'Liver Function Test',
      category: 'Biochemistry',
      sampleId: 'S20240807002',
      orderedBy: 'Dr. Priya Patel',
      collectionDate: '2024-08-07T08:30:00',
      reportDate: '2024-08-07T11:00:00',
      urgency: 'routine',
      status: 'verified',
      technician: 'Lab Tech B',
      pathologist: 'Dr. Clinical Biochemist',
      criticalValue: false,
      parameters: [
        { name: 'Total Bilirubin', value: '0.8', unit: 'mg/dL', referenceRange: '0.2-1.2' },
        { name: 'Direct Bilirubin', value: '0.2', unit: 'mg/dL', referenceRange: '0.0-0.3' },
        { name: 'SGPT (ALT)', value: '28', unit: 'U/L', referenceRange: '5-40' },
        { name: 'SGOT (AST)', value: '32', unit: 'U/L', referenceRange: '5-35' },
        { name: 'Alkaline Phosphatase', value: '85', unit: 'U/L', referenceRange: '30-120' },
        { name: 'Total Protein', value: '7.2', unit: 'g/dL', referenceRange: '6.0-8.0' },
        { name: 'Albumin', value: '4.1', unit: 'g/dL', referenceRange: '3.5-5.0' }
      ],
      comments: 'All liver function parameters are within normal limits.'
    }
  ]);

  // Generate lab report
  const generateReport = (test: CompletedTest): LabReport => {
    return {
      reportId: `RPT-${test.id}-${Date.now()}`,
      tests: [test],
      patientInfo: {
        id: test.patientId,
        name: test.patientName,
        age: test.age,
        gender: test.gender,
        phone: '9876543210', // Mock data
        email: 'patient@example.com',
        address: '123 Main Street, Mumbai - 400001'
      },
      reportDate: new Date().toISOString(),
      totalTests: 1
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'verified': return 'default';
      case 'reported': return 'default';
      default: return 'secondary';
    }
  };

  const filteredTests = completedTests.filter(test => 
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTestsByStatus = (status: string) => {
    if (status === 'ready-for-report') return filteredTests.filter(t => t.status === 'verified');
    if (status === 'completed') return filteredTests.filter(t => t.status === 'completed');
    if (status === 'reported') return filteredTests.filter(t => t.status === 'reported');
    if (status === 'critical') return filteredTests.filter(t => t.criticalValue);
    return filteredTests;
  };

  const handleGenerateReport = (test: CompletedTest) => {
    setSelectedTest(test);
    setShowReportPreview(true);
  };

  const handlePrintReport = () => {
    toast({
      title: "Printing report",
      description: "Lab report is being sent to printer",
    });
  };

  const handleEmailReport = () => {
    toast({
      title: "Email sent",
      description: "Lab report has been emailed to patient and doctor",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download started",
      description: "PDF report is being downloaded",
    });
  };

  const ReportPreview = ({ test }: { test: CompletedTest }) => {
    const report = generateReport(test);
    
    return (
      <div className="space-y-6 p-6 bg-white max-w-4xl mx-auto" id="lab-report">
        {/* Hospital Header */}
        <div className="text-center border-b-2 border-gray-300 pb-4">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <Building2 className="h-8 w-8 text-primary mb-2" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">SANJEEVANI HOSPITAL & MEDICAL CENTRE</h1>
              <p className="text-sm text-muted-foreground">123 Main Street, Mumbai - 400001</p>
              <p className="text-sm text-muted-foreground">Tel: 022-12345678 | Email: lab@sanjeevani.com</p>
              <p className="text-xs text-muted-foreground mt-1">
                NABL Accredited Laboratory | License: MH/LAB/2024/001
              </p>
            </div>
            <div className="text-right">
              <QrCode className="h-12 w-12 border-2 border-gray-300 p-1" />
              <p className="text-xs text-muted-foreground">Digital Report</p>
            </div>
          </div>
        </div>

        {/* Report Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">LABORATORY REPORT</h2>
          <div className="text-right">
            <p className="text-sm font-semibold">Report ID: {report.reportId}</p>
            <p className="text-sm text-muted-foreground">
              Report Date: {format(new Date(report.reportDate), 'dd MMM yyyy HH:mm')}
            </p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="font-semibold text-primary border-b">PATIENT INFORMATION</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {report.patientInfo.name}</p>
              <p><span className="font-medium">Age/Gender:</span> {report.patientInfo.age} years / {report.patientInfo.gender}</p>
              <p><span className="font-medium">Patient ID:</span> {report.patientInfo.id}</p>
              <p><span className="font-medium">Contact:</span> {report.patientInfo.phone}</p>
              {report.patientInfo.email && (
                <p><span className="font-medium">Email:</span> {report.patientInfo.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-primary border-b">TEST INFORMATION</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Referring Doctor:</span> {test.orderedBy}</p>
              <p><span className="font-medium">Sample ID:</span> {test.sampleId}</p>
              <p><span className="font-medium">Collection Date:</span> {format(new Date(test.collectionDate), 'dd MMM yyyy HH:mm')}</p>
              <p><span className="font-medium">Report Date:</span> {format(new Date(test.reportDate), 'dd MMM yyyy HH:mm')}</p>
              {test.urgency === 'stat' && (
                <Badge variant="destructive" className="mt-1">STAT</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-primary border-b pb-1">{test.testName.toUpperCase()} RESULTS</h3>
          
          <div className="overflow-hidden border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Parameter</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Result</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Unit</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Reference Range</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Flag</th>
                </tr>
              </thead>
              <tbody>
                {test.parameters.map((param, index) => (
                  <tr 
                    key={index} 
                    className={`border-t ${param.flag === 'C' ? 'bg-red-50' : param.flag ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="px-4 py-2 text-sm font-medium">{param.name}</td>
                    <td className={`px-4 py-2 text-sm font-semibold ${
                      param.flag === 'C' ? 'text-red-700' : param.flag ? 'text-amber-700' : ''
                    }`}>
                      {param.value}
                    </td>
                    <td className="px-4 py-2 text-sm">{param.unit}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">{param.referenceRange}</td>
                    <td className="px-4 py-2">
                      {param.flag && (
                        <Badge 
                          variant={param.flag === 'C' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {param.flag === 'C' ? 'Critical' : param.flag === 'H' ? 'High' : 'Low'}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments */}
        {test.comments && (
          <div className="space-y-2">
            <h3 className="font-semibold text-primary border-b pb-1">INTERPRETATION</h3>
            <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              {test.comments}
            </p>
          </div>
        )}

        {/* Critical Values Alert */}
        {test.criticalValue && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">CRITICAL VALUES ALERT</h4>
                <p className="text-sm text-red-700">
                  This report contains critical values that have been immediately communicated to the ordering physician.
                  Patient should seek immediate medical attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8">
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2">
              <p className="text-sm font-semibold">{test.technician}</p>
              <p className="text-xs text-muted-foreground">Medical Laboratory Technician</p>
              <p className="text-xs text-muted-foreground">Date: {format(new Date(), 'dd/MM/yyyy')}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2">
              <p className="text-sm font-semibold">{test.pathologist}</p>
              <p className="text-xs text-muted-foreground">Consultant Pathologist</p>
              <p className="text-xs text-muted-foreground">Date: {format(new Date(), 'dd/MM/yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground border-t pt-4">
          <p>This report is computer generated and does not require signature if electronically transmitted.</p>
          <p>For any queries, please contact the laboratory at lab@sanjeevani.com or 022-12345678</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laboratory Report Generation</h1>
          <p className="text-muted-foreground">Generate and manage laboratory reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Report Templates
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, test name, or test code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Reports</CardTitle>
          <CardDescription>Manage and generate laboratory reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ready-for-report">
                Ready for Report ({getTestsByStatus('ready-for-report').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({getTestsByStatus('completed').length})
              </TabsTrigger>
              <TabsTrigger value="reported">
                Reported ({getTestsByStatus('reported').length})
              </TabsTrigger>
              <TabsTrigger value="critical">
                Critical ({getTestsByStatus('critical').length})
              </TabsTrigger>
            </TabsList>

            {['ready-for-report', 'completed', 'reported', 'critical'].map(tab => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {getTestsByStatus(tab).map((test) => (
                      <Card 
                        key={test.id} 
                        className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                          test.criticalValue ? 'border-red-200 bg-red-50' : ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <TestTube className="h-4 w-4" />
                                <Badge variant={getStatusColor(test.status)}>
                                  {test.status}
                                </Badge>
                                {test.criticalValue && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Critical
                                  </Badge>
                                )}
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{test.testName}</p>
                                  <span className="text-sm text-muted-foreground">({test.testCode})</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {test.patientName} ({test.age}Y/{test.gender})
                                  </span>
                                  <span>•</span>
                                  <span>{test.orderedBy}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(test.reportDate), 'dd/MM HH:mm')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGenerateReport(test)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview Report
                              </Button>
                              
                              {test.status === 'verified' && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleGenerateReport(test)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Generate Report
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Preview Dialog */}
      <Dialog open={showReportPreview} onOpenChange={setShowReportPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Laboratory Report Preview</DialogTitle>
            <DialogDescription>
              {selectedTest?.testName} - {selectedTest?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[70vh] pr-4">
            {selectedTest && <ReportPreview test={selectedTest} />}
          </ScrollArea>
          
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReportPreview(false)}>
                Close
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleEmailReport}>
                <Send className="h-4 w-4 mr-2" />
                Email Report
              </Button>
              <Button onClick={handlePrintReport}>
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}