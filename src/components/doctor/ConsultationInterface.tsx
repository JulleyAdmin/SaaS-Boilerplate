'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LabRequisitionForm from './LabRequisitionForm';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  Droplet,
  FileText,
  Pill,
  TestTube,
  AlertCircle,
  Clock,
  Save,
  Send,
  Printer,
  CheckCircle,
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  Eye,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

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
  currentMedications: string[];
}

interface Vitals {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulseRate: number;
  temperature: number;
  weight: number;
  height: number;
  spo2: number;
  respiratoryRate: number;
  bmi?: number;
}

interface Diagnosis {
  id: string;
  icd10Code: string;
  description: string;
  type: 'provisional' | 'final' | 'differential';
  notes: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  durationUnit: string;
  timing: string;
  instructions: string;
}

interface LabTest {
  id: string;
  name: string;
  category: string;
  instructions: string;
  priority: 'routine' | 'urgent' | 'stat';
}

interface PreviousVisit {
  id: string;
  date: string;
  chiefComplaint: string;
  diagnosis: string;
  prescription: string[];
}

export default function ConsultationInterface() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const appointmentId = params?.id as string;

  // State management
  const [activeTab, setActiveTab] = useState('clinical');
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [vitals, setVitals] = useState<Vitals>({
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    pulseRate: 0,
    temperature: 0,
    weight: 0,
    height: 0,
    spo2: 0,
    respiratoryRate: 0
  });
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDays, setFollowUpDays] = useState('7');
  const [previousVisits, setPreviousVisits] = useState<PreviousVisit[]>([]);
  
  // Lab test documentation options
  const [includeTestsInPrescription, setIncludeTestsInPrescription] = useState(true);
  const [generateLabRequisition, setGenerateLabRequisition] = useState(true);
  const [sendTestsToPatient, setSendTestsToPatient] = useState(true);
  const [testInstructions, setTestInstructions] = useState('');
  const [estimatedTestCost, setEstimatedTestCost] = useState(0);
  
  // Dialog states
  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false);
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [showLabTestDialog, setShowLabTestDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  
  // Search states
  const [icd10Search, setIcd10Search] = useState('');
  const [medicationSearch, setMedicationSearch] = useState('');
  const [labTestSearch, setLabTestSearch] = useState('');
  
  // New entry states
  const [newDiagnosis, setNewDiagnosis] = useState<Partial<Diagnosis>>({
    type: 'provisional'
  });
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    frequency: 'TID',
    duration: '3',
    durationUnit: 'days',
    timing: 'after_food'
  });
  const [newLabTest, setNewLabTest] = useState<Partial<LabTest>>({
    priority: 'routine'
  });

  // Mock data - replace with API calls
  useEffect(() => {
    // Load patient info
    setPatientInfo({
      id: 'P001',
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '9876543210',
      email: 'rajesh@example.com',
      address: '123, Main Street, Mumbai',
      bloodGroup: 'O+',
      allergies: ['Penicillin', 'Dust'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      currentMedications: ['Metformin 500mg', 'Amlodipine 5mg']
    });

    // Load previous visits
    setPreviousVisits([
      {
        id: '1',
        date: '2024-01-15',
        chiefComplaint: 'Routine checkup',
        diagnosis: 'Hypertension - controlled',
        prescription: ['Amlodipine 5mg OD']
      },
      {
        id: '2',
        date: '2023-11-20',
        chiefComplaint: 'Fever and cold',
        diagnosis: 'Viral fever',
        prescription: ['Paracetamol 500mg TID', 'Cetirizine 10mg OD']
      }
    ]);
  }, [appointmentId]);

  // Calculate BMI when height and weight change
  useEffect(() => {
    if (vitals.height > 0 && vitals.weight > 0) {
      const heightInMeters = vitals.height / 100;
      const bmi = vitals.weight / (heightInMeters * heightInMeters);
      setVitals(prev => ({ ...prev, bmi: parseFloat(bmi.toFixed(2)) }));
    }
  }, [vitals.height, vitals.weight]);

  // Calculate estimated test cost when lab tests change
  useEffect(() => {
    // Mock pricing - in production, this would come from a pricing API
    const testPricing: { [key: string]: number } = {
      'cbc': 300,
      'blood-sugar': 150,
      'lipid-profile': 800,
      'liver-function': 600,
      'kidney-function': 600,
      'thyroid-profile': 900,
      'urine-routine': 200,
      'default': 500
    };
    
    const total = labTests.reduce((sum, test) => {
      const price = testPricing[test.id] || testPricing['default'];
      return sum + price;
    }, 0);
    
    setEstimatedTestCost(total);
  }, [labTests]);

  const saveVitals = () => {
    toast({
      title: "Vitals saved",
      description: "Patient vitals have been recorded successfully",
    });
  };

  const addDiagnosis = () => {
    if (newDiagnosis.description && newDiagnosis.icd10Code) {
      const diagnosis: Diagnosis = {
        id: Date.now().toString(),
        icd10Code: newDiagnosis.icd10Code || '',
        description: newDiagnosis.description || '',
        type: newDiagnosis.type as 'provisional' | 'final' | 'differential',
        notes: newDiagnosis.notes || ''
      };
      setDiagnoses([...diagnoses, diagnosis]);
      setNewDiagnosis({ type: 'provisional' });
      setIcd10Search('');
      setShowDiagnosisDialog(false);
      toast({
        title: "Diagnosis added",
        description: "Diagnosis has been added to the consultation",
      });
    }
  };

  const removeDiagnosis = (id: string) => {
    setDiagnoses(diagnoses.filter(d => d.id !== id));
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication: Medication = {
        id: Date.now().toString(),
        name: newMedication.name || '',
        dosage: newMedication.dosage || '',
        frequency: newMedication.frequency || 'TID',
        duration: newMedication.duration || '3',
        durationUnit: newMedication.durationUnit || 'days',
        timing: newMedication.timing || 'after_food',
        instructions: newMedication.instructions || ''
      };
      setMedications([...medications, medication]);
      setNewMedication({
        frequency: 'TID',
        duration: '3',
        durationUnit: 'days',
        timing: 'after_food'
      });
      setMedicationSearch('');
      setShowMedicationDialog(false);
      toast({
        title: "Medication added",
        description: "Medication has been added to the prescription",
      });
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const orderLabTests = () => {
    if (labTests.length > 0) {
      toast({
        title: "Lab tests ordered",
        description: `${labTests.length} tests have been ordered`,
      });
      setShowLabTestDialog(false);
    }
  };

  const completeConsultation = () => {
    setShowCompleteDialog(false);
    toast({
      title: "Consultation completed",
      description: "Consultation summary has been saved",
    });
    
    // Navigate back to dashboard
    setTimeout(() => {
      router.push('/dashboard/doctor');
    }, 2000);
  };

  const handleSendToPatient = () => {
    // Mock function to send documents to patient
    toast({
      title: "Documents sent",
      description: "Prescription and lab requisition sent to patient via WhatsApp/SMS",
    });
  };

  const handleDownloadPDF = () => {
    // Mock function to download as PDF
    // In production, this would generate and download a PDF
    toast({
      title: "Downloading PDF",
      description: "Generating PDF document...",
    });
  };

  const handlePrint = () => {
    // Print the current tab content
    window.print();
  };

  const getFrequencyDisplay = (frequency: string) => {
    const freqMap: { [key: string]: string } = {
      'OD': 'Once daily',
      'BD': 'Twice daily',
      'TID': 'Three times daily',
      'QID': 'Four times daily',
      'SOS': 'As needed',
      'STAT': 'Immediately'
    };
    return freqMap[frequency] || frequency;
  };

  const getTimingDisplay = (timing: string) => {
    const timingMap: { [key: string]: string } = {
      'before_food': 'Before food',
      'after_food': 'After food',
      'with_food': 'With food',
      'empty_stomach': 'Empty stomach',
      'bedtime': 'At bedtime'
    };
    return timingMap[timing] || timing;
  };

  if (!patientInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/doctor')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Consultation</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreviewDialog(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={() => setShowCompleteDialog(true)}
            data-testid="complete-consultation-btn"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Consultation
          </Button>
        </div>
      </div>

      {/* Patient Info Bar */}
      <Card data-testid="patient-info-section">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-lg font-semibold">{patientInfo.name}</p>
                <p className="text-sm text-gray-600">
                  {patientInfo.age} years, {patientInfo.gender} • {patientInfo.bloodGroup}
                </p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{patientInfo.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{patientInfo.email}</span>
                </div>
              </div>
            </div>
            
            {patientInfo.allergies.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">
                  Allergies: {patientInfo.allergies.join(', ')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Consultation Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="clinical">Clinical</TabsTrigger>
          <TabsTrigger value="history" data-testid="medical-history-tab">Medical History</TabsTrigger>
          <TabsTrigger value="prescription" data-testid="prescription-tab">Prescription</TabsTrigger>
          <TabsTrigger value="investigations" data-testid="investigations-tab">Investigations</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Clinical Tab */}
        <TabsContent value="clinical" className="space-y-4">
          {/* Vitals Section */}
          <Card data-testid="vitals-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Blood Pressure (mmHg)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Systolic"
                      value={vitals.bloodPressureSystolic || ''}
                      onChange={(e) => setVitals({...vitals, bloodPressureSystolic: parseInt(e.target.value)})}
                      data-testid="blood-pressure-systolic"
                    />
                    <span className="self-center">/</span>
                    <Input
                      type="number"
                      placeholder="Diastolic"
                      value={vitals.bloodPressureDiastolic || ''}
                      onChange={(e) => setVitals({...vitals, bloodPressureDiastolic: parseInt(e.target.value)})}
                      data-testid="blood-pressure-diastolic"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Pulse Rate (bpm)</Label>
                  <Input
                    type="number"
                    value={vitals.pulseRate || ''}
                    onChange={(e) => setVitals({...vitals, pulseRate: parseInt(e.target.value)})}
                    data-testid="pulse-rate"
                  />
                </div>
                
                <div>
                  <Label>Temperature (°F)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={vitals.temperature || ''}
                    onChange={(e) => setVitals({...vitals, temperature: parseFloat(e.target.value)})}
                    data-testid="temperature"
                  />
                </div>
                
                <div>
                  <Label>SpO2 (%)</Label>
                  <Input
                    type="number"
                    value={vitals.spo2 || ''}
                    onChange={(e) => setVitals({...vitals, spo2: parseInt(e.target.value)})}
                    data-testid="spo2"
                  />
                </div>
                
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={vitals.weight || ''}
                    onChange={(e) => setVitals({...vitals, weight: parseFloat(e.target.value)})}
                    data-testid="weight"
                  />
                </div>
                
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={vitals.height || ''}
                    onChange={(e) => setVitals({...vitals, height: parseFloat(e.target.value)})}
                    data-testid="height"
                  />
                </div>
                
                <div>
                  <Label>BMI</Label>
                  <Input
                    value={vitals.bmi || 'N/A'}
                    disabled
                    data-testid="bmi-value"
                  />
                </div>
                
                <div>
                  <Label>Respiratory Rate (bpm)</Label>
                  <Input
                    type="number"
                    value={vitals.respiratoryRate || ''}
                    onChange={(e) => setVitals({...vitals, respiratoryRate: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4" 
                onClick={saveVitals}
                data-testid="save-vitals-btn"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Vitals
              </Button>
            </CardContent>
          </Card>

          {/* Clinical Notes Section */}
          <Card data-testid="clinical-notes-section">
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chief Complaint</Label>
                <Textarea
                  placeholder="Enter the main reason for visit"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  data-testid="chief-complaint"
                />
              </div>
              
              <div>
                <Label>Symptoms</Label>
                <Textarea
                  placeholder="List all symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  data-testid="symptoms"
                />
              </div>
              
              <div>
                <Label>Clinical Examination Notes</Label>
                <Textarea
                  placeholder="Enter examination findings"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={4}
                  data-testid="clinical-notes"
                />
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis Section */}
          <Card data-testid="diagnosis-section">
            <CardHeader>
              <CardTitle>Diagnosis</CardTitle>
              <CardDescription>Add diagnosis with ICD-10 codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowDiagnosisDialog(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Diagnosis
                </Button>
                
                {diagnoses.length > 0 && (
                  <div className="space-y-2" data-testid="diagnosis-list">
                    {diagnoses.map((diagnosis) => (
                      <div key={diagnosis.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{diagnosis.description}</p>
                          <p className="text-sm text-gray-600">
                            ICD-10: {diagnosis.icd10Code} • {diagnosis.type}
                          </p>
                          {diagnosis.notes && (
                            <p className="text-sm mt-1">{diagnosis.notes}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeDiagnosis(diagnosis.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card data-testid="previous-visits">
            <CardHeader>
              <CardTitle>Previous Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {previousVisits.map((visit) => (
                  <div key={visit.id} className="mb-4 p-3 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{format(new Date(visit.date), 'dd MMM yyyy')}</p>
                        <p className="text-sm text-gray-600">Complaint: {visit.chiefComplaint}</p>
                        <p className="text-sm">Diagnosis: {visit.diagnosis}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card data-testid="chronic-conditions">
              <CardHeader>
                <CardTitle>Chronic Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {patientInfo.chronicConditions.map((condition, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="allergies">
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {patientInfo.allergies.map((allergy, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>{allergy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="current-medications">
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {patientInfo.currentMedications.map((medication, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-blue-500" />
                    <span>{medication}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="lab-reports">
            <CardHeader>
              <CardTitle>Recent Lab Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">No recent lab reports available</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescription Tab */}
        <TabsContent value="prescription" className="space-y-4" data-testid="prescription-section">
          <Card>
            <CardHeader>
              <CardTitle>Prescription</CardTitle>
              <CardDescription>Add medications to the prescription</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowMedicationDialog(true)}
                variant="outline"
                data-testid="add-medication-btn"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
              
              {medications.length > 0 && (
                <div className="mt-4 space-y-2" data-testid="prescription-items">
                  {medications.map((medication) => (
                    <div key={medication.id} className="p-3 border rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{medication.name}</p>
                          <p className="text-sm text-gray-600">
                            {medication.dosage} • {getFrequencyDisplay(medication.frequency)} • 
                            {' '}{medication.duration} {medication.durationUnit}
                          </p>
                          <p className="text-sm">
                            {getTimingDisplay(medication.timing)}
                            {medication.instructions && ` • ${medication.instructions}`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMedication(medication.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <Label>General Advice</Label>
                  <Textarea
                    placeholder="Enter general advice for the patient"
                    value={generalAdvice}
                    onChange={(e) => setGeneralAdvice(e.target.value)}
                    data-testid="general-advice"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={followUpRequired}
                    onCheckedChange={(checked) => setFollowUpRequired(checked as boolean)}
                    data-testid="follow-up-required"
                  />
                  <Label>Follow-up Required</Label>
                  
                  {followUpRequired && (
                    <Select value={followUpDays} onValueChange={setFollowUpDays}>
                      <SelectTrigger className="w-32" data-testid="follow-up-days">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">After 3 days</SelectItem>
                        <SelectItem value="7">After 7 days</SelectItem>
                        <SelectItem value="15">After 15 days</SelectItem>
                        <SelectItem value="30">After 1 month</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline"
                  data-testid="preview-prescription-btn"
                  onClick={() => setShowPreviewDialog(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investigations Tab */}
        <TabsContent value="investigations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Tests</CardTitle>
              <CardDescription>Order lab tests and investigations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for lab tests..."
                    value={labTestSearch}
                    onChange={(e) => setLabTestSearch(e.target.value)}
                    data-testid="lab-test-search"
                  />
                  <Button onClick={() => setShowLabTestDialog(true)}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Quick Test Selection */}
                <div className="space-y-2" data-testid="lab-test-suggestions">
                  <Label>Common Tests</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="cbc"
                        checked={labTests.some(t => t.id === 'cbc')}
                        data-testid="test-checkbox-cbc"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLabTests([...labTests, {
                              id: 'cbc',
                              name: 'Complete Blood Count (CBC)',
                              category: 'Hematology',
                              instructions: '',
                              priority: 'routine'
                            }]);
                          } else {
                            setLabTests(labTests.filter(t => t.id !== 'cbc'));
                          }
                        }}
                      />
                      <Label htmlFor="cbc">CBC (₹300)</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="blood-sugar"
                        checked={labTests.some(t => t.id === 'blood-sugar')}
                        data-testid="test-checkbox-blood-sugar"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLabTests([...labTests, {
                              id: 'blood-sugar',
                              name: 'Blood Sugar (Fasting)',
                              category: 'Biochemistry',
                              instructions: 'Fasting required',
                              priority: 'routine'
                            }]);
                          } else {
                            setLabTests(labTests.filter(t => t.id !== 'blood-sugar'));
                          }
                        }}
                      />
                      <Label htmlFor="blood-sugar">Blood Sugar (₹150)</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="lipid-profile"
                        checked={labTests.some(t => t.id === 'lipid-profile')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLabTests([...labTests, {
                              id: 'lipid-profile',
                              name: 'Lipid Profile',
                              category: 'Biochemistry',
                              instructions: '12 hours fasting',
                              priority: 'routine'
                            }]);
                          } else {
                            setLabTests(labTests.filter(t => t.id !== 'lipid-profile'));
                          }
                        }}
                      />
                      <Label htmlFor="lipid-profile">Lipid Profile (₹800)</Label>
                    </div>
                  </div>
                </div>

                {labTests.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Tests</Label>
                    {labTests.map((test) => (
                      <div key={test.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-gray-600">
                            {test.category} • {test.priority}
                            {test.instructions && ` • ${test.instructions}`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setLabTests(labTests.filter(t => t.id !== test.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cost Transparency */}
                {labTests.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Estimated Test Cost</p>
                        <p className="text-lg font-bold text-blue-900">₹{estimatedTestCost}</p>
                        <p className="text-sm text-blue-700">
                          {labTests.length} test{labTests.length > 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Label>Priority</Label>
                  <Select 
                    defaultValue="routine"
                    data-testid="lab-priority"
                    onValueChange={(value) => {
                      setLabTests(labTests.map(t => ({ ...t, priority: value as 'routine' | 'urgent' | 'stat' })));
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Patient Preparation Instructions</Label>
                  <Textarea
                    placeholder="e.g., Fasting for 12 hours required, Morning sample preferred"
                    value={testInstructions}
                    onChange={(e) => setTestInstructions(e.target.value)}
                    data-testid="lab-instructions"
                  />
                </div>

                <Button 
                  onClick={orderLabTests}
                  disabled={labTests.length === 0}
                  data-testid="order-tests-btn"
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Order Tests ({labTests.length}) - Total: ₹{estimatedTestCost}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Documentation Options */}
          <Card>
            <CardHeader>
              <CardTitle>Test Documentation Options</CardTitle>
              <CardDescription>Choose how test information is shared</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="send-to-lab"
                    checked={true}
                    disabled
                  />
                  <div className="flex-1">
                    <Label htmlFor="send-to-lab" className="font-medium">
                      Send directly to laboratory
                    </Label>
                    <p className="text-sm text-gray-600">
                      Electronic order sent to lab queue (Always enabled)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="include-in-prescription"
                    checked={includeTestsInPrescription}
                    onCheckedChange={(checked) => setIncludeTestsInPrescription(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="include-in-prescription" className="font-medium">
                      Include in prescription document
                    </Label>
                    <p className="text-sm text-gray-600">
                      Add test list to the prescription for patient records
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="generate-requisition"
                    checked={generateLabRequisition}
                    onCheckedChange={(checked) => setGenerateLabRequisition(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="generate-requisition" className="font-medium">
                      Generate lab requisition form
                    </Label>
                    <p className="text-sm text-gray-600">
                      Create separate document with barcode for lab
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="send-to-patient"
                    checked={sendTestsToPatient}
                    onCheckedChange={(checked) => setSendTestsToPatient(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="send-to-patient" className="font-medium">
                      Send copy to patient
                    </Label>
                    <p className="text-sm text-gray-600">
                      Share test details via WhatsApp/SMS for patient reference
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4" data-testid="consultation-summary">
          <Card data-testid="summary-vitals">
            <CardHeader>
              <CardTitle>Consultation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Vital Signs</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <p>BP: {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic} mmHg</p>
                  <p>Pulse: {vitals.pulseRate} bpm</p>
                  <p>Temp: {vitals.temperature}°F</p>
                  <p>SpO2: {vitals.spo2}%</p>
                  <p>Weight: {vitals.weight} kg</p>
                  <p>BMI: {vitals.bmi}</p>
                </div>
              </div>

              <Separator />

              <div data-testid="summary-diagnosis">
                <h3 className="font-semibold mb-2">Diagnosis</h3>
                {diagnoses.length > 0 ? (
                  <ul className="space-y-1">
                    {diagnoses.map(d => (
                      <li key={d.id} className="text-sm">
                        • {d.description} ({d.icd10Code})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No diagnosis added</p>
                )}
              </div>

              <Separator />

              <div data-testid="summary-prescription">
                <h3 className="font-semibold mb-2">Prescription</h3>
                {medications.length > 0 ? (
                  <ul className="space-y-1">
                    {medications.map(m => (
                      <li key={m.id} className="text-sm">
                        • {m.name} {m.dosage} - {getFrequencyDisplay(m.frequency)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No medications prescribed</p>
                )}
              </div>

              <Separator />

              <div data-testid="summary-next-steps">
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <ul className="space-y-1 text-sm">
                  {labTests.length > 0 && (
                    <li>• Lab tests ordered: {labTests.length}</li>
                  )}
                  {followUpRequired && (
                    <li>• Follow-up after {followUpDays} days</li>
                  )}
                  {generalAdvice && (
                    <li>• {generalAdvice}</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full"
            onClick={() => router.push('/dashboard/doctor')}
            data-testid="back-to-dashboard-btn"
          >
            Back to Dashboard
          </Button>
        </TabsContent>
      </Tabs>

      {/* Diagnosis Dialog */}
      <Dialog open={showDiagnosisDialog} onOpenChange={setShowDiagnosisDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Diagnosis</DialogTitle>
            <DialogDescription>Search and add diagnosis with ICD-10 codes</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Search ICD-10</Label>
              <Input
                placeholder="Search diagnosis or ICD-10 code"
                value={icd10Search}
                onChange={(e) => setIcd10Search(e.target.value)}
                data-testid="icd10-search"
              />
              {icd10Search && (
                <div className="mt-2 border rounded p-2 max-h-32 overflow-y-auto" data-testid="icd10-suggestions">
                  <div 
                    className="p-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNewDiagnosis({
                        ...newDiagnosis,
                        icd10Code: 'R50.9',
                        description: 'Fever, unspecified'
                      });
                      setIcd10Search('Fever, unspecified');
                    }}
                    data-testid="icd10-option"
                  >
                    R50.9 - Fever, unspecified
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <Label>Diagnosis Type</Label>
              <Select 
                value={newDiagnosis.type}
                onValueChange={(value) => setNewDiagnosis({...newDiagnosis, type: value as 'provisional' | 'final' | 'differential'})}
                data-testid="diagnosis-type"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="provisional">Provisional</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="differential">Differential</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes about the diagnosis"
                value={newDiagnosis.notes || ''}
                onChange={(e) => setNewDiagnosis({...newDiagnosis, notes: e.target.value})}
                data-testid="diagnosis-notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiagnosisDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addDiagnosis} data-testid="save-diagnosis-btn">
              Add Diagnosis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medication Dialog */}
      <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>Add medication to the prescription</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Search Medication</Label>
              <Input
                placeholder="Search medication name"
                value={medicationSearch}
                onChange={(e) => setMedicationSearch(e.target.value)}
                data-testid="medication-search"
              />
              {medicationSearch && (
                <div className="mt-2 border rounded p-2 max-h-32 overflow-y-auto" data-testid="medication-suggestions">
                  <div 
                    className="p-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNewMedication({...newMedication, name: 'Paracetamol'});
                      setMedicationSearch('Paracetamol');
                    }}
                    data-testid="medication-option"
                  >
                    Paracetamol (Acetaminophen)
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <Label>Dosage</Label>
              <Input
                placeholder="e.g., 500mg"
                value={newMedication.dosage || ''}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                data-testid="dosage"
              />
            </div>
            
            <div>
              <Label>Frequency</Label>
              <Select 
                value={newMedication.frequency}
                onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
                data-testid="frequency"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OD">Once daily</SelectItem>
                  <SelectItem value="BD">Twice daily</SelectItem>
                  <SelectItem value="TID">Three times daily</SelectItem>
                  <SelectItem value="QID">Four times daily</SelectItem>
                  <SelectItem value="SOS">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Duration</Label>
                <Input
                  type="number"
                  value={newMedication.duration || ''}
                  onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                  data-testid="duration"
                />
              </div>
              <div className="flex-1">
                <Label>Unit</Label>
                <Select 
                  value={newMedication.durationUnit}
                  onValueChange={(value) => setNewMedication({...newMedication, durationUnit: value})}
                  data-testid="duration-unit"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Timing</Label>
              <Select 
                value={newMedication.timing}
                onValueChange={(value) => setNewMedication({...newMedication, timing: value})}
                data-testid="timing"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before_food">Before food</SelectItem>
                  <SelectItem value="after_food">After food</SelectItem>
                  <SelectItem value="with_food">With food</SelectItem>
                  <SelectItem value="empty_stomach">Empty stomach</SelectItem>
                  <SelectItem value="bedtime">At bedtime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Instructions</Label>
              <Textarea
                placeholder="Special instructions"
                value={newMedication.instructions || ''}
                onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                data-testid="medication-instructions"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMedicationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addMedication} data-testid="save-medication-btn">
              Add Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prescription Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]" data-testid="prescription-preview-modal">
          <DialogHeader>
            <DialogTitle>Consultation Documents</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="prescription" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prescription">Prescription</TabsTrigger>
              <TabsTrigger value="lab-requisition" disabled={!generateLabRequisition || labTests.length === 0}>
                Lab Requisition
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="prescription" className="mt-4">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 p-6 bg-white">
            {/* Hospital Header */}
            <div className="text-center border-b pb-4" data-testid="preview-hospital-header">
              <h2 className="text-xl font-bold">City General Hospital</h2>
              <p className="text-sm">123 Main Street, Mumbai • Tel: 022-12345678</p>
            </div>
            
            {/* Doctor Info */}
            <div className="text-center" data-testid="preview-doctor-info">
              <p className="font-semibold">Dr. Amit Sharma, MBBS, MD</p>
              <p className="text-sm">Reg No: MH12345 • General Medicine</p>
            </div>
            
            {/* Patient Info */}
            <div className="border-b pb-2" data-testid="preview-patient-info">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Patient:</strong> {patientInfo.name}</p>
                <p><strong>Age/Gender:</strong> {patientInfo.age} years / {patientInfo.gender}</p>
                <p><strong>Date:</strong> {format(new Date(), 'dd MMM yyyy')}</p>
                <p><strong>Phone:</strong> {patientInfo.phone}</p>
              </div>
            </div>
            
            {/* Medications */}
            <div data-testid="preview-medications">
              <h3 className="font-semibold mb-2">℞</h3>
              {medications.map((med, index) => (
                <div key={med.id} className="mb-3">
                  <p>{index + 1}. {med.name}</p>
                  <p className="ml-4 text-sm">
                    {med.dosage} - {getFrequencyDisplay(med.frequency)} × {med.duration} {med.durationUnit}
                  </p>
                  <p className="ml-4 text-sm italic">
                    {getTimingDisplay(med.timing)}
                    {med.instructions && ` - ${med.instructions}`}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Lab Tests */}
            {includeTestsInPrescription && labTests.length > 0 && (
              <div className="border-t pt-3">
                <h3 className="font-semibold mb-2">Laboratory Tests Advised:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {labTests.map((test, index) => (
                    <li key={test.id} className="text-sm">
                      {test.name}
                      {test.instructions && (
                        <span className="text-gray-600 ml-2">
                          ({test.instructions})
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
                {testInstructions && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-medium">Patient Instructions:</p>
                    <p className="text-sm">{testInstructions}</p>
                  </div>
                )}
                <p className="text-sm mt-2 text-gray-600">
                  Estimated Cost: ₹{estimatedTestCost}
                </p>
              </div>
            )}
            
            {/* Advice */}
            {generalAdvice && (
              <div data-testid="preview-advice">
                <h3 className="font-semibold mb-2">Advice:</h3>
                <p className="text-sm">{generalAdvice}</p>
              </div>
            )}
            
            {/* Follow-up */}
            {followUpRequired && (
              <div>
                <p className="text-sm">
                  <strong>Follow-up:</strong> After {followUpDays} days
                </p>
              </div>
            )}
            
            {/* Signature */}
            <div className="text-right pt-8">
              <p className="text-sm">Doctor's Signature</p>
            </div>
          </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="lab-requisition" className="mt-4">
              <ScrollArea className="h-[60vh]">
                {generateLabRequisition && labTests.length > 0 && (
                  <LabRequisitionForm
                    patient={{
                      id: patientInfo.id,
                      name: patientInfo.name,
                      age: patientInfo.age,
                      gender: patientInfo.gender,
                      phone: patientInfo.phone,
                      email: patientInfo.email,
                      bloodGroup: patientInfo.bloodGroup
                    }}
                    doctor={{
                      id: 'DR001',
                      name: 'Amit Sharma',
                      regNumber: 'MH12345',
                      department: 'General Medicine'
                    }}
                    tests={labTests.map(test => ({
                      ...test,
                      category: test.category || 'General',
                      instructions: test.instructions || testInstructions
                    }))}
                    instructions={testInstructions}
                    consultationId={params.id as string || 'CONS-001'}
                    clinicalNotes={clinicalNotes}
                    provisionalDiagnosis={diagnoses.find(d => d.type === 'provisional')?.name}
                  />
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => sendTestsToPatient && handleSendToPatient()}
                disabled={!sendTestsToPatient}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Patient
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrint} data-testid="print-prescription-btn">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Consultation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Consultation?</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this consultation? This will save all the information and mark the appointment as completed.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={completeConsultation} data-testid="confirm-complete-btn">
              Complete Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}