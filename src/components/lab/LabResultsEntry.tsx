'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  TestTube,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Save,
  Send,
  Printer,
  Download,
  Plus,
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  Microscope,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

interface TestParameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'H' | 'L' | 'C' | 'A'; // High, Low, Critical, Abnormal
  method?: string;
}

interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  testCode: string;
  testName: string;
  category: string;
  sampleType: string;
  sampleId: string;
  orderedBy: string;
  orderedDate: string;
  collectionDate: string;
  urgency: 'routine' | 'urgent' | 'stat';
  clinicalNotes: string;
  parameters: TestParameter[];
}

export default function LabResultsEntry() {
  const { toast } = useToast();
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [resultComments, setResultComments] = useState('');
  const [technician, setTechnician] = useState('');
  const [verified, setVerified] = useState(false);
  const [criticalAlert, setCriticalAlert] = useState(false);
  
  // Mock data for tests ready for result entry
  const [pendingTests] = useState<LabTest[]>([
    {
      id: 'LT001',
      patientId: 'P001',
      patientName: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      testCode: 'CBC001',
      testName: 'Complete Blood Count',
      category: 'Hematology',
      sampleType: 'Blood (EDTA)',
      sampleId: 'S20240807001',
      orderedBy: 'Dr. Amit Sharma',
      orderedDate: '2024-08-07T09:00:00',
      collectionDate: '2024-08-07T09:30:00',
      urgency: 'stat',
      clinicalNotes: 'Patient with fever and weakness',
      parameters: [
        { id: '1', name: 'Hemoglobin', value: '', unit: 'g/dL', referenceRange: '12.0-16.0', method: 'Cyanmethemoglobin' },
        { id: '2', name: 'Total WBC Count', value: '', unit: '/cumm', referenceRange: '4000-11000' },
        { id: '3', name: 'RBC Count', value: '', unit: 'million/cumm', referenceRange: '4.5-5.5' },
        { id: '4', name: 'Platelet Count', value: '', unit: '/cumm', referenceRange: '150000-450000' },
        { id: '5', name: 'Hematocrit', value: '', unit: '%', referenceRange: '36-46' },
        { id: '6', name: 'MCV', value: '', unit: 'fL', referenceRange: '80-100' },
        { id: '7', name: 'MCH', value: '', unit: 'pg', referenceRange: '27-32' },
        { id: '8', name: 'MCHC', value: '', unit: 'g/dL', referenceRange: '32-36' }
      ]
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
      sampleType: 'Blood (Serum)',
      sampleId: 'S20240807002',
      orderedBy: 'Dr. Priya Patel',
      orderedDate: '2024-08-07T08:00:00',
      collectionDate: '2024-08-07T08:30:00',
      urgency: 'routine',
      clinicalNotes: 'Routine health checkup',
      parameters: [
        { id: '1', name: 'Total Bilirubin', value: '', unit: 'mg/dL', referenceRange: '0.2-1.2' },
        { id: '2', name: 'Direct Bilirubin', value: '', unit: 'mg/dL', referenceRange: '0.0-0.3' },
        { id: '3', name: 'SGPT (ALT)', value: '', unit: 'U/L', referenceRange: '5-40' },
        { id: '4', name: 'SGOT (AST)', value: '', unit: 'U/L', referenceRange: '5-35' },
        { id: '5', name: 'Alkaline Phosphatase', value: '', unit: 'U/L', referenceRange: '30-120' },
        { id: '6', name: 'Total Protein', value: '', unit: 'g/dL', referenceRange: '6.0-8.0' },
        { id: '7', name: 'Albumin', value: '', unit: 'g/dL', referenceRange: '3.5-5.0' }
      ]
    }
  ]);

  const updateParameterValue = (parameterId: string, field: keyof TestParameter, value: any) => {
    if (!selectedTest) return;
    
    const updatedParameters = selectedTest.parameters.map(param => {
      if (param.id === parameterId) {
        return { ...param, [field]: value };
      }
      return param;
    });
    
    setSelectedTest({ ...selectedTest, parameters: updatedParameters });
  };

  const getParameterFlag = (value: string, referenceRange: string): 'H' | 'L' | 'C' | undefined => {
    if (!value || !referenceRange) return undefined;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return undefined;
    
    const ranges = referenceRange.split('-');
    if (ranges.length !== 2) return undefined;
    
    const min = parseFloat(ranges[0]);
    const max = parseFloat(ranges[1]);
    
    if (numValue < min * 0.5 || numValue > max * 2) return 'C'; // Critical
    if (numValue < min) return 'L'; // Low
    if (numValue > max) return 'H'; // High
    
    return undefined;
  };

  const autoCalculateFlag = (parameterId: string) => {
    if (!selectedTest) return;
    
    const parameter = selectedTest.parameters.find(p => p.id === parameterId);
    if (!parameter) return;
    
    const flag = getParameterFlag(parameter.value, parameter.referenceRange);
    updateParameterValue(parameterId, 'flag', flag);
    
    // Check if any parameter is critical
    const hasCritical = selectedTest.parameters.some(p => 
      getParameterFlag(p.value, p.referenceRange) === 'C'
    );
    setCriticalAlert(hasCritical);
  };

  const validateResults = (): boolean => {
    if (!selectedTest) return false;
    if (!technician.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter technician name",
        variant: "destructive"
      });
      return false;
    }
    
    const emptyParams = selectedTest.parameters.filter(p => !p.value.trim());
    if (emptyParams.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please enter values for all parameters`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSaveResults = () => {
    if (!validateResults()) return;
    
    toast({
      title: "Results saved",
      description: "Test results have been saved as draft",
    });
  };

  const handleSubmitResults = () => {
    if (!validateResults()) return;
    
    toast({
      title: "Results submitted",
      description: `Results for ${selectedTest?.testName} have been submitted for verification`,
    });
    
    // Reset form
    setSelectedTest(null);
    setResultComments('');
    setTechnician('');
    setVerified(false);
    setCriticalAlert(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laboratory Results Entry</h1>
          <p className="text-muted-foreground">Enter and verify laboratory test results</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            QC Dashboard
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Test Selection */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tests Ready for Results</CardTitle>
              <CardDescription>Select a test to enter results</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {pendingTests.map((test) => (
                    <Card
                      key={test.id}
                      className={`cursor-pointer transition-colors ${
                        selectedTest?.id === test.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-accent/50'
                      } ${test.urgency === 'stat' ? 'border-red-200 bg-red-50' : ''}`}
                      onClick={() => setSelectedTest(test)}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{test.testName}</p>
                              <p className="text-xs text-muted-foreground">{test.testCode}</p>
                            </div>
                            <Badge 
                              variant={test.urgency === 'stat' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {test.urgency.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <p className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {test.patientName} ({test.age}Y/{test.gender})
                            </p>
                            <p className="flex items-center gap-1">
                              <TestTube className="h-3 w-3" />
                              {test.sampleId}
                            </p>
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(test.collectionDate), 'dd/MM HH:mm')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Results Entry Form */}
        <div className="col-span-2">
          {selectedTest ? (
            <div className="space-y-4">
              {/* Test Info */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedTest.testName}</CardTitle>
                      <CardDescription>
                        {selectedTest.patientName} • {selectedTest.testCode} • {selectedTest.sampleId}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={selectedTest.urgency === 'stat' ? 'destructive' : 'secondary'}
                    >
                      {selectedTest.urgency.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sample Type</p>
                      <p className="font-medium">{selectedTest.sampleType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ordered By</p>
                      <p className="font-medium">{selectedTest.orderedBy}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Collection Date</p>
                      <p className="font-medium">
                        {format(new Date(selectedTest.collectionDate), 'dd MMM yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  
                  {selectedTest.clinicalNotes && (
                    <div className="mt-3 p-2 bg-secondary/20 rounded">
                      <p className="text-xs text-muted-foreground">Clinical Notes</p>
                      <p className="text-sm">{selectedTest.clinicalNotes}</p>
                    </div>
                  )}
                  
                  {criticalAlert && (
                    <Alert className="mt-3 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertTitle className="text-red-700">Critical Values Detected</AlertTitle>
                      <AlertDescription className="text-red-600">
                        This test contains critical values that require immediate physician notification.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Parameters Entry */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Parameters</CardTitle>
                  <CardDescription>Enter values for each parameter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                      <div>Parameter</div>
                      <div>Value</div>
                      <div>Unit</div>
                      <div>Reference Range</div>
                      <div>Flag</div>
                      <div>Actions</div>
                    </div>
                    
                    {/* Parameters */}
                    {selectedTest.parameters.map((parameter) => (
                      <div key={parameter.id} className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-sm font-medium">
                          {parameter.name}
                        </div>
                        <div>
                          <Input
                            size="sm"
                            value={parameter.value}
                            onChange={(e) => {
                              updateParameterValue(parameter.id, 'value', e.target.value);
                              // Auto-calculate flag after a short delay
                              setTimeout(() => autoCalculateFlag(parameter.id), 100);
                            }}
                            placeholder="Enter value"
                            className={
                              parameter.flag === 'C' 
                                ? 'border-red-500 bg-red-50' 
                                : parameter.flag === 'H' || parameter.flag === 'L'
                                ? 'border-amber-500 bg-amber-50'
                                : ''
                            }
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {parameter.unit}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {parameter.referenceRange}
                        </div>
                        <div>
                          {parameter.flag && (
                            <Badge 
                              variant={
                                parameter.flag === 'C' ? 'destructive' : 
                                parameter.flag === 'H' || parameter.flag === 'L' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {parameter.flag === 'C' ? 'Critical' : 
                               parameter.flag === 'H' ? 'High' :
                               parameter.flag === 'L' ? 'Low' : parameter.flag}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => autoCalculateFlag(parameter.id)}
                            className="h-6 px-2"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comments and Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Results Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Comments/Interpretation</Label>
                    <Textarea
                      value={resultComments}
                      onChange={(e) => setResultComments(e.target.value)}
                      placeholder="Enter any comments, interpretation, or notes about the results..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Technician</Label>
                      <Input
                        value={technician}
                        onChange={(e) => setTechnician(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <Label>Analysis Date & Time</Label>
                      <Input
                        value={format(new Date(), 'dd/MM/yyyy HH:mm')}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified"
                        checked={verified}
                        onCheckedChange={setVerified}
                      />
                      <Label htmlFor="verified">I have verified the results and they are accurate</Label>
                    </div>
                    
                    {criticalAlert && (
                      <div className="flex items-center space-x-2">
                        <Checkbox id="critical-notified" />
                        <Label htmlFor="critical-notified" className="text-red-600">
                          Critical values have been immediately communicated to the ordering physician
                        </Label>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Printer className="h-4 w-4 mr-2" />
                        Print Worksheet
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleSaveResults}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button 
                        onClick={handleSubmitResults}
                        disabled={!verified}
                        className={criticalAlert ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {criticalAlert ? 'Submit Critical Results' : 'Submit Results'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[600px] text-center">
                <Microscope className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Select a test to enter results</p>
                <p className="text-sm text-muted-foreground">
                  Choose a test from the list on the left to begin entering laboratory results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}