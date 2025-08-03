'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity, Stethoscope, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

type Patient = {
  patientId: string;
  firstName: string;
  lastName: string;
  patientCode: string;
};

type QuickConsultationModalProps = {
  patient: Patient;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type ConsultationData = {
  patientId: string;
  doctorId: string;
  consultationType: 'OPD' | 'IPD' | 'Emergency' | 'Telemedicine';
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  vitals?: {
    bp_systolic?: number;
    bp_diastolic?: number;
    pulse?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    spo2?: number;
  };
  generalExamination?: string;
  provisionalDiagnosis?: string[];
  treatmentPlan?: string;
  followUpInstructions?: string;
};

// Mock doctors data
const mockDoctors = [
  { id: 'doc1', name: 'Dr. Sarah Wilson', department: 'Cardiology' },
  { id: 'doc2', name: 'Dr. Michael Chen', department: 'Emergency' },
  { id: 'doc3', name: 'Dr. Priya Sharma', department: 'Pediatrics' },
  { id: 'doc4', name: 'Dr. James Rodriguez', department: 'Surgery' },
];

async function createConsultation(data: ConsultationData): Promise<any> {
  const response = await fetch('/api/consultations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create consultation');
  }

  return response.json();
}

export function QuickConsultationModal({
  patient,
  open,
  onClose,
  onSuccess,
}: QuickConsultationModalProps) {
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    doctorId: '',
    consultationType: 'OPD' as const,
    chiefComplaint: '',
    historyOfPresentIllness: '',
    // Vitals
    bp_systolic: '',
    bp_diastolic: '',
    pulse: '',
    temperature: '',
    weight: '',
    height: '',
    spo2: '',
    // Examination
    generalExamination: '',
    provisionalDiagnosis: '',
    treatmentPlan: '',
    followUpInstructions: '',
  });

  const createConsultationMutation = useMutation({
    mutationFn: createConsultation,
    onSuccess: () => {
      toast({
        title: 'Consultation Started',
        description: `Consultation started for ${patient.firstName} ${patient.lastName}`,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['patient-consultations', patient.patientId] });

      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        doctorId: '',
        consultationType: 'OPD',
        chiefComplaint: '',
        historyOfPresentIllness: '',
        bp_systolic: '',
        bp_diastolic: '',
        pulse: '',
        temperature: '',
        weight: '',
        height: '',
        spo2: '',
        generalExamination: '',
        provisionalDiagnosis: '',
        treatmentPlan: '',
        followUpInstructions: '',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to start consultations',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.doctorId || !formData.chiefComplaint.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in doctor and chief complaint',
        variant: 'destructive',
      });
      return;
    }

    // Prepare vitals data
    const vitals: any = {};
    if (formData.bp_systolic) {
      vitals.bp_systolic = Number(formData.bp_systolic);
    }
    if (formData.bp_diastolic) {
      vitals.bp_diastolic = Number(formData.bp_diastolic);
    }
    if (formData.pulse) {
      vitals.pulse = Number(formData.pulse);
    }
    if (formData.temperature) {
      vitals.temperature = Number(formData.temperature);
    }
    if (formData.weight) {
      vitals.weight = Number(formData.weight);
    }
    if (formData.height) {
      vitals.height = Number(formData.height);
    }
    if (formData.spo2) {
      vitals.spo2 = Number(formData.spo2);
    }

    const consultationData: ConsultationData = {
      patientId: patient.patientId,
      doctorId: formData.doctorId,
      consultationType: formData.consultationType,
      chiefComplaint: formData.chiefComplaint,
      historyOfPresentIllness: formData.historyOfPresentIllness || undefined,
      vitals: Object.keys(vitals).length > 0 ? vitals : undefined,
      generalExamination: formData.generalExamination || undefined,
      provisionalDiagnosis: formData.provisionalDiagnosis ? [formData.provisionalDiagnosis] : undefined,
      treatmentPlan: formData.treatmentPlan || undefined,
      followUpInstructions: formData.followUpInstructions || undefined,
    };

    createConsultationMutation.mutate(consultationData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="size-5" />
            Start Consultation
          </DialogTitle>
          <DialogDescription>
            Start a new consultation for
            {' '}
            <span className="font-medium">
              {patient.firstName}
              {' '}
              {patient.lastName}
            </span>
            {' '}
            (MRN:
            {' '}
            {patient.patientCode}
            )
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consultationType">Consultation Type *</Label>
              <Select
                value={formData.consultationType}
                onValueChange={value => handleInputChange('consultationType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPD">OPD</SelectItem>
                  <SelectItem value="IPD">IPD</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Telemedicine">Telemedicine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor *</Label>
              <Select
                value={formData.doctorId}
                onValueChange={value => handleInputChange('doctorId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doctor.department}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
            <Textarea
              id="chiefComplaint"
              placeholder="Patient's main concern or symptoms..."
              value={formData.chiefComplaint}
              onChange={e => handleInputChange('chiefComplaint', e.target.value)}
              rows={2}
              required
            />
          </div>

          {/* History */}
          <div className="space-y-2">
            <Label htmlFor="historyOfPresentIllness">History of Present Illness</Label>
            <Textarea
              id="historyOfPresentIllness"
              placeholder="Detailed history of the current complaint..."
              value={formData.historyOfPresentIllness}
              onChange={e => handleInputChange('historyOfPresentIllness', e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Vitals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="size-4" />
              <Label className="text-base font-medium">Vital Signs</Label>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="bp_systolic">BP Systolic</Label>
                <Input
                  id="bp_systolic"
                  type="number"
                  placeholder="120"
                  min="60"
                  max="250"
                  value={formData.bp_systolic}
                  onChange={e => handleInputChange('bp_systolic', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp_diastolic">BP Diastolic</Label>
                <Input
                  id="bp_diastolic"
                  type="number"
                  placeholder="80"
                  min="40"
                  max="150"
                  value={formData.bp_diastolic}
                  onChange={e => handleInputChange('bp_diastolic', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  placeholder="72"
                  min="40"
                  max="200"
                  value={formData.pulse}
                  onChange={e => handleInputChange('pulse', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  min="94"
                  max="108"
                  value={formData.temperature}
                  onChange={e => handleInputChange('temperature', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  min="0.5"
                  max="500"
                  value={formData.weight}
                  onChange={e => handleInputChange('weight', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  min="20"
                  max="300"
                  value={formData.height}
                  onChange={e => handleInputChange('height', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spo2">SpO2 (%)</Label>
                <Input
                  id="spo2"
                  type="number"
                  placeholder="98"
                  min="0"
                  max="100"
                  value={formData.spo2}
                  onChange={e => handleInputChange('spo2', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Examination */}
          <div className="space-y-2">
            <Label htmlFor="generalExamination">General Examination</Label>
            <Textarea
              id="generalExamination"
              placeholder="General examination findings..."
              value={formData.generalExamination}
              onChange={e => handleInputChange('generalExamination', e.target.value)}
              rows={2}
            />
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="provisionalDiagnosis">Provisional Diagnosis</Label>
            <Input
              id="provisionalDiagnosis"
              placeholder="Initial diagnosis..."
              value={formData.provisionalDiagnosis}
              onChange={e => handleInputChange('provisionalDiagnosis', e.target.value)}
            />
          </div>

          {/* Treatment Plan */}
          <div className="space-y-2">
            <Label htmlFor="treatmentPlan">Treatment Plan</Label>
            <Textarea
              id="treatmentPlan"
              placeholder="Treatment plan and medications..."
              value={formData.treatmentPlan}
              onChange={e => handleInputChange('treatmentPlan', e.target.value)}
              rows={3}
            />
          </div>

          {/* Follow-up */}
          <div className="space-y-2">
            <Label htmlFor="followUpInstructions">Follow-up Instructions</Label>
            <Textarea
              id="followUpInstructions"
              placeholder="Follow-up instructions for the patient..."
              value={formData.followUpInstructions}
              onChange={e => handleInputChange('followUpInstructions', e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createConsultationMutation.isPending}
              className="min-w-[140px]"
            >
              {createConsultationMutation.isPending
                ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white" />
                      Starting...
                    </>
                  )
                : (
                    <>
                      <Stethoscope className="mr-2 size-4" />
                      Start Consultation
                    </>
                  )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
