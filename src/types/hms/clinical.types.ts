/**
 * HMS Clinical Workflow Type Definitions
 * Matching clinical tables from Schema.ts
 */

import type {
  AppointmentStatus,
  MedicationRoute,
  NursingNoteType,
  QueueStatus,
} from './enums.types';
import type { Patient } from './patient.types';
import type { Department, User } from './user.types';

// Appointment Interface
export type Appointment = {
  appointmentId: string;
  appointmentCode: string;
  clinicId: string;

  // Patient and doctor
  patientId: string;
  doctorId: string;
  departmentId: string;

  // Appointment details
  appointmentDate: Date | string;
  appointmentTime: string;
  appointmentEndTime?: string;
  appointmentType?: string;
  visitType?: string;

  // Status tracking
  status?: AppointmentStatus;
  checkedInAt?: Date | string;
  consultationStartAt?: Date | string;
  consultationEndAt?: Date | string;

  // Queue management
  tokenNumber?: number;
  queuePriority?: number;

  // Scheduling metadata
  scheduledBy?: string;
  scheduledAt?: Date | string;
  rescheduledFrom?: string;
  cancellationReason?: string;
  cancelledBy?: string;

  // Fees
  consultationFee?: number;
  discountAmount?: number;
  discountReason?: string;

  // Notes
  chiefComplaint?: string;
  appointmentNotes?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isDeleted?: boolean;
  version?: number;

  // Extended info (for UI display)
  patient?: Patient;
  doctor?: User;
  department?: Department;
};

// Queue Entry Interface
export type QueueEntry = {
  queueId: string;
  clinicId: string;
  departmentId: string;

  // Queue details
  queueDate: Date | string;
  tokenNumber: number;
  patientId: string;
  doctorId?: string;

  // Status
  status?: QueueStatus;
  priority?: number;

  // Timing
  arrivalTime?: Date | string;
  calledTime?: Date | string;
  consultationStartTime?: Date | string;
  consultationEndTime?: Date | string;

  // Queue type
  queueType?: string;
  serviceType?: string;

  // Link to appointment
  appointmentId?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Extended info
  patient?: Patient;
  doctor?: User;
  department?: Department;
  appointment?: Appointment;
};

// Consultation Interface
export type Consultation = {
  consultationId: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;

  // Consultation details
  consultationDate?: Date | string;
  consultationType?: string;

  // Vitals
  vitals?: Vitals;

  // Clinical findings
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  pastMedicalHistory?: string;
  familyHistory?: string;
  socialHistory?: string;

  // Examination
  generalExamination?: string;
  systemicExamination?: string;
  localExamination?: string;

  // Diagnosis
  provisionalDiagnosis?: string[];
  finalDiagnosis?: string[];
  icd10Codes?: string[];

  // Plan
  treatmentPlan?: string;
  followUpDate?: Date | string;
  followUpInstructions?: string;

  // Referrals
  referredTo?: string;
  referralReason?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;

  // Extended info
  patient?: Patient;
  doctor?: User;
  appointment?: Appointment;
  prescriptions?: Prescription[];
};

// Vitals Interface
export type Vitals = {
  bp_systolic?: number;
  bp_diastolic?: number;
  pulse?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  spo2?: number;
  respiratoryRate?: number;
  bmi?: number;
  bloodSugar?: number;
  bloodSugarType?: 'Random' | 'Fasting' | 'PostPrandial';
};

// Prescription Interface
export type Prescription = {
  prescriptionId: string;
  consultationId: string;
  patientId: string;
  doctorId: string;

  // Prescription details
  prescriptionDate?: Date | string;
  prescriptionCode: string;

  // Validity
  validTill?: Date | string;

  // Notes
  generalAdvice?: string;
  dietAdvice?: string;

  // Encrypted diagnosis
  diagnosisEncrypted?: string;

  // Follow up
  followUpDate?: Date | string;
  followUpInstructions?: string;

  // Status tracking
  status?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: Date | string;

  // Digital signature
  isSigned?: boolean;
  signedAt?: Date | string;
  signatureData?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;

  // Extended info
  patient?: Patient;
  doctor?: User;
  consultation?: Consultation;
  items?: PrescriptionItem[];
};

// Prescription Item Interface
export type PrescriptionItem = {
  itemId: string;
  prescriptionId: string;

  // Medicine details
  medicineName: string;
  genericName?: string;
  medicineType?: string;
  strength?: string;

  // Dosage
  dosage?: string;
  frequency?: string;
  duration?: string;
  quantity?: number;

  // Route
  route?: string;

  // Instructions
  beforeFood?: boolean;
  instructions?: string;

  // Controlled substance tracking
  isControlled?: boolean;
  controlledSchedule?: string;

  // Dispensing
  isDispensed?: boolean;
  dispensedQuantity?: number;
  dispensedBy?: string;
  dispensedAt?: Date | string;

  // Order
  displayOrder?: number;
};

// Nursing Note Interface
export type NursingNote = {
  noteId: string;
  patientId: string;
  nurseId: string;

  // Note details
  noteType: NursingNoteType;
  noteContent: string;

  // Clinical data
  vitals?: Vitals;
  medicationGiven?: MedicationAdministration[];

  // Metadata
  createdAt?: Date | string;
  shift?: string;

  // Extended info
  nurse?: User;
  patient?: Patient;
};

// Medication Administration Record
export type MedicationAdministration = {
  medicationId: string;
  medicineName: string;
  dose: string;
  route: MedicationRoute;
  givenAt: Date | string;
  givenBy: string;
  notes?: string;
  wasSkipped?: boolean;
  skipReason?: string;
};

// Appointment Search Filters
export type AppointmentSearchFilters = {
  searchQuery?: string;
  status?: AppointmentStatus[];
  doctorId?: string[];
  departmentId?: string[];
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  appointmentType?: string[];
  visitType?: string[];
};

// Consultation Search Filters
export type ConsultationSearchFilters = {
  searchQuery?: string;
  patientId?: string;
  doctorId?: string[];
  departmentId?: string[];
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  consultationType?: string[];
  diagnosis?: string[];
};

// Clinical Statistics
export type ClinicalStatistics = {
  todayStats: {
    totalAppointments: number;
    completedConsultations: number;
    pendingConsultations: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    averageWaitTime: number;
    averageConsultationTime: number;
  };

  queueStats: {
    currentWaiting: number;
    averageTokensPerHour: number;
    peakHours: string[];
    departmentQueues: Record<string, number>;
  };

  prescriptionStats: {
    totalPrescriptions: number;
    dispensedPrescriptions: number;
    pendingDispensing: number;
    controlledSubstances: number;
  };
};

// Appointment Slot
export type AppointmentSlot = {
  slotId?: string;
  date: Date | string;
  time: string;
  duration: number;
  isAvailable: boolean;
  isBlocked?: boolean;
  blockReason?: string;
};

// Appointment Booking Data
export type AppointmentBookingData = {
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  appointmentType: string;
  visitType: string;
  chiefComplaint?: string;
  isEmergency?: boolean;
  referredBy?: string;
};

// Consultation Form Data
export type ConsultationFormData = {
  // Vitals
  vitals: Vitals;

  // Clinical findings
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory?: string;
  familyHistory?: string;
  socialHistory?: string;

  // Examination
  generalExamination: string;
  systemicExamination?: string;
  localExamination?: string;

  // Diagnosis
  provisionalDiagnosis: string[];
  icd10Codes?: string[];

  // Treatment
  treatmentPlan: string;
  prescriptions?: PrescriptionFormData[];

  // Follow up
  followUpDate?: Date | string;
  followUpInstructions?: string;

  // Referral
  needsReferral?: boolean;
  referredTo?: string;
  referralReason?: string;
};

// Prescription Form Data
export type PrescriptionFormData = {
  medicines: {
    medicineName: string;
    genericName?: string;
    medicineType?: string;
    strength?: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    route?: string;
    beforeFood?: boolean;
    instructions?: string;
  }[];

  generalAdvice?: string;
  dietAdvice?: string;
  followUpDate?: Date | string;
  followUpInstructions?: string;
};

// Queue Display Data (for waiting area screens)
export type QueueDisplayData = {
  currentToken: number;
  nextTokens: number[];
  averageWaitTime: number;
  departmentQueues: {
    departmentName: string;
    currentToken: number;
    waitingCount: number;
  }[];
  announcements?: string[];
};

// Clinical Summary (for patient history)
export type ClinicalSummary = {
  patientId: string;
  lastVisit?: Date | string;
  totalVisits: number;

  chronicConditions: string[];
  allergies: string[];
  currentMedications: {
    medicineName: string;
    dosage: string;
    startDate: Date | string;
  }[];

  recentConsultations: Consultation[];
  recentPrescriptions: Prescription[];
  upcomingAppointments: Appointment[];

  vitalsHistory: {
    date: Date | string;
    vitals: Vitals;
  }[];
};
