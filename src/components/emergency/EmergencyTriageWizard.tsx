'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertCircle,
  User,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Brain,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Stethoscope
} from 'lucide-react';

interface TriageData {
  // Patient Information
  patientName: string;
  age: string;
  gender: string;
  mobileNumber: string;
  emergencyContact: string;
  address: string;
  abhaNumber?: string;
  
  // Arrival Information
  arrivalMode: string;
  arrivalTime: string;
  accompaniedBy: string;
  
  // Chief Complaint
  chiefComplaint: string;
  symptomDuration: string;
  symptomSeverity: string;
  
  // Vital Signs
  bloodPressure: string;
  pulse: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  bloodGlucose?: string;
  painScale: string;
  
  // Mental Status
  consciousness: string;
  orientation: string;
  gcsScore?: string;
  
  // Triage Assessment
  triageLevel: string;
  clinicalImpression: string;
  immediateInterventions: string[];
  
  // Insurance/Payment
  paymentMethod: string;
  insuranceProvider?: string;
  governmentScheme?: string;
}

export default function EmergencyTriageWizard({ onComplete }: { onComplete: (data: TriageData) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [triageData, setTriageData] = useState<Partial<TriageData>>({
    arrivalTime: new Date().toLocaleString('en-IN'),
    immediateInterventions: []
  });

  const totalSteps = 6;

  const updateData = (field: keyof TriageData, value: any) => {
    setTriageData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTriageLevel = (data: Partial<TriageData>): string => {
    // Simple triage algorithm based on vital signs and symptoms
    const bp = data.bloodPressure?.split('/').map(Number) || [120, 80];
    const pulse = parseInt(data.pulse || '80');
    const spo2 = parseInt(data.oxygenSaturation || '98');
    const pain = parseInt(data.painScale || '0');
    
    if (
      bp[0] > 180 || bp[0] < 90 ||
      pulse > 120 || pulse < 50 ||
      spo2 < 90 ||
      data.consciousness === 'unconscious' ||
      pain >= 9
    ) {
      return 'critical';
    } else if (
      bp[0] > 160 || bp[0] < 100 ||
      pulse > 100 || pulse < 60 ||
      spo2 < 94 ||
      pain >= 7
    ) {
      return 'urgent';
    } else if (pain >= 4) {
      return 'standard';
    }
    return 'minor';
  };

  const handleComplete = () => {
    // Calculate triage level based on vital signs and symptoms
    const calculatedTriageLevel = calculateTriageLevel(triageData);
    const finalData = { ...triageData, triageLevel: calculatedTriageLevel } as TriageData;
    onComplete(finalData);
  };

  const getTriageBadge = (level: string) => {
    const colors = {
      critical: 'bg-red-600 text-white',
      urgent: 'bg-orange-500 text-white',
      standard: 'bg-yellow-500 text-white',
      minor: 'bg-green-500 text-white'
    };
    return <Badge className={colors[level as keyof typeof colors] || 'bg-gray-500'}>{level?.toUpperCase()}</Badge>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emergency Triage Assessment</CardTitle>
            <CardDescription>Quick patient assessment and prioritization workflow</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="mt-4" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Patient Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={triageData.patientName || ''}
                  onChange={(e) => updateData('patientName', e.target.value)}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={triageData.age || ''}
                    onChange={(e) => updateData('age', e.target.value)}
                    placeholder="Age"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={triageData.gender} onValueChange={(value) => updateData('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={triageData.mobileNumber || ''}
                  onChange={(e) => updateData('mobileNumber', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  type="tel"
                  value={triageData.emergencyContact || ''}
                  onChange={(e) => updateData('emergencyContact', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="abha">ABHA Number (Optional)</Label>
                <Input
                  id="abha"
                  value={triageData.abhaNumber || ''}
                  onChange={(e) => updateData('abhaNumber', e.target.value)}
                  placeholder="14-digit ABHA number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrivalMode">Mode of Arrival *</Label>
                <Select value={triageData.arrivalMode} onValueChange={(value) => updateData('arrivalMode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrival mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambulance">Ambulance (108/102)</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                    <SelectItem value="private-vehicle">Private Vehicle</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="referral">Hospital Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Chief Complaint */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Chief Complaint & History
            </h3>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Quick assessment - Focus on immediate medical needs
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="complaint">Chief Complaint *</Label>
                <Textarea
                  id="complaint"
                  value={triageData.chiefComplaint || ''}
                  onChange={(e) => updateData('chiefComplaint', e.target.value)}
                  placeholder="Describe primary symptoms and complaints..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Symptom Duration *</Label>
                  <Select value={triageData.symptomDuration} onValueChange={(value) => updateData('symptomDuration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1hr">Less than 1 hour</SelectItem>
                      <SelectItem value="1-6hrs">1-6 hours</SelectItem>
                      <SelectItem value="6-24hrs">6-24 hours</SelectItem>
                      <SelectItem value="1-3days">1-3 days</SelectItem>
                      <SelectItem value=">3days">More than 3 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="severity">Symptom Severity *</Label>
                  <Select value={triageData.symptomSeverity} onValueChange={(value) => updateData('symptomSeverity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                      <SelectItem value="life-threatening">Life Threatening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="painScale">Pain Scale (0-10) *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="painScale"
                    type="range"
                    min="0"
                    max="10"
                    value={triageData.painScale || '0'}
                    onChange={(e) => updateData('painScale', e.target.value)}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="min-w-[3rem] justify-center">
                    {triageData.painScale || '0'}/10
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>No Pain</span>
                  <span>Moderate</span>
                  <span>Severe Pain</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Vital Signs */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Vital Signs Assessment
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Blood Pressure (mmHg) *
                </Label>
                <Input
                  id="bp"
                  value={triageData.bloodPressure || ''}
                  onChange={(e) => updateData('bloodPressure', e.target.value)}
                  placeholder="120/80"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pulse" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Pulse Rate (bpm) *
                </Label>
                <Input
                  id="pulse"
                  type="number"
                  value={triageData.pulse || ''}
                  onChange={(e) => updateData('pulse', e.target.value)}
                  placeholder="72"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temp" className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Temperature (°F) *
                </Label>
                <Input
                  id="temp"
                  value={triageData.temperature || ''}
                  onChange={(e) => updateData('temperature', e.target.value)}
                  placeholder="98.6"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resp" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Respiratory Rate (/min) *
                </Label>
                <Input
                  id="resp"
                  type="number"
                  value={triageData.respiratoryRate || ''}
                  onChange={(e) => updateData('respiratoryRate', e.target.value)}
                  placeholder="16"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spo2" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  SpO2 (%) *
                </Label>
                <Input
                  id="spo2"
                  type="number"
                  value={triageData.oxygenSaturation || ''}
                  onChange={(e) => updateData('oxygenSaturation', e.target.value)}
                  placeholder="98"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="glucose" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Blood Glucose (mg/dL)
                </Label>
                <Input
                  id="glucose"
                  type="number"
                  value={triageData.bloodGlucose || ''}
                  onChange={(e) => updateData('bloodGlucose', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            
            {/* Vital Signs Alerts */}
            {triageData.oxygenSaturation && parseInt(triageData.oxygenSaturation) < 94 && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  Low oxygen saturation detected. Consider immediate oxygen supplementation.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 4: Mental Status */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Mental Status & Consciousness
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Level of Consciousness *</Label>
                <RadioGroup
                  value={triageData.consciousness}
                  onValueChange={(value) => updateData('consciousness', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alert" id="alert" />
                    <Label htmlFor="alert">Alert and Responsive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verbal" id="verbal" />
                    <Label htmlFor="verbal">Responds to Verbal Stimuli</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pain" id="pain" />
                    <Label htmlFor="pain">Responds to Pain</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unconscious" id="unconscious" />
                    <Label htmlFor="unconscious">Unconscious</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Orientation *</Label>
                <RadioGroup
                  value={triageData.orientation}
                  onValueChange={(value) => updateData('orientation', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oriented" id="oriented" />
                    <Label htmlFor="oriented">Oriented to Person, Place, Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confused" id="confused" />
                    <Label htmlFor="confused">Confused/Disoriented</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agitated" id="agitated" />
                    <Label htmlFor="agitated">Agitated/Combative</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gcs">Glasgow Coma Scale (3-15)</Label>
                <Input
                  id="gcs"
                  type="number"
                  min="3"
                  max="15"
                  value={triageData.gcsScore || ''}
                  onChange={(e) => updateData('gcsScore', e.target.value)}
                  placeholder="Optional - Enter GCS score"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Triage Decision */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Triage Assessment & Interventions
            </h3>
            
            <Alert className="border-blue-500 bg-blue-50">
              <Activity className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                Based on vital signs and symptoms, recommended triage level: {' '}
                {getTriageBadge(calculateTriageLevel(triageData))}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="impression">Clinical Impression</Label>
                <Textarea
                  id="impression"
                  value={triageData.clinicalImpression || ''}
                  onChange={(e) => updateData('clinicalImpression', e.target.value)}
                  placeholder="Brief clinical assessment and suspected conditions..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Immediate Interventions Required</Label>
                <div className="space-y-2">
                  {[
                    'IV Line Establishment',
                    'Oxygen Supplementation',
                    'Cardiac Monitoring',
                    'Pain Management',
                    'Fluid Resuscitation',
                    'Blood Sample Collection',
                    'ECG',
                    'X-Ray',
                    'CT Scan',
                    'Medication Administration'
                  ].map(intervention => (
                    <div key={intervention} className="flex items-center space-x-2">
                      <Checkbox
                        id={intervention}
                        checked={triageData.immediateInterventions?.includes(intervention)}
                        onCheckedChange={(checked) => {
                          const current = triageData.immediateInterventions || [];
                          if (checked) {
                            updateData('immediateInterventions', [...current, intervention]);
                          } else {
                            updateData('immediateInterventions', current.filter(i => i !== intervention));
                          }
                        }}
                      />
                      <Label htmlFor={intervention}>{intervention}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Payment & Documentation */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment & Insurance Information
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <RadioGroup
                  value={triageData.paymentMethod}
                  onValueChange={(value) => updateData('paymentMethod', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="insurance" id="insurance" />
                    <Label htmlFor="insurance">Health Insurance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="government" id="government" />
                    <Label htmlFor="government">Government Scheme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corporate" id="corporate" />
                    <Label htmlFor="corporate">Corporate/TPA</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {triageData.paymentMethod === 'insurance' && (
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={triageData.insuranceProvider || ''}
                    onChange={(e) => updateData('insuranceProvider', e.target.value)}
                    placeholder="Enter insurance company name"
                  />
                </div>
              )}
              
              {triageData.paymentMethod === 'government' && (
                <div className="space-y-2">
                  <Label htmlFor="scheme">Government Scheme</Label>
                  <Select 
                    value={triageData.governmentScheme} 
                    onValueChange={(value) => updateData('governmentScheme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pmjay">PM-JAY (Ayushman Bharat)</SelectItem>
                      <SelectItem value="cghs">CGHS</SelectItem>
                      <SelectItem value="esis">ESI Scheme</SelectItem>
                      <SelectItem value="state">State Health Scheme</SelectItem>
                      <SelectItem value="railway">Railway Health Scheme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Summary Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base">Triage Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Patient:</span>
                  <span className="font-medium">{triageData.patientName}, {triageData.age}y/{triageData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chief Complaint:</span>
                  <span className="font-medium">{triageData.chiefComplaint?.substring(0, 30)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Triage Level:</span>
                  {getTriageBadge(calculateTriageLevel(triageData))}
                </div>
                <div className="flex justify-between">
                  <span>Interventions:</span>
                  <span className="font-medium">{triageData.immediateInterventions?.length || 0} selected</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Triage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}