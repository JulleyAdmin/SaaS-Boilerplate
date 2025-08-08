'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Heart,
  Pill,
  TestTube,
  Stethoscope,
  Activity,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Download,
  Printer,
  Eye,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';

interface PatientHistoryProps {
  patientId: string;
}

interface Visit {
  id: string;
  date: string;
  type: 'Consultation' | 'Emergency' | 'Follow-up' | 'Routine';
  doctor: string;
  department: string;
  chiefComplaint: string;
  diagnosis: string;
  prescriptions: string[];
  labTests?: string[];
  vitals?: {
    bp: string;
    pulse: number;
    temp: number;
    weight: number;
  };
  notes?: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  registrationDate: string;
  lastVisit: string;
  totalVisits: number;
}

export default function PatientHistory({ patientId }: PatientHistoryProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  
  // Mock patient data - replace with API call
  const [patientInfo] = useState<PatientInfo>({
    id: patientId,
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    email: 'rajesh.kumar@example.com',
    address: '123, Main Street, Mumbai - 400001',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Dust'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: {
      name: 'Priya Kumar',
      relation: 'Spouse',
      phone: '9876543211'
    },
    registrationDate: '2020-01-15',
    lastVisit: '2024-07-25',
    totalVisits: 24
  });

  // Mock visit history - replace with API call
  const [visits] = useState<Visit[]>([
    {
      id: 'V001',
      date: '2024-07-25',
      type: 'Follow-up',
      doctor: 'Dr. Amit Sharma',
      department: 'General Medicine',
      chiefComplaint: 'Routine diabetes checkup',
      diagnosis: 'Type 2 Diabetes - Controlled',
      prescriptions: ['Metformin 500mg - 1-0-1', 'Glimepiride 2mg - 1-0-0'],
      labTests: ['HbA1c', 'Fasting Blood Sugar', 'Lipid Profile'],
      vitals: {
        bp: '130/85',
        pulse: 78,
        temp: 98.6,
        weight: 72
      },
      notes: 'Patient showing good glycemic control. Continue current medication.',
      status: 'Completed'
    },
    {
      id: 'V002',
      date: '2024-06-10',
      type: 'Consultation',
      doctor: 'Dr. Priya Patel',
      department: 'Cardiology',
      chiefComplaint: 'Chest discomfort during exercise',
      diagnosis: 'Mild Angina',
      prescriptions: ['Aspirin 75mg - 0-0-1', 'Atorvastatin 20mg - 0-0-1', 'Isosorbide Mononitrate 30mg - 1-0-0'],
      labTests: ['ECG', 'Troponin', 'Lipid Profile', 'Echo'],
      vitals: {
        bp: '140/90',
        pulse: 82,
        temp: 98.4,
        weight: 73
      },
      notes: 'Advised lifestyle modifications. Follow up after 1 month with stress test.',
      status: 'Completed'
    },
    {
      id: 'V003',
      date: '2024-04-15',
      type: 'Emergency',
      doctor: 'Dr. Rahul Singh',
      department: 'Emergency',
      chiefComplaint: 'Severe hypoglycemia',
      diagnosis: 'Hypoglycemic Episode',
      prescriptions: ['Glucose IV', 'Adjusted diabetes medication'],
      vitals: {
        bp: '110/70',
        pulse: 92,
        temp: 98.8,
        weight: 71
      },
      notes: 'Patient stabilized. Diabetes medication adjusted. Education provided.',
      status: 'Completed'
    },
    {
      id: 'V004',
      date: '2024-02-20',
      type: 'Routine',
      doctor: 'Dr. Amit Sharma',
      department: 'General Medicine',
      chiefComplaint: 'Annual health checkup',
      diagnosis: 'Stable chronic conditions',
      prescriptions: ['Continue existing medications'],
      labTests: ['Complete Blood Count', 'Kidney Function Test', 'Liver Function Test'],
      vitals: {
        bp: '135/85',
        pulse: 76,
        temp: 98.6,
        weight: 72
      },
      status: 'Completed'
    }
  ]);

  // Calculate health trends
  const getHealthTrend = (metric: string) => {
    // Mock trend calculation
    if (metric === 'bp') return 'improving';
    if (metric === 'weight') return 'stable';
    if (metric === 'glucose') return 'improving';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingDown className="h-4 w-4 text-green-500" />;
    if (trend === 'worsening') return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Cancelled': return 'outline';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency': return 'destructive';
      case 'Follow-up': return 'secondary';
      case 'Consultation': return 'default';
      case 'Routine': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Patient History</h1>
            <p className="text-muted-foreground">Complete medical history and records</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patientInfo.name}`} />
                <AvatarFallback>{patientInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{patientInfo.name}</h2>
                <p className="text-muted-foreground">
                  {patientInfo.age} years • {patientInfo.gender} • Blood Group: {patientInfo.bloodGroup}
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {patientInfo.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {patientInfo.email}
                  </span>
                </div>
                <div className="flex gap-4 pt-2">
                  <Badge variant="outline">
                    Patient ID: {patientInfo.id}
                  </Badge>
                  <Badge variant="secondary">
                    {patientInfo.totalVisits} Total Visits
                  </Badge>
                  <Badge>
                    Last Visit: {format(new Date(patientInfo.lastVisit), 'dd MMM yyyy')}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-semibold">{format(new Date(patientInfo.registrationDate), 'MMM yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Health Summary */}
          <Separator className="my-4" />
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Chronic Conditions</p>
              <div className="flex flex-wrap gap-1">
                {patientInfo.chronicConditions.map((condition, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Allergies</p>
              <div className="flex flex-wrap gap-1">
                {patientInfo.allergies.map((allergy, idx) => (
                  <Badge key={idx} variant="destructive" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Health Trends</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span>BP:</span>
                  {getTrendIcon(getHealthTrend('bp'))}
                  <span className="text-muted-foreground">Improving</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>Glucose:</span>
                  {getTrendIcon(getHealthTrend('glucose'))}
                  <span className="text-muted-foreground">Improving</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Emergency Contact</p>
              <p className="text-sm font-medium">{patientInfo.emergencyContact.name}</p>
              <p className="text-xs text-muted-foreground">
                {patientInfo.emergencyContact.relation} • {patientInfo.emergencyContact.phone}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Visit List */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visit History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2 p-4">
                      {visits.map((visit) => (
                        <Card
                          key={visit.id}
                          className={`cursor-pointer transition-colors ${
                            selectedVisit?.id === visit.id ? 'border-primary' : ''
                          }`}
                          onClick={() => setSelectedVisit(visit)}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant={getTypeColor(visit.type)} className="text-xs">
                                {visit.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(visit.date), 'dd MMM yyyy')}
                              </span>
                            </div>
                            <p className="font-medium text-sm mb-1">{visit.chiefComplaint}</p>
                            <p className="text-xs text-muted-foreground">{visit.doctor}</p>
                            <p className="text-xs text-muted-foreground">{visit.department}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Visit Details */}
            <div className="col-span-2">
              {selectedVisit ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Visit Details</CardTitle>
                        <CardDescription>
                          {format(new Date(selectedVisit.date), 'EEEE, dd MMMM yyyy')}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(selectedVisit.status)}>
                        {selectedVisit.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Doctor and Department */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Consulting Doctor</p>
                        <p className="font-medium">{selectedVisit.doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{selectedVisit.department}</p>
                      </div>
                    </div>

                    {/* Chief Complaint and Diagnosis */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Chief Complaint</p>
                      <p className="font-medium">{selectedVisit.chiefComplaint}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Diagnosis</p>
                      <p className="font-medium">{selectedVisit.diagnosis}</p>
                    </div>

                    {/* Vitals */}
                    {selectedVisit.vitals && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Vital Signs</p>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="bg-secondary/20 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Blood Pressure</p>
                            <p className="font-semibold">{selectedVisit.vitals.bp}</p>
                          </div>
                          <div className="bg-secondary/20 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Pulse</p>
                            <p className="font-semibold">{selectedVisit.vitals.pulse} bpm</p>
                          </div>
                          <div className="bg-secondary/20 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Temperature</p>
                            <p className="font-semibold">{selectedVisit.vitals.temp}°F</p>
                          </div>
                          <div className="bg-secondary/20 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Weight</p>
                            <p className="font-semibold">{selectedVisit.vitals.weight} kg</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Prescriptions */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Prescriptions</p>
                      <div className="space-y-1">
                        {selectedVisit.prescriptions.map((prescription, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Pill className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{prescription}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lab Tests */}
                    {selectedVisit.labTests && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Lab Tests Ordered</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedVisit.labTests.map((test, idx) => (
                            <Badge key={idx} variant="outline">
                              <TestTube className="h-3 w-3 mr-1" />
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clinical Notes */}
                    {selectedVisit.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Clinical Notes</p>
                        <p className="text-sm bg-secondary/20 rounded-lg p-3">
                          {selectedVisit.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-[600px] text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Select a visit to view details</p>
                    <p className="text-sm text-muted-foreground">
                      Click on any visit from the list to see complete information
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Prescription History</CardTitle>
              <CardDescription>All medications prescribed to the patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div key={visit.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{format(new Date(visit.date), 'dd MMM yyyy')}</p>
                        <p className="text-sm text-muted-foreground">
                          {visit.doctor} • {visit.department}
                        </p>
                      </div>
                      <Badge variant={getTypeColor(visit.type)}>{visit.type}</Badge>
                    </div>
                    <div className="space-y-1 mt-3">
                      {visit.prescriptions.map((prescription, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Pill className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{prescription}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-results" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Test Results</CardTitle>
              <CardDescription>Historical lab reports and test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visits
                  .filter(v => v.labTests)
                  .map((visit) => (
                    <div key={visit.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{format(new Date(visit.date), 'dd MMM yyyy')}</p>
                          <p className="text-sm text-muted-foreground">
                            Ordered by {visit.doctor}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Results
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {visit.labTests?.map((test, idx) => (
                          <Badge key={idx} variant="outline">
                            <TestTube className="h-3 w-3 mr-1" />
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Documents</CardTitle>
              <CardDescription>Reports, prescriptions, and other medical documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {['Prescription_July_2024.pdf', 'Lab_Report_June_2024.pdf', 'ECG_Report_June_2024.pdf', 
                  'Discharge_Summary_April_2024.pdf', 'Chest_Xray_March_2024.jpg', 'Insurance_Claim_Feb_2024.pdf'].map((doc, idx) => (
                  <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{doc}</p>
                            <p className="text-xs text-muted-foreground">2.4 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}