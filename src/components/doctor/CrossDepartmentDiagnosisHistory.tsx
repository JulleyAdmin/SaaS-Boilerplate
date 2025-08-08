'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  FileText,
  User,
  Building,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Pill,
  ChevronRight,
  AlertCircle,
  Clock
} from 'lucide-react';
import { format, subMonths, isWithinInterval } from 'date-fns';

interface DiagnosisRecord {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  department: string;
  doctorName: string;
  diagnosisDate: string;
  primaryDiagnosis: string;
  icdCode: string;
  secondaryDiagnosis?: string[];
  symptoms: string[];
  prescriptions?: string[];
  labTests?: string[];
  followUpRequired: boolean;
  nextFollowUp?: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  chronicCondition?: boolean;
}

const departmentIcons: Record<string, any> = {
  'Cardiology': Heart,
  'Neurology': Brain,
  'Orthopedics': Bone,
  'Pediatrics': Baby,
  'Ophthalmology': Eye,
  'General Medicine': Stethoscope,
  'Emergency': AlertCircle
};

const departmentColors: Record<string, string> = {
  'Cardiology': 'bg-red-100 text-red-800',
  'Neurology': 'bg-purple-100 text-purple-800',
  'Orthopedics': 'bg-blue-100 text-blue-800',
  'Pediatrics': 'bg-pink-100 text-pink-800',
  'Ophthalmology': 'bg-green-100 text-green-800',
  'General Medicine': 'bg-gray-100 text-gray-800',
  'Emergency': 'bg-orange-100 text-orange-800'
};

export default function CrossDepartmentDiagnosisHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [diagnosisRecords, setDiagnosisRecords] = useState<DiagnosisRecord[]>([]);

  // Mock data for last 6 months
  useEffect(() => {
    const mockRecords: DiagnosisRecord[] = [
      {
        id: 'D001',
        patientId: 'P001',
        patientName: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        department: 'Cardiology',
        doctorName: 'Dr. Sarah Wilson',
        diagnosisDate: subMonths(new Date(), 1).toISOString(),
        primaryDiagnosis: 'Hypertension Stage 2',
        icdCode: 'I11.9',
        secondaryDiagnosis: ['Type 2 Diabetes Mellitus'],
        symptoms: ['Headache', 'Dizziness', 'Chest discomfort'],
        prescriptions: ['Amlodipine 5mg', 'Metformin 500mg'],
        labTests: ['ECG', 'Lipid Profile', 'HbA1c'],
        followUpRequired: true,
        nextFollowUp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'moderate',
        chronicCondition: true
      },
      {
        id: 'D002',
        patientId: 'P002',
        patientName: 'Priya Singh',
        age: 32,
        gender: 'Female',
        department: 'Neurology',
        doctorName: 'Dr. Michael Brown',
        diagnosisDate: subMonths(new Date(), 2).toISOString(),
        primaryDiagnosis: 'Migraine with Aura',
        icdCode: 'G43.1',
        symptoms: ['Severe headache', 'Visual disturbances', 'Nausea'],
        prescriptions: ['Sumatriptan 50mg', 'Propranolol 40mg'],
        labTests: ['MRI Brain'],
        followUpRequired: true,
        nextFollowUp: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'moderate'
      },
      {
        id: 'D003',
        patientId: 'P003',
        patientName: 'Amit Sharma',
        age: 8,
        gender: 'Male',
        department: 'Pediatrics',
        doctorName: 'Dr. Emily Chen',
        diagnosisDate: subMonths(new Date(), 3).toISOString(),
        primaryDiagnosis: 'Acute Bronchitis',
        icdCode: 'J20.9',
        symptoms: ['Cough', 'Fever', 'Wheezing'],
        prescriptions: ['Amoxicillin 250mg', 'Paracetamol 250mg'],
        labTests: ['Chest X-ray', 'CBC'],
        followUpRequired: false,
        severity: 'mild'
      },
      {
        id: 'D004',
        patientId: 'P001',
        patientName: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        department: 'Orthopedics',
        doctorName: 'Dr. John Davis',
        diagnosisDate: subMonths(new Date(), 4).toISOString(),
        primaryDiagnosis: 'Lumbar Spondylosis',
        icdCode: 'M47.816',
        symptoms: ['Lower back pain', 'Stiffness', 'Radiating pain'],
        prescriptions: ['Diclofenac 50mg', 'Muscle relaxant'],
        labTests: ['X-ray Lumbar Spine', 'MRI L-S Spine'],
        followUpRequired: true,
        severity: 'moderate',
        chronicCondition: true
      },
      {
        id: 'D005',
        patientId: 'P004',
        patientName: 'Sunita Patel',
        age: 55,
        gender: 'Female',
        department: 'Ophthalmology',
        doctorName: 'Dr. Lisa Anderson',
        diagnosisDate: subMonths(new Date(), 2).toISOString(),
        primaryDiagnosis: 'Presbyopia with Cataract',
        icdCode: 'H52.4',
        secondaryDiagnosis: ['Early Cataract'],
        symptoms: ['Blurred vision', 'Difficulty reading', 'Glare sensitivity'],
        prescriptions: ['Eye drops', 'Reading glasses prescription'],
        labTests: ['Visual acuity test', 'Slit lamp examination'],
        followUpRequired: true,
        nextFollowUp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'mild'
      },
      {
        id: 'D006',
        patientId: 'P005',
        patientName: 'Mohammed Ali',
        age: 28,
        gender: 'Male',
        department: 'Emergency',
        doctorName: 'Dr. Robert Wilson',
        diagnosisDate: new Date().toISOString(),
        primaryDiagnosis: 'Acute Gastroenteritis',
        icdCode: 'A09',
        symptoms: ['Vomiting', 'Diarrhea', 'Dehydration', 'Abdominal pain'],
        prescriptions: ['ORS', 'Antiemetic', 'Probiotics'],
        labTests: ['Stool routine', 'Electrolytes'],
        followUpRequired: false,
        severity: 'moderate'
      },
      {
        id: 'D007',
        patientId: 'P001',
        patientName: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        department: 'General Medicine',
        doctorName: 'Dr. Amit Sharma',
        diagnosisDate: subMonths(new Date(), 5).toISOString(),
        primaryDiagnosis: 'Upper Respiratory Tract Infection',
        icdCode: 'J06.9',
        symptoms: ['Fever', 'Sore throat', 'Nasal congestion'],
        prescriptions: ['Paracetamol', 'Antihistamine'],
        followUpRequired: false,
        severity: 'mild'
      }
    ];

    setDiagnosisRecords(mockRecords);
  }, []);

  const getTimeRangeDate = () => {
    switch (selectedTimeRange) {
      case '1month': return subMonths(new Date(), 1);
      case '3months': return subMonths(new Date(), 3);
      case '6months': return subMonths(new Date(), 6);
      default: return subMonths(new Date(), 6);
    }
  };

  const filteredRecords = diagnosisRecords.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.icdCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    const matchesSeverity = selectedSeverity === 'all' || record.severity === selectedSeverity;
    
    const recordDate = new Date(record.diagnosisDate);
    const rangeStart = getTimeRangeDate();
    const matchesTimeRange = isWithinInterval(recordDate, { start: rangeStart, end: new Date() });

    return matchesSearch && matchesDepartment && matchesSeverity && matchesTimeRange;
  });

  const groupedByDepartment = filteredRecords.reduce((acc, record) => {
    if (!acc[record.department]) {
      acc[record.department] = [];
    }
    acc[record.department].push(record);
    return acc;
  }, {} as Record<string, DiagnosisRecord[]>);

  const getSeverityBadge = (severity: string) => {
    const colors = {
      mild: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      severe: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCommonDiagnoses = () => {
    const diagnosisCounts: Record<string, number> = {};
    filteredRecords.forEach(record => {
      diagnosisCounts[record.primaryDiagnosis] = (diagnosisCounts[record.primaryDiagnosis] || 0) + 1;
    });
    return Object.entries(diagnosisCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Cross-Department Diagnosis History
          </CardTitle>
          <CardDescription>
            Patient diagnosis records across all departments for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient, diagnosis, or ICD code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                <SelectItem value="General Medicine">General Medicine</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last 1 Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Diagnoses</p>
                <p className="text-2xl font-bold">{filteredRecords.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{Object.keys(groupedByDepartment).length}</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chronic Cases</p>
                <p className="text-2xl font-bold">
                  {filteredRecords.filter(r => r.chronicCondition).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Follow-ups Needed</p>
                <p className="text-2xl font-bold">
                  {filteredRecords.filter(r => r.followUpRequired).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Diagnoses */}
      {getCommonDiagnoses().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Common Diagnoses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getCommonDiagnoses().map(([diagnosis, count]) => (
                <Badge key={diagnosis} variant="secondary" className="text-sm">
                  {diagnosis} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagnosis Records by Department */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({filteredRecords.length})
          </TabsTrigger>
          <TabsTrigger value="chronic">
            Chronic ({filteredRecords.filter(r => r.chronicCondition).length})
          </TabsTrigger>
          <TabsTrigger value="followup">
            Follow-up ({filteredRecords.filter(r => r.followUpRequired).length})
          </TabsTrigger>
          <TabsTrigger value="recent">
            This Week ({filteredRecords.filter(r => {
              const date = new Date(r.diagnosisDate);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return date >= weekAgo;
            }).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {Object.entries(groupedByDepartment).map(([department, records]) => {
                const DeptIcon = departmentIcons[department] || Stethoscope;
                return (
                  <Card key={department}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <DeptIcon className="h-4 w-4" />
                        {department}
                        <Badge className={departmentColors[department] || 'bg-gray-100'}>
                          {records.length} records
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {records.map(record => (
                          <div key={record.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold">{record.patientName}</p>
                                  <span className="text-sm text-muted-foreground">
                                    ({record.age}Y/{record.gender[0]})
                                  </span>
                                  <Badge className={getSeverityBadge(record.severity)}>
                                    {record.severity}
                                  </Badge>
                                  {record.chronicCondition && (
                                    <Badge variant="outline" className="text-xs">
                                      Chronic
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    <strong>Diagnosis:</strong> {record.primaryDiagnosis} ({record.icdCode})
                                  </p>
                                  {record.secondaryDiagnosis && (
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Secondary:</strong> {record.secondaryDiagnosis.join(', ')}
                                    </p>
                                  )}
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Symptoms:</strong> {record.symptoms.join(', ')}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                    <span className="flex items-center gap-1">
                                      <Stethoscope className="h-3 w-3" />
                                      {record.doctorName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {format(new Date(record.diagnosisDate), 'dd MMM yyyy')}
                                    </span>
                                    {record.followUpRequired && record.nextFollowUp && (
                                      <span className="flex items-center gap-1 text-orange-600">
                                        <Clock className="h-3 w-3" />
                                        Follow-up: {format(new Date(record.nextFollowUp), 'dd MMM')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <Button size="sm" variant="ghost">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Lab Tests and Prescriptions */}
                            <div className="mt-3 flex gap-2 flex-wrap">
                              {record.labTests?.map(test => (
                                <Badge key={test} variant="outline" className="text-xs">
                                  {test}
                                </Badge>
                              ))}
                              {record.prescriptions?.slice(0, 2).map(med => (
                                <Badge key={med} variant="secondary" className="text-xs">
                                  <Pill className="h-3 w-3 mr-1" />
                                  {med}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chronic" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredRecords.filter(r => r.chronicCondition).map(record => {
                const DeptIcon = departmentIcons[record.department] || Stethoscope;
                return (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <DeptIcon className="h-4 w-4" />
                            <Badge className={departmentColors[record.department]}>
                              {record.department}
                            </Badge>
                            <p className="font-semibold">{record.patientName}</p>
                            <Badge className={getSeverityBadge(record.severity)}>
                              {record.severity}
                            </Badge>
                          </div>
                          <p className="text-sm">{record.primaryDiagnosis} ({record.icdCode})</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Since: {format(new Date(record.diagnosisDate), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="followup" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredRecords.filter(r => r.followUpRequired).map(record => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{record.patientName}</p>
                          <Badge className={departmentColors[record.department]}>
                            {record.department}
                          </Badge>
                        </div>
                        <p className="text-sm">{record.primaryDiagnosis}</p>
                        {record.nextFollowUp && (
                          <p className="text-sm text-orange-600 mt-1">
                            Follow-up: {format(new Date(record.nextFollowUp), 'dd MMM yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredRecords.filter(r => {
                const date = new Date(r.diagnosisDate);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date >= weekAgo;
              }).map(record => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{record.patientName}</p>
                          <Badge className={departmentColors[record.department]}>
                            {record.department}
                          </Badge>
                          <Badge className={getSeverityBadge(record.severity)}>
                            {record.severity}
                          </Badge>
                        </div>
                        <p className="text-sm">{record.primaryDiagnosis} ({record.icdCode})</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(record.diagnosisDate), 'dd MMM yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}