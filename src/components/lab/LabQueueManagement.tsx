'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  TestTube,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  User,
  Calendar,
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Send,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Package,
  Beaker,
  Timer,
  AlertTriangle,
  ChevronRight,
  QrCode,
  ScanLine,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  testCode: string;
  testName: string;
  category: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'sample-collected' | 'processing' | 'completed' | 'verified' | 'reported';
  orderedBy: string;
  orderedDate: string;
  collectionTime?: string;
  processingStartTime?: string;
  completionTime?: string;
  sampleType: string;
  sampleId?: string;
  barcode?: string;
  department: string;
  clinicalNotes?: string;
  tatHours: number;
  criticalValue?: boolean;
}

interface TestResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'H' | 'L' | 'C'; // High, Low, Critical
}

export default function LabQueueManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [showSampleCollection, setShowSampleCollection] = useState(false);
  const [showResultEntry, setShowResultEntry] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock data - replace with API calls
  const [labTests, setLabTests] = useState<LabTest[]>([
    {
      id: 'LT001',
      patientId: 'P001',
      patientName: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      testCode: 'CBC001',
      testName: 'Complete Blood Count',
      category: 'Hematology',
      priority: 'stat',
      status: 'pending',
      orderedBy: 'Dr. Amit Sharma',
      orderedDate: '2024-08-07T09:00:00',
      sampleType: 'Blood (EDTA)',
      department: 'Emergency',
      clinicalNotes: 'Patient with fever and weakness',
      tatHours: 2
    },
    {
      id: 'LT002',
      patientId: 'P002',
      patientName: 'Priya Patel',
      age: 32,
      gender: 'Female',
      testCode: 'BSF001',
      testName: 'Blood Sugar Fasting',
      category: 'Biochemistry',
      priority: 'routine',
      status: 'sample-collected',
      orderedBy: 'Dr. Priya Patel',
      orderedDate: '2024-08-07T08:30:00',
      collectionTime: '2024-08-07T09:15:00',
      sampleType: 'Blood (Fluoride)',
      sampleId: 'S20240807001',
      barcode: 'BC20240807001',
      department: 'OPD',
      tatHours: 1
    },
    {
      id: 'LT003',
      patientId: 'P003',
      patientName: 'Amit Singh',
      age: 28,
      gender: 'Male',
      testCode: 'LFT001',
      testName: 'Liver Function Test',
      category: 'Biochemistry',
      priority: 'urgent',
      status: 'processing',
      orderedBy: 'Dr. Rahul Singh',
      orderedDate: '2024-08-07T07:00:00',
      collectionTime: '2024-08-07T07:30:00',
      processingStartTime: '2024-08-07T08:00:00',
      sampleType: 'Blood (Serum)',
      sampleId: 'S20240807002',
      barcode: 'BC20240807002',
      department: 'ICU',
      clinicalNotes: 'Post-operative monitoring',
      tatHours: 4
    },
    {
      id: 'LT004',
      patientId: 'P004',
      patientName: 'Sunita Verma',
      age: 55,
      gender: 'Female',
      testCode: 'LP001',
      testName: 'Lipid Profile',
      category: 'Biochemistry',
      priority: 'routine',
      status: 'completed',
      orderedBy: 'Dr. Amit Sharma',
      orderedDate: '2024-08-07T06:00:00',
      collectionTime: '2024-08-07T06:30:00',
      processingStartTime: '2024-08-07T07:00:00',
      completionTime: '2024-08-07T09:00:00',
      sampleType: 'Blood (Serum)',
      sampleId: 'S20240807003',
      barcode: 'BC20240807003',
      department: 'Cardiology',
      tatHours: 3,
      criticalValue: true
    }
  ]);

  // Sample collection form state
  const [collectionData, setCollectionData] = useState({
    sampleId: '',
    barcode: '',
    collectedBy: '',
    collectionNotes: '',
    sampleQuality: 'adequate',
    fastingConfirmed: false
  });

  // Result entry form state
  const [resultData, setResultData] = useState<TestResult[]>([
    { parameter: '', value: '', unit: '', referenceRange: '', flag: undefined }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'sample-collected': return 'default';
      case 'processing': return 'default';
      case 'completed': return 'default';
      case 'verified': return 'default';
      case 'reported': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'destructive';
      case 'urgent': return 'default';
      case 'routine': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'sample-collected': return <Package className="h-4 w-4" />;
      case 'processing': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'reported': return <FileText className="h-4 w-4" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || test.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || test.category === filterCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const getTestsByStatus = (status: string) => {
    if (status === 'all') return filteredTests;
    return filteredTests.filter(test => {
      if (status === 'pending') return test.status === 'pending';
      if (status === 'in-progress') return ['sample-collected', 'processing'].includes(test.status);
      if (status === 'completed') return ['completed', 'verified', 'reported'].includes(test.status);
      if (status === 'critical') return test.criticalValue;
      return false;
    });
  };

  const handleSampleCollection = () => {
    if (!selectedTest) return;
    
    // Update test status
    const updatedTests = labTests.map(test => {
      if (test.id === selectedTest.id) {
        return {
          ...test,
          status: 'sample-collected' as const,
          collectionTime: new Date().toISOString(),
          sampleId: collectionData.sampleId,
          barcode: collectionData.barcode
        };
      }
      return test;
    });
    
    setLabTests(updatedTests);
    setShowSampleCollection(false);
    setCollectionData({
      sampleId: '',
      barcode: '',
      collectedBy: '',
      collectionNotes: '',
      sampleQuality: 'adequate',
      fastingConfirmed: false
    });
    
    toast({
      title: "Sample collected successfully",
      description: `Sample ${collectionData.sampleId} collected for ${selectedTest.testName}`,
    });
  };

  const handleStartProcessing = (testId: string) => {
    const updatedTests = labTests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          status: 'processing' as const,
          processingStartTime: new Date().toISOString()
        };
      }
      return test;
    });
    
    setLabTests(updatedTests);
    toast({
      title: "Processing started",
      description: "Test processing has begun",
    });
  };

  const handleResultEntry = () => {
    if (!selectedTest) return;
    
    // Update test status
    const updatedTests = labTests.map(test => {
      if (test.id === selectedTest.id) {
        return {
          ...test,
          status: 'completed' as const,
          completionTime: new Date().toISOString()
        };
      }
      return test;
    });
    
    setLabTests(updatedTests);
    setShowResultEntry(false);
    setResultData([
      { parameter: '', value: '', unit: '', referenceRange: '', flag: undefined }
    ]);
    
    toast({
      title: "Results entered successfully",
      description: `Results for ${selectedTest.testName} have been saved`,
    });
  };

  const addResultRow = () => {
    setResultData([...resultData, { parameter: '', value: '', unit: '', referenceRange: '', flag: undefined }]);
  };

  const updateResultRow = (index: number, field: keyof TestResult, value: any) => {
    const updated = [...resultData];
    updated[index] = { ...updated[index], [field]: value };
    setResultData(updated);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laboratory Queue Management</h1>
          <p className="text-muted-foreground">Process and track laboratory tests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{getTestsByStatus('pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{getTestsByStatus('in-progress').length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{getTestsByStatus('completed').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{getTestsByStatus('critical').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg TAT</p>
                <p className="text-2xl font-bold">2.5h</p>
              </div>
              <Timer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, test name, or test code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hematology">Hematology</SelectItem>
                <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                <SelectItem value="Microbiology">Microbiology</SelectItem>
                <SelectItem value="Serology">Serology</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Queue Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Test Queue</CardTitle>
          <CardDescription>Click on any test to view details and take action</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All Tests ({filteredTests.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({getTestsByStatus('pending').length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({getTestsByStatus('in-progress').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({getTestsByStatus('completed').length})
              </TabsTrigger>
              <TabsTrigger value="critical">
                Critical ({getTestsByStatus('critical').length})
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'in-progress', 'completed', 'critical'].map(tab => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {getTestsByStatus(tab).map((test) => (
                      <Card 
                        key={test.id} 
                        className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                          test.criticalValue ? 'border-red-200 bg-red-50' : ''
                        }`}
                        onClick={() => setSelectedTest(test)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <Badge variant={getStatusColor(test.status)}>
                                  {test.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{test.testName}</p>
                                  <span className="text-sm text-muted-foreground">({test.testCode})</span>
                                  <Badge variant={getPriorityColor(test.priority)} className="text-xs">
                                    {test.priority.toUpperCase()}
                                  </Badge>
                                  {test.criticalValue && (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Critical
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {test.patientName} ({test.age}Y/{test.gender})
                                  </span>
                                  <span>•</span>
                                  <span>{test.orderedBy}</span>
                                  <span>•</span>
                                  <span>{test.department}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(test.orderedDate), 'dd/MM HH:mm')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {test.barcode && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <QrCode className="h-3 w-3" />
                                  {test.barcode}
                                </div>
                              )}
                              
                              {test.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTest(test);
                                    setShowSampleCollection(true);
                                  }}
                                >
                                  <Package className="h-4 w-4 mr-2" />
                                  Collect Sample
                                </Button>
                              )}
                              
                              {test.status === 'sample-collected' && (
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartProcessing(test.id);
                                  }}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Processing
                                </Button>
                              )}
                              
                              {test.status === 'processing' && (
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTest(test);
                                    setShowResultEntry(true);
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Enter Results
                                </Button>
                              )}
                              
                              {['completed', 'verified'].includes(test.status) && (
                                <Button size="sm" variant="outline">
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print Report
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {test.clinicalNotes && (
                            <div className="mt-2 p-2 bg-secondary/20 rounded text-sm">
                              <span className="font-medium">Clinical Notes:</span> {test.clinicalNotes}
                            </div>
                          )}
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

      {/* Sample Collection Dialog */}
      <Dialog open={showSampleCollection} onOpenChange={setShowSampleCollection}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sample Collection</DialogTitle>
            <DialogDescription>
              Collect sample for {selectedTest?.testName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sample Requirements</AlertTitle>
              <AlertDescription>
                <p>Sample Type: {selectedTest?.sampleType}</p>
                <p>TAT: {selectedTest?.tatHours} hours</p>
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sample ID</Label>
                <Input
                  value={collectionData.sampleId}
                  onChange={(e) => setCollectionData({...collectionData, sampleId: e.target.value})}
                  placeholder="S20240807XXX"
                />
              </div>
              <div>
                <Label>Barcode</Label>
                <div className="flex gap-2">
                  <Input
                    value={collectionData.barcode}
                    onChange={(e) => setCollectionData({...collectionData, barcode: e.target.value})}
                    placeholder="BC20240807XXX"
                  />
                  <Button size="icon" variant="outline">
                    <ScanLine className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Collected By</Label>
              <Input
                value={collectionData.collectedBy}
                onChange={(e) => setCollectionData({...collectionData, collectedBy: e.target.value})}
                placeholder="Technician name"
              />
            </div>
            
            <div>
              <Label>Sample Quality</Label>
              <Select 
                value={collectionData.sampleQuality} 
                onValueChange={(value) => setCollectionData({...collectionData, sampleQuality: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adequate">Adequate</SelectItem>
                  <SelectItem value="hemolyzed">Hemolyzed</SelectItem>
                  <SelectItem value="clotted">Clotted</SelectItem>
                  <SelectItem value="insufficient">Insufficient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fasting"
                checked={collectionData.fastingConfirmed}
                onCheckedChange={(checked) => 
                  setCollectionData({...collectionData, fastingConfirmed: checked as boolean})
                }
              />
              <Label htmlFor="fasting">Fasting requirements confirmed</Label>
            </div>
            
            <div>
              <Label>Collection Notes</Label>
              <Textarea
                value={collectionData.collectionNotes}
                onChange={(e) => setCollectionData({...collectionData, collectionNotes: e.target.value})}
                placeholder="Any special notes..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSampleCollection(false)}>
              Cancel
            </Button>
            <Button onClick={handleSampleCollection}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Entry Dialog */}
      <Dialog open={showResultEntry} onOpenChange={setShowResultEntry}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Enter Test Results</DialogTitle>
            <DialogDescription>
              Enter results for {selectedTest?.testName} - {selectedTest?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <Alert>
                <TestTube className="h-4 w-4" />
                <AlertTitle>Test Information</AlertTitle>
                <AlertDescription>
                  <p>Test Code: {selectedTest?.testCode}</p>
                  <p>Sample ID: {selectedTest?.sampleId}</p>
                  <p>Category: {selectedTest?.category}</p>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Test Parameters</Label>
                  <Button size="sm" variant="outline" onClick={addResultRow}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Parameter
                  </Button>
                </div>
                
                {resultData.map((result, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2">
                    <Input
                      placeholder="Parameter"
                      value={result.parameter}
                      onChange={(e) => updateResultRow(index, 'parameter', e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={result.value}
                      onChange={(e) => updateResultRow(index, 'value', e.target.value)}
                    />
                    <Input
                      placeholder="Unit"
                      value={result.unit}
                      onChange={(e) => updateResultRow(index, 'unit', e.target.value)}
                    />
                    <Input
                      placeholder="Ref Range"
                      value={result.referenceRange}
                      onChange={(e) => updateResultRow(index, 'referenceRange', e.target.value)}
                    />
                    <Select
                      value={result.flag || 'normal'}
                      onValueChange={(value) => updateResultRow(index, 'flag', value === 'normal' ? undefined : value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="H">High</SelectItem>
                        <SelectItem value="L">Low</SelectItem>
                        <SelectItem value="C">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              
              <div>
                <Label>Comments/Interpretation</Label>
                <Textarea
                  placeholder="Enter any comments or interpretation..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="critical" />
                <Label htmlFor="critical">Mark as critical value (requires immediate notification)</Label>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResultEntry(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button onClick={handleResultEntry}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}