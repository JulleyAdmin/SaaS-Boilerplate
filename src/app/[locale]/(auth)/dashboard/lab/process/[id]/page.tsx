'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft,
  Save,
  Send,
  Printer,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Clock,
  TestTube,
  Activity,
  Download
} from 'lucide-react';

// Mock test data - in production this would come from API
const getTestData = (id: string) => ({
  id,
  patientName: 'Rajesh Kumar',
  patientId: 'PAT001234',
  age: 45,
  gender: 'Male',
  testName: 'Complete Blood Count (CBC)',
  testCode: 'HEM001',
  category: 'Hematology',
  orderDate: '2025-08-08',
  orderTime: '10:30 AM',
  orderedBy: 'Dr. Sharma',
  priority: 'urgent',
  status: 'in-progress',
  sampleId: 'LAB2025080801',
  sampleType: 'Blood',
  sampleCollectedAt: '2025-08-08 11:00 AM',
  collectedBy: 'Nurse Priya',
  parameters: [
    { name: 'Hemoglobin', unit: 'g/dL', normalRange: '13.5-17.5', value: '', status: 'pending' },
    { name: 'RBC Count', unit: 'million/μL', normalRange: '4.5-5.5', value: '', status: 'pending' },
    { name: 'WBC Count', unit: 'cells/μL', normalRange: '4,500-11,000', value: '', status: 'pending' },
    { name: 'Platelet Count', unit: 'per μL', normalRange: '150,000-450,000', value: '', status: 'pending' },
    { name: 'Hematocrit', unit: '%', normalRange: '41-53', value: '', status: 'pending' },
    { name: 'MCV', unit: 'fL', normalRange: '80-100', value: '', status: 'pending' },
    { name: 'MCH', unit: 'pg', normalRange: '27-33', value: '', status: 'pending' },
    { name: 'MCHC', unit: 'g/dL', normalRange: '32-36', value: '', status: 'pending' },
    { name: 'Neutrophils', unit: '%', normalRange: '50-70', value: '', status: 'pending' },
    { name: 'Lymphocytes', unit: '%', normalRange: '20-40', value: '', status: 'pending' },
    { name: 'Monocytes', unit: '%', normalRange: '2-8', value: '', status: 'pending' },
    { name: 'Eosinophils', unit: '%', normalRange: '1-4', value: '', status: 'pending' },
    { name: 'Basophils', unit: '%', normalRange: '0.5-1', value: '', status: 'pending' }
  ]
});

export default function LabTestProcessPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const testId = params.id as string;
  
  const [testData, setTestData] = useState(getTestData(testId));
  const [parameters, setParameters] = useState(testData.parameters);
  const [interpretation, setInterpretation] = useState('');
  const [comments, setComments] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleParameterChange = (index: number, value: string) => {
    const updatedParams = [...parameters];
    updatedParams[index].value = value;
    
    // Auto-determine status based on value
    if (value) {
      const numValue = parseFloat(value);
      const range = updatedParams[index].normalRange;
      const [min, max] = range.includes('-') 
        ? range.split('-').map(v => parseFloat(v.replace(/,/g, '')))
        : [0, 0];
      
      if (!isNaN(numValue) && min && max) {
        if (numValue < min) {
          updatedParams[index].status = 'low';
        } else if (numValue > max) {
          updatedParams[index].status = 'high';
        } else {
          updatedParams[index].status = 'normal';
        }
      } else {
        updatedParams[index].status = 'normal';
      }
    }
    
    setParameters(updatedParams);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-500">Normal</Badge>;
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'low':
        return <Badge className="bg-orange-500">Low</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast({
        title: "Draft Saved",
        description: "Test results have been saved as draft",
      });
      setIsSaving(false);
    }, 1000);
  };

  const handleSubmitResults = () => {
    // Validate all parameters have values
    const incomplete = parameters.some(p => !p.value);
    if (incomplete) {
      toast({
        title: "Incomplete Results",
        description: "Please enter values for all parameters",
        variant: "destructive"
      });
      return;
    }

    if (!verifiedBy) {
      toast({
        title: "Verification Required",
        description: "Please select who verified the results",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      toast({
        title: "Results Submitted",
        description: "Test results have been finalized and sent to the doctor",
      });
      router.push('/dashboard/lab/queue');
    }, 1500);
  };

  const handlePrintReport = () => {
    toast({
      title: "Printing Report",
      description: "Lab report is being sent to printer",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/lab/queue')}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Queue
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Process Lab Test</h1>
            <p className="text-muted-foreground">Enter and verify test results</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="mr-2 size-4" />
            Print Report
          </Button>
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            <Save className="mr-2 size-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmitResults} disabled={isSaving}>
            <Send className="mr-2 size-4" />
            Submit Results
          </Button>
        </div>
      </div>

      {/* Test Information */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{testData.testName}</CardTitle>
                <CardDescription>Test ID: {testData.id}</CardDescription>
              </div>
              <Badge variant={testData.priority === 'urgent' ? 'destructive' : 'default'}>
                {testData.priority}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Patient</p>
                    <p className="text-sm text-muted-foreground">
                      {testData.patientName} ({testData.age}Y/{testData.gender})
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Patient ID</p>
                    <p className="text-sm text-muted-foreground">{testData.patientId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Ordered By</p>
                    <p className="text-sm text-muted-foreground">{testData.orderedBy}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TestTube className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sample</p>
                    <p className="text-sm text-muted-foreground">
                      {testData.sampleType} - {testData.sampleId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Order Date</p>
                    <p className="text-sm text-muted-foreground">
                      {testData.orderDate} at {testData.orderTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sample Collected</p>
                    <p className="text-sm text-muted-foreground">{testData.sampleCollectedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="size-5 text-green-500" />
              <span className="text-sm">Sample Collected</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="size-5 text-green-500" />
              <span className="text-sm">Sample Received in Lab</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-5 rounded-full border-2 border-blue-500 animate-pulse" />
              <span className="text-sm font-medium">Processing Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-5 rounded-full border-2 border-gray-300" />
              <span className="text-sm text-muted-foreground">Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-5 rounded-full border-2 border-gray-300" />
              <span className="text-sm text-muted-foreground">Report Generated</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Entry */}
      <Tabs defaultValue="parameters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="parameters">Test Parameters</TabsTrigger>
          <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters">
          <Card>
            <CardHeader>
              <CardTitle>Enter Test Results</CardTitle>
              <CardDescription>Input the measured values for each parameter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parameters.map((param, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-5 items-center">
                    <div className="md:col-span-2">
                      <Label>{param.name}</Label>
                      <p className="text-xs text-muted-foreground">Normal: {param.normalRange} {param.unit}</p>
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Enter value"
                        value={param.value}
                        onChange={(e) => handleParameterChange(index, e.target.value)}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {param.unit}
                    </div>
                    <div>
                      {getStatusBadge(param.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interpretation">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Interpretation</CardTitle>
              <CardDescription>Add interpretation and comments for the test results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="interpretation">Interpretation</Label>
                <Textarea
                  id="interpretation"
                  placeholder="Enter clinical interpretation of the results..."
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Any additional notes or observations..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>
              
              {/* Show alerts for abnormal values */}
              {parameters.some(p => p.status === 'high' || p.status === 'low') && (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    <strong>Abnormal Values Detected:</strong>
                    <ul className="mt-2 space-y-1">
                      {parameters.filter(p => p.status === 'high' || p.status === 'low').map((param, idx) => (
                        <li key={idx} className="text-sm">
                          • {param.name}: {param.value} {param.unit} ({param.status === 'high' ? 'Above' : 'Below'} normal range)
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Result Verification</CardTitle>
              <CardDescription>Review and verify the test results before submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verifiedBy">Verified By</Label>
                <Select value={verifiedBy} onValueChange={setVerifiedBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select verifying technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Patel">Dr. Patel - Senior Pathologist</SelectItem>
                    <SelectItem value="Dr. Kumar">Dr. Kumar - Lab Head</SelectItem>
                    <SelectItem value="Ms. Singh">Ms. Singh - Chief Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <CheckCircle className="size-4" />
                <AlertDescription>
                  By submitting these results, you confirm that:
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• All values have been double-checked for accuracy</li>
                    <li>• Quality control procedures have been followed</li>
                    <li>• The sample integrity was maintained throughout processing</li>
                    <li>• Results are ready for clinical use</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Result Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Parameters:</span>
                    <span>{parameters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Normal Values:</span>
                    <span className="text-green-600">
                      {parameters.filter(p => p.status === 'normal').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Abnormal Values:</span>
                    <span className="text-orange-600">
                      {parameters.filter(p => p.status === 'high' || p.status === 'low').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="text-gray-600">
                      {parameters.filter(p => p.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}