'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Stethoscope, UserCheck } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type PatientTimelineProps = {
  patientId: string;
};

type TimelineEvent = {
  id: string;
  type: 'consultation' | 'appointment';
  date: string;
  title: string;
  description: string;
  status?: string;
  doctor?: string;
  department?: string;
  diagnosis?: string;
  notes?: string;
};

type Consultation = {
  consultation: {
    consultationId: string;
    patientId: string;
    consultationDate: string;
    chiefComplaint?: string;
    treatmentPlan?: string;
    provisionalDiagnosis?: string[];
    finalDiagnosis?: string[];
    followUpDate?: string;
    notes?: string;
  };
  patient?: {
    patientId: string;
    patientCode: string;
    name: string;
    phoneNumber: string;
  };
  doctor?: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
};

type Appointment = {
  appointment: {
    appointmentId: string;
    patientId: string;
    appointmentDate: string;
    appointmentTime?: string;
    appointmentType?: string;
    status?: string;
    appointmentNotes?: string;
  };
  patient?: {
    patientId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  doctor?: {
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
  };
};

// API functions
async function fetchPatientConsultations(patientId: string): Promise<Consultation[]> {
  const searchParams = new URLSearchParams({
    patientId,
    pageSize: '50', // Get more records for timeline
    sortBy: 'consultationDate',
    sortOrder: 'desc',
  });

  const response = await fetch(`/api/consultations?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch consultations');
  }

  const data = await response.json();
  return data.data || [];
}

async function fetchPatientAppointments(patientId: string): Promise<Appointment[]> {
  const searchParams = new URLSearchParams({
    patientId,
    pageSize: '50', // Get more records for timeline
  });

  const response = await fetch(`/api/appointments?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch appointments');
  }

  const data = await response.json();
  return data.data || [];
}

// Utility function to merge and sort timeline events
function mergeTimelineEvents(consultations: Consultation[] = [], appointments: Appointment[] = []): TimelineEvent[] {
  const consultationEvents: TimelineEvent[] = consultations.map((item) => {
    const consultation = item.consultation;
    const doctor = item.doctor;

    // Format diagnosis from arrays
    const diagnosis = consultation.finalDiagnosis?.length
      ? consultation.finalDiagnosis.join(', ')
      : consultation.provisionalDiagnosis?.length
        ? consultation.provisionalDiagnosis.join(', ')
        : undefined;

    const doctorName = doctor ? doctor.name : undefined;

    return {
      id: consultation.consultationId,
      type: 'consultation' as const,
      date: consultation.consultationDate,
      title: consultation.chiefComplaint || 'Medical Consultation',
      description: diagnosis || consultation.treatmentPlan || 'Consultation completed',
      doctor: doctorName,
      diagnosis,
      notes: consultation.notes,
    };
  });

  const appointmentEvents: TimelineEvent[] = appointments.map((item) => {
    const appointment = item.appointment;
    const doctor = item.doctor;

    const doctorName = doctor
      ? `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim()
      : undefined;

    return {
      id: appointment.appointmentId,
      type: 'appointment' as const,
      date: appointment.appointmentDate,
      title: appointment.appointmentType || 'Medical Appointment',
      description: 'Appointment scheduled',
      status: appointment.status,
      doctor: doctorName,
      notes: appointment.appointmentNotes,
    };
  });

  // Merge and sort by date (newest first)
  const allEvents = [...consultationEvents, ...appointmentEvents];
  return allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Status color helper
function getStatusColor(status?: string) {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Timeline Event Component
function TimelineEventItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const eventIcon = event.type === 'consultation' ? Stethoscope : UserCheck;
  const IconComponent = eventIcon;

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-12 h-full w-0.5 bg-border" />
      )}

      {/* Event icon */}
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
        event.type === 'consultation' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
      }`}
      >
        <IconComponent className="size-4" />
      </div>

      {/* Event content */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">{event.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-3" />
                {new Date(event.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {event.status && (
                <Badge variant="outline" className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {event.type === 'consultation' ? 'Consultation' : 'Appointment'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{event.description}</p>

            {/* Doctor and department info */}
            {(event.doctor || event.department) && (
              <div className="flex flex-wrap gap-4 text-sm">
                {event.doctor && (
                  <div className="flex items-center gap-1">
                    <UserCheck className="size-3 text-muted-foreground" />
                    <span className="font-medium">{event.doctor}</span>
                  </div>
                )}
                {event.department && (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Department:</span>
                    <span>{event.department}</span>
                  </div>
                )}
              </div>
            )}

            {/* Diagnosis for consultations */}
            {event.type === 'consultation' && event.diagnosis && (
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-sm">
                  <span className="font-medium text-blue-900">Diagnosis: </span>
                  <span className="text-blue-800">{event.diagnosis}</span>
                </p>
              </div>
            )}

            {/* Notes */}
            {event.notes && (
              <div className="text-sm">
                <span className="font-medium">Notes: </span>
                <span className="text-muted-foreground">{event.notes}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton
function TimelineLoading() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={`timeline-skeleton-${i}`} className="flex gap-4">
          <Skeleton className="size-8 rounded-full" />
          <Card className="flex-1">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

// Main component
export function PatientTimeline({ patientId }: PatientTimelineProps) {
  const { isSignedIn } = useAuth();

  // Fetch consultations
  const {
    data: consultations,
    isLoading: consultationsLoading,
    error: consultationsError,
  } = useQuery({
    queryKey: ['patient-consultations', patientId],
    queryFn: () => fetchPatientConsultations(patientId),
    enabled: isSignedIn && !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch appointments
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: () => fetchPatientAppointments(patientId),
    enabled: isSignedIn && !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Merge timeline events
  const timelineEvents = useMemo(() => {
    return mergeTimelineEvents(consultations, appointments);
  }, [consultations, appointments]);

  const isLoading = consultationsLoading || appointmentsLoading;
  const hasError = consultationsError || appointmentsError;

  if (isLoading) {
    return <TimelineLoading />;
  }

  if (hasError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Unable to load timeline</h3>
          <p className="text-center text-muted-foreground">
            There was an error loading the medical timeline. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No medical history</h3>
          <p className="text-center text-muted-foreground">
            This patient doesn't have any recorded consultations or appointments yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Medical Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Complete history of consultations and appointments
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {timelineEvents.length}
          {' '}
          {timelineEvents.length === 1 ? 'event' : 'events'}
        </Badge>
      </div>

      <div className="space-y-6">
        {timelineEvents.map((event, index) => (
          <TimelineEventItem
            key={event.id}
            event={event}
            isLast={index === timelineEvents.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
