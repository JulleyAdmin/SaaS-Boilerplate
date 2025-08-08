'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Pill, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Calendar,
  Syringe,
  Shield,
  FileText,
  Timer
} from 'lucide-react';
import { useState } from 'react';

// Mock medication administration data
const medicationSchedule = [
  {
    id: 'MED001',
    patientName: 'Rajesh Kumar',
    patientId: 'P001',
    wardBed: 'General Ward A - Bed 101',
    medication: 'Metformin 500mg',
    dosage: '1 tablet',
    route: 'Oral',
    frequency: 'Twice daily',
    scheduledTime: '09:00 AM',
    status: 'pending',
    prescribedBy: 'Dr. Sarah Wilson',
    instructions: 'Take with meals to reduce stomach upset',
    lastAdministered: null,
    priority: 'normal',
    allergies: 'None known'
  },
  {
    id: 'MED002',
    patientName: 'Sunita Devi',
    patientId: 'P003',
    wardBed: 'ICU - Bed 201',
    medication: 'Morphine 10mg',
    dosage: '5ml injection',
    route: 'IV',
    frequency: 'Every 4 hours PRN',
    scheduledTime: '10:00 AM',
    status: 'administered',
    prescribedBy: 'Dr. Michael Brown',
    instructions: 'For severe pain management - monitor vitals after administration',
    lastAdministered: '10:15 AM',
    priority: 'high',
    allergies: 'Penicillin'
  },
  {
    id: 'MED003',
    patientName: 'Baby Sharma',
    patientId: 'P004',
    wardBed: 'Pediatric Ward - Bed 301',
    medication: 'Paracetamol Syrup',
    dosage: '5ml',
    route: 'Oral',
    frequency: 'Every 6 hours',
    scheduledTime: '11:00 AM',
    status: 'overdue',
    prescribedBy: 'Dr. Priya Patel',
    instructions: 'Administer if temperature >38°C, weight-based dosing',
    lastAdministered: '5:00 AM',
    priority: 'normal',
    allergies: 'None known'
  },
  {
    id: 'MED004',
    patientName: 'Amit Patel',
    patientId: 'P006',
    wardBed: 'Private Room - Bed 401',
    medication: 'Insulin Glargine',
    dosage: '20 units',
    route: 'Subcutaneous',
    frequency: 'Once daily',
    scheduledTime: '08:00 AM',
    status: 'administered',
    prescribedBy: 'Dr. Sarah Wilson',
    instructions: 'Rotate injection sites, monitor blood glucose',
    lastAdministered: '08:05 AM',
    priority: 'high',
    allergies: 'Sulfa drugs'
  },
  {
    id: 'MED005',
    patientName: 'Priya Sharma',
    patientId: 'P002',
    wardBed: 'General Ward B - Bed 105',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet',
    route: 'Oral',
    frequency: 'Once daily',
    scheduledTime: '12:00 PM',
    status: 'pending',
    prescribedBy: 'Dr. Michael Brown',
    instructions: 'Monitor blood pressure before administration',
    lastAdministered: null,
    priority: 'normal',
    allergies: 'None known'
  }
];

const administrationStats = {
  totalScheduled: 18,
  administered: 10,
  pending: 5,
  overdue: 3,
  onTimeRate: 85
};

export default function MedicationAdministrationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [administrationNotes, setAdministrationNotes] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'administered':
        return <Badge className="bg-green-500">Administered</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High Priority</Badge>;
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const administreMedication = (medicationId: string) => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Here you would update the medication status in your database
    console.log(`Administering medication ${medicationId} at ${currentTime}`);
    console.log(`Administration notes: ${administrationNotes}`);
    
    // Reset form
    setSelectedMedication(null);
    setAdministrationNotes('');
  };

  const filteredMedications = medicationSchedule.filter(med => {
    const matchesSearch = 
      med.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.wardBed.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || med.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || med.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medication Administration</h1>
          <p className="text-muted-foreground">Manage and track medication delivery to patients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 size-4" />
            Schedule View
          </Button>
          <Button>
            <FileText className="mr-2 size-4" />
            MAR Report
          </Button>
        </div>
      </div>

      {/* Alert for Overdue Medications */}
      {administrationStats.overdue > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <strong>{administrationStats.overdue} medications are overdue</strong> and require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
            <Pill className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{administrationStats.totalScheduled}</div>
            <p className="text-xs text-muted-foreground">Today's schedule</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administered</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{administrationStats.administered}</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{administrationStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting administration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{administrationStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <Timer className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{administrationStats.onTimeRate}%</div>
            <p className="text-xs text-muted-foreground">Administration accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, medication, or ward..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="administered">Administered</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medication Administration */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="administer">Quick Administration</TabsTrigger>
          <TabsTrigger value="history">Administration History</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <div className="grid gap-4 md:grid-cols-1">
            {filteredMedications.map(med => (
              <Card key={med.id} className={`${med.status === 'overdue' ? 'border-red-500 bg-red-50' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          <AvatarInitials name={med.patientName} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{med.patientName}</CardTitle>
                        <CardDescription>{med.wardBed} • ID: {med.patientId}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(med.status)}
                      {med.priority === 'high' && getPriorityBadge(med.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Medication</p>
                      <p className="font-semibold">{med.medication}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Dosage & Route</p>
                      <p>{med.dosage} • {med.route}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Scheduled Time</p>
                      <p className="flex items-center">
                        <Clock className="size-4 mr-1" />
                        {med.scheduledTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                      <p>{med.frequency}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Instructions</p>
                      <p className="text-sm">{med.instructions}</p>
                    </div>
                    
                    {med.allergies !== 'None known' && (
                      <div className="flex items-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <AlertCircle className="size-4 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-yellow-800">
                          Allergies: {med.allergies}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <span>Prescribed by: {med.prescribedBy}</span>
                      {med.lastAdministered && (
                        <span className="ml-4">Last administered: {med.lastAdministered}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {med.status === 'pending' || med.status === 'overdue' ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedMedication(med)}
                          >
                            <Syringe className="size-4 mr-1" />
                            Administer
                          </Button>
                          <Button size="sm" variant="outline">
                            <Shield className="size-4 mr-1" />
                            Hold
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <CheckCircle className="size-4 mr-1" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="administer">
          {selectedMedication ? (
            <Card>
              <CardHeader>
                <CardTitle>Administer Medication</CardTitle>
                <CardDescription>Confirm medication administration for {selectedMedication.patientName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Patient</p>
                    <p className="font-semibold">{selectedMedication.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Medication</p>
                    <p className="font-semibold">{selectedMedication.medication}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dosage</p>
                    <p>{selectedMedication.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Route</p>
                    <p>{selectedMedication.route}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Administration Notes</label>
                  <Textarea
                    placeholder="Enter any observations or notes about the administration..."
                    value={administrationNotes}
                    onChange={(e) => setAdministrationNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedMedication(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => administreMedication(selectedMedication.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="size-4 mr-1" />
                    Confirm Administration
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Pill className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Medication Selected</h3>
                <p className="text-muted-foreground">
                  Select a medication from the schedule to begin administration.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Administration History</CardTitle>
              <CardDescription>Record of completed medication administrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicationSchedule
                  .filter(med => med.status === 'administered')
                  .map(med => (
                    <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CheckCircle className="size-5 text-green-600" />
                        <div>
                          <h4 className="font-medium">{med.patientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {med.medication} • {med.dosage} • Administered at {med.lastAdministered}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{med.wardBed}</p>
                        <p className="text-xs text-muted-foreground">By: Current Nurse</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}