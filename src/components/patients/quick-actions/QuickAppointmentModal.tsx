'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Stethoscope, User } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

type Patient = {
  patientId: string;
  firstName: string;
  lastName: string;
  patientCode: string;
};

type QuickAppointmentModalProps = {
  patient: Patient;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type AppointmentData = {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: 'Consultation' | 'Follow-up' | 'Emergency' | 'Procedure' | 'Check-up';
  departmentId: string;
  notes?: string;
};

// Mock doctors data - in real app this would come from API
const mockDoctors = [
  { id: 'doc1', name: 'Dr. Sarah Wilson', department: 'Cardiology' },
  { id: 'doc2', name: 'Dr. Michael Chen', department: 'Emergency' },
  { id: 'doc3', name: 'Dr. Priya Sharma', department: 'Pediatrics' },
  { id: 'doc4', name: 'Dr. James Rodriguez', department: 'Surgery' },
];

// Mock departments data
const departments = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'emergency', name: 'Emergency' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'surgery', name: 'Surgery' },
  { id: 'general', name: 'General Medicine' },
];

async function createAppointment(data: AppointmentData): Promise<any> {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create appointment');
  }

  return response.json();
}

export function QuickAppointmentModal({
  patient,
  open,
  onClose,
  onSuccess,
}: QuickAppointmentModalProps) {
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'Consultation' as const,
    departmentId: '',
    notes: '',
  });

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast({
        title: 'Appointment Scheduled',
        description: `Appointment scheduled for ${patient.firstName} ${patient.lastName}`,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patient-appointments', patient.patientId] });

      onSuccess?.();
      onClose();
      setFormData({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: 'Consultation',
        departmentId: '',
        notes: '',
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
        description: 'Please sign in to schedule appointments',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    createAppointmentMutation.mutate({
      patientId: patient.patientId,
      doctorId: formData.doctorId,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      appointmentType: formData.appointmentType,
      departmentId: formData.departmentId,
      notes: formData.notes,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Schedule Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule a new appointment for
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="appointmentType">Appointment Type *</Label>
            <Select
              value={formData.appointmentType}
              onValueChange={value => handleInputChange('appointmentType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="size-4" />
                    Consultation
                  </div>
                </SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Check-up">Check-up</SelectItem>
                <SelectItem value="Procedure">Procedure</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="departmentId">Department *</Label>
            <Select
              value={formData.departmentId}
              onValueChange={value => handleInputChange('departmentId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctor */}
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

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Date *</Label>
              <Input
                id="appointmentDate"
                type="date"
                min={minDate}
                value={formData.appointmentDate}
                onChange={e => handleInputChange('appointmentDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Time *</Label>
              <Input
                id="appointmentTime"
                type="time"
                value={formData.appointmentTime}
                onChange={e => handleInputChange('appointmentTime', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes for the appointment..."
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAppointmentMutation.isPending}
              className="min-w-[120px]"
            >
              {createAppointmentMutation.isPending
                ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white" />
                      Scheduling...
                    </>
                  )
                : (
                    <>
                      <Clock className="mr-2 size-4" />
                      Schedule
                    </>
                  )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
