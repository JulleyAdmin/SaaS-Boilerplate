'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  TestTube, 
  User, 
  Calendar, 
  Clock, 
  Search, 
  Plus,
  Printer,
  CheckCircle,
  AlertCircle,
  QrCode,
  Download,
  FileText,
  Droplet,
  Activity
} from 'lucide-react';

// Mock data for pending collections
const pendingCollections = [
  {
    id: 'SC001',
    patientName: 'Rajesh Kumar',
    patientId: 'PAT001234',
    age: 45,
    gender: 'Male',
    tests: ['Complete Blood Count', 'Lipid Profile'],
    testTypes: ['Blood'],
    orderedBy: 'Dr. Sharma',
    orderTime: '08:30 AM',
    priority: 'urgent',
    ward: 'General Ward A',
    bedNumber: '101',
    fasting: true
  },
  {
    id: 'SC002',
    patientName: 'Priya Patel',
    patientId: 'PAT001235',
    age: 32,
    gender: 'Female',
    tests: ['Urine Culture'],
    testTypes: ['Urine'],
    orderedBy: 'Dr. Gupta',
    orderTime: '09:15 AM',
    priority: 'routine',
    ward: 'OPD',
    bedNumber: '-',
    fasting: false
  },
  {
    id: 'SC003',
    patientName: 'Mohammed Ali',
    patientId: 'PAT001236',
    age: 28,
    gender: 'Male',
    tests: ['Blood Sugar', 'HbA1c', 'Kidney Function Test'],
    testTypes: ['Blood'],
    orderedBy: 'Dr. Chen',
    orderTime: '09:45 AM',
    priority: 'urgent',
    ward: 'ICU',
    bedNumber: 'ICU-03',
    fasting: true
  },
  {
    id: 'SC004',
    patientName: 'Sunita Devi',
    patientId: 'PAT001237',
    age: 55,
    gender: 'Female',
    tests: ['Thyroid Profile', 'Vitamin D'],
    testTypes: ['Blood'],
    orderedBy: 'Dr. Patel',
    orderTime: '10:00 AM',
    priority: 'routine',
    ward: 'General Ward B',
    bedNumber: '205',
    fasting: false
  }
];

const completedCollections = [
  {
    id: 'SC005',
    patientName: 'Amit Singh',
    patientId: 'PAT001238',
    collectedAt: '11:30 AM',
    collectedBy: 'Nurse Priya',
    sampleId: 'LAB2025080801',
    status: 'sent-to-lab'
  },
  {
    id: 'SC006',
    patientName: 'Deepa Reddy',
    patientId: 'PAT001239',
    collectedAt: '11:45 AM',
    collectedBy: 'Nurse Mary',
    sampleId: 'LAB2025080802',
    status: 'processing'
  }
];

export default function SampleCollectionPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterWard, setFilterWard] = useState('all');
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [collectionDetails, setCollectionDetails] = useState({
    sampleId: '',
    collectedBy: '',
    collectionTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    notes: '',
    tubeCodes: {
      purple: false, // EDTA
      red: false,    // Plain
      yellow: false, // SST
      grey: false,   // Fluoride
      blue: false,   // Citrate
      green: false   // Heparin
    }
  });

  const handleStartCollection = (patient: any) => {
    setSelectedPatient(patient);
    setCollectionDetails({
      ...collectionDetails,
      sampleId: `LAB${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    });
    setShowCollectionDialog(true);
  };

  const handleCompleteCollection = () => {
    if (!collectionDetails.collectedBy) {
      toast({
        title: "Error",
        description: "Please enter who collected the sample",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sample Collected",
      description: `Sample ${collectionDetails.sampleId} collected successfully`,
    });
    
    setShowCollectionDialog(false);
    setSelectedPatient(null);
  };

  const handlePrintBarcode = (sampleId: string) => {
    toast({
      title: "Printing Barcode",
      description: `Barcode for sample ${sampleId} sent to printer`,
    });
  };

  const filteredCollections = pendingCollections.filter(collection => {
    const matchesSearch = 
      collection.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || collection.priority === filterPriority;
    const matchesWard = filterWard === 'all' || collection.ward === filterWard;
    
    return matchesSearch && matchesPriority && matchesWard;
  });

  const wards = Array.from(new Set(pendingCollections.map(c => c.ward)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sample Collection</h1>
          <p className="text-muted-foreground">Collect and track laboratory samples from patients</p>
        </div>
        <Button>
          <Download className="mr-2 size-4" />
          Download Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Collections</CardTitle>
            <TestTube className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCollections.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting sample collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pendingCollections.filter(c => c.priority === 'urgent').length}
            </div>
            <p className="text-xs text-muted-foreground">High priority samples</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected Today</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCollections.length}</div>
            <p className="text-xs text-muted-foreground">Samples collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fasting Required</CardTitle>
            <Clock className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCollections.filter(c => c.fasting).length}
            </div>
            <p className="text-xs text-muted-foreground">Require fasting status</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wards.map(ward => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Collection Lists */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Collections</TabsTrigger>
          <TabsTrigger value="completed">Completed Today</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Sample Collections</CardTitle>
              <CardDescription>Samples waiting to be collected from patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCollections.map(collection => (
                  <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Droplet className="size-5 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{collection.patientName}</p>
                          <Badge variant={collection.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            {collection.priority}
                          </Badge>
                          {collection.fasting && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Fasting
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ID: {collection.patientId} • {collection.age}Y/{collection.gender}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>📍 {collection.ward} - Bed {collection.bedNumber}</span>
                          <span>🕐 Ordered at {collection.orderTime}</span>
                          <span>👨‍⚕️ {collection.orderedBy}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Tests Required:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {collection.tests.map((test, idx) => (
                              <Badge key={idx} variant="outline">{test}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleStartCollection(collection)}>
                      <TestTube className="mr-2 size-4" />
                      Collect Sample
                    </Button>
                  </div>
                ))}
                {filteredCollections.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No pending collections found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Collections</CardTitle>
              <CardDescription>Samples collected today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedCollections.map(collection => (
                  <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="size-5 text-green-500" />
                      <div>
                        <p className="font-medium">{collection.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          Sample ID: {collection.sampleId} • Collected at {collection.collectedAt} by {collection.collectedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={collection.status === 'processing' ? 'default' : 'secondary'}>
                        {collection.status === 'processing' ? 'In Lab' : 'Sent to Lab'}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handlePrintBarcode(collection.sampleId)}>
                        <Printer className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Collection Dialog */}
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Collect Sample</DialogTitle>
            <DialogDescription>
              Record sample collection details for {selectedPatient?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-4">
              {/* Patient Info */}
              <div className="rounded-lg bg-muted p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Patient:</span>
                    <span>{selectedPatient.patientName} ({selectedPatient.age}Y/{selectedPatient.gender})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{selectedPatient.ward} - Bed {selectedPatient.bedNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tests:</span>
                    <span>{selectedPatient.tests.join(', ')}</span>
                  </div>
                  {selectedPatient.fasting && (
                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertDescription>
                        Patient must be fasting for at least 8-12 hours
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Collection Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="sampleId">Sample ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="sampleId"
                      value={collectionDetails.sampleId}
                      readOnly
                    />
                    <Button variant="outline" size="icon">
                      <QrCode className="size-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="collectedBy">Collected By *</Label>
                  <Input
                    id="collectedBy"
                    value={collectionDetails.collectedBy}
                    onChange={(e) => setCollectionDetails({...collectionDetails, collectedBy: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="collectionTime">Collection Time</Label>
                  <Input
                    id="collectionTime"
                    value={collectionDetails.collectionTime}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Sample Type</Label>
                  <Input value={selectedPatient.testTypes.join(', ')} readOnly />
                </div>
              </div>

              {/* Tube Selection */}
              <div>
                <Label>Tubes Collected</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectionDetails.tubeCodes.purple}
                      onChange={(e) => setCollectionDetails({
                        ...collectionDetails,
                        tubeCodes: {...collectionDetails.tubeCodes, purple: e.target.checked}
                      })}
                    />
                    <span className="text-sm">🟣 Purple (EDTA)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectionDetails.tubeCodes.red}
                      onChange={(e) => setCollectionDetails({
                        ...collectionDetails,
                        tubeCodes: {...collectionDetails.tubeCodes, red: e.target.checked}
                      })}
                    />
                    <span className="text-sm">🔴 Red (Plain)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectionDetails.tubeCodes.yellow}
                      onChange={(e) => setCollectionDetails({
                        ...collectionDetails,
                        tubeCodes: {...collectionDetails.tubeCodes, yellow: e.target.checked}
                      })}
                    />
                    <span className="text-sm">🟡 Yellow (SST)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectionDetails.tubeCodes.grey}
                      onChange={(e) => setCollectionDetails({
                        ...collectionDetails,
                        tubeCodes: {...collectionDetails.tubeCodes, grey: e.target.checked}
                      })}
                    />
                    <span className="text-sm">⚪ Grey (Fluoride)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectionDetails.tubeCodes.blue}
                      onChange={(e) => setCollectionDetails({
                        ...collectionDetails,
                        tubeCodes: {...collectionDetails.tubeCodes, blue: e.target.checked}
                      })}
                    />
                    <span className="text-sm">🔵 Blue (Citrate)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectionDetails.tubeCodes.green}
                      onChange={(e) => setCollectionDetails({
                        ...collectionDetails,
                        tubeCodes: {...collectionDetails.tubeCodes, green: e.target.checked}
                      })}
                    />
                    <span className="text-sm">🟢 Green (Heparin)</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Collection Notes</Label>
                <Textarea
                  id="notes"
                  value={collectionDetails.notes}
                  onChange={(e) => setCollectionDetails({...collectionDetails, notes: e.target.value})}
                  placeholder="Any special notes or observations..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCollectionDialog(false)}>Cancel</Button>
            <Button onClick={handleCompleteCollection}>
              <CheckCircle className="mr-2 size-4" />
              Complete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}