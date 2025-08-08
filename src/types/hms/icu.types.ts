/**
 * HMS ICU Management Type Definitions
 * Matching ICU management tables from Schema.ts
 */

import type {
  CarePlanStatus,
  EquipmentStatus,
  EquipmentType,
  ICUAlertSeverity,
  ICUAlertType,
  ICUBedStatus,
  ICUBedType,
  ICUShiftStatus,
  ICUShiftType,
} from './enums.types';
import type { Patient } from './patient.types';
import type { Department, User } from './user.types';

// ICU Bed Interface
export type ICUBed = {
  icuBedId: string;
  clinicId: string;
  departmentId: string;

  // Bed identification
  bedNumber: string;
  bedType: ICUBedType;

  // Patient assignment
  patientId?: string;

  // Status and availability
  status: ICUBedStatus;
  lastSanitized?: Date | string;

  // Equipment and monitoring
  monitoringEquipment?: MonitoringEquipment;
  cardiacMonitoringLevel?: 'basic' | 'advanced' | 'swan_ganz';
  telemetryEnabled?: boolean;

  // Indian healthcare compliance
  oxygenSupplyType?: 'Central' | 'Cylinder' | 'Concentrator';
  backupOxygenAvailable?: boolean;
  isolationCapable?: boolean;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Extended info
  patient?: Patient;
  department?: Department;
  assignedNurse?: User;
  equipment?: ICUEquipment[];
};

// Monitoring Equipment Interface
export type MonitoringEquipment = {
  cardiacMonitor?: boolean;
  ventilator?: boolean;
  infusionPumps?: number;
  syringePumps?: number;
  dialysisUnit?: boolean;
  ecmo?: boolean;
  iabp?: boolean;
  otherEquipment?: string[];
};

// ICU Equipment Interface
export type ICUEquipment = {
  equipmentId: string;
  equipmentType: EquipmentType;
  equipmentName: string;
  modelNumber?: string;
  serialNumber?: string;
  status: EquipmentStatus;
  lastCalibration?: Date | string;
  nextCalibrationDue?: Date | string;
  assignedToBedId?: string;
  notes?: string;
};

// ICU Nursing Care Plan Interface
export type ICUNursingCarePlan = {
  carePlanId: string;
  patientId: string;
  icuBedId: string;

  // Care assignment
  assignedNurseId: string;
  carePlanTemplateId?: string;

  // Care instructions and protocols
  careInstructions: CareInstruction[];
  cardiacProtocolId?: string;
  frequencyHours?: number;

  // Assessment scheduling
  nextAssessmentDue?: Date | string;
  lastAssessmentCompleted?: Date | string;

  // Cardiac-specific tracking
  fluidBalanceTarget?: number;
  cardiacMedications?: CardiacMedication[];

  // Compliance and status
  complianceStatus?: CarePlanStatus;
  compliancePercentage?: number;

  // ISCCM compliance tracking
  nursePatientRatio?: number;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;

  // Extended info
  patient?: Patient;
  bed?: ICUBed;
  assignedNurse?: User;
  assessments?: ICUAssessment[];
};

// Care Instruction Interface
export type CareInstruction = {
  instructionId?: string;
  instructionType: string;
  description: string;
  frequency: string;
  priority: 'routine' | 'urgent' | 'critical';
  specialNotes?: string;
  completedToday?: boolean;
  lastCompletedAt?: Date | string;
  completedBy?: string;
};

// Cardiac Medication Interface
export type CardiacMedication = {
  medicationName: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: Date | string;
  endDate?: Date | string;
  specialInstructions?: string;
};

// ICU Assessment Interface
export type ICUAssessment = {
  assessmentId: string;
  carePlanId: string;
  assessedBy: string;
  assessmentTime: Date | string;

  // Neurological assessment
  glasgowComaScale?: number;
  pupilReaction?: {
    left: string;
    right: string;
  };

  // Cardiac assessment
  cardiacRhythm?: string;
  hemodynamicStatus?: string;

  // Respiratory assessment
  ventilatorMode?: string;
  fiO2?: number;
  peep?: number;
  tidalVolume?: number;

  // Other assessments
  skinIntegrity?: string;
  painScore?: number;
  sedationScore?: number;

  notes?: string;
};

// ICU Critical Alert Interface
export type ICUCriticalAlert = {
  alertId: string;
  patientId: string;
  icuBedId: string;

  // Alert details
  alertType: ICUAlertType;
  severity: ICUAlertSeverity;
  message: string;
  alertData?: Record<string, any>;

  // Response tracking
  acknowledgedBy?: string;
  acknowledgedAt?: Date | string;
  resolvedBy?: string;
  resolvedAt?: Date | string;
  responseTimeMinutes?: number;

  // Escalation
  escalatedTo?: string;
  escalatedAt?: Date | string;

  // Indian compliance
  reportedToAuthorities?: boolean;
  incidentReportNumber?: string;

  // Metadata
  createdAt?: Date | string;
  isActive?: boolean;

  // Extended info
  patient?: Patient;
  bed?: ICUBed;
  acknowledgedByUser?: User;
  resolvedByUser?: User;
  escalatedToUser?: User;
};

// ICU Staff Shift Interface
export type ICUStaffShift = {
  shiftId: string;
  clinicId: string;
  departmentId: string;

  // Staff assignment
  staffId: string;
  shiftType: ICUShiftType;

  // Shift timing
  shiftDate: Date | string;
  startTime: string;
  endTime: string;
  actualStartTime?: Date | string;
  actualEndTime?: Date | string;

  // Patient assignments
  patientAssignments?: string[];
  maxPatientCapacity?: number;

  // Handover documentation
  handoverNotes?: string;
  handoverReceivedFrom?: string;
  handoverGivenTo?: string;
  handoverCompletedAt?: Date | string;

  // Shift status and compliance
  status?: ICUShiftStatus;

  // ISCCM compliance
  minimumStaffRatioCompliance?: boolean;
  specialistAvailability?: 'Available' | 'On-Call' | 'Unavailable';

  // Emergency coverage
  emergencyContactNumber?: string;
  backupStaffId?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;

  // Extended info
  staff?: User;
  department?: Department;
  handoverReceivedFromUser?: User;
  handoverGivenToUser?: User;
  backupStaff?: User;
  patients?: Patient[];
};

// ICU Dashboard Statistics
export type ICUDashboardStats = {
  beds: {
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
    isolation: number;
  };

  patients: {
    total: number;
    ventilated: number;
    onDialysis: number;
    onVasopressors: number;
    criticalAlerts: number;
  };

  staff: {
    onDuty: number;
    nursesOnDuty: number;
    doctorsOnDuty: number;
    nursePatientRatio: string;
  };

  alerts: {
    active: number;
    critical: number;
    acknowledged: number;
    averageResponseTime: number;
  };

  equipment: {
    totalVentilators: number;
    availableVentilators: number;
    totalMonitors: number;
    equipmentFailures: number;
  };
};

// ICU Bed Search Filters
export type ICUBedSearchFilters = {
  status?: ICUBedStatus[];
  bedType?: ICUBedType[];
  hasVentilator?: boolean;
  hasCardiacMonitor?: boolean;
  isolationCapable?: boolean;
  departmentId?: string;
};

// ICU Alert Search Filters
export type ICUAlertSearchFilters = {
  severity?: ICUAlertSeverity[];
  alertType?: ICUAlertType[];
  isActive?: boolean;
  isAcknowledged?: boolean;
  isResolved?: boolean;
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  patientId?: string;
  bedId?: string;
};

// ICU Handover Report
export type ICUHandoverReport = {
  shiftId: string;
  shiftDate: Date | string;
  fromStaff: User;
  toStaff: User;

  patients: {
    patient: Patient;
    bed: ICUBed;
    diagnosis: string;
    daysSinceAdmission: number;
    ventilatorDays?: number;

    currentStatus: {
      stable: boolean;
      onVentilator: boolean;
      onDialysis: boolean;
      onVasopressors: boolean;
      sedated: boolean;
    };

    events: string[];
    pendingTasks: string[];
    specialInstructions: string[];
  }[];

  generalNotes?: string;
  criticalIssues?: string[];
  equipmentIssues?: string[];
};

// ICU Admission Form Data
export type ICUAdmissionData = {
  patientId: string;
  bedId: string;

  // Admission details
  admissionReason: string;
  sourceOfAdmission: 'Emergency' | 'OT' | 'Ward' | 'OPD' | 'Transfer';

  // Clinical status
  primaryDiagnosis: string;
  comorbidities: string[];

  // Severity scores
  apacheScore?: number;
  sopaScore?: number;

  // Initial plan
  expectedStayDays?: number;
  needsVentilator?: boolean;
  needsDialysis?: boolean;
  needsCardiacMonitoring?: boolean;
  isolationRequired?: boolean;

  // Care team
  primaryConsultantId: string;
  assignedNurseId: string;
};

// ICU Discharge/Transfer Form Data
export type ICUDischargeData = {
  patientId: string;
  bedId: string;

  // Discharge details
  dischargeType: 'Ward' | 'Home' | 'Transfer' | 'Death' | 'LAMA';
  dischargeDate: Date | string;

  // Clinical summary
  finalDiagnosis: string[];
  proceduresPerformed: string[];
  complications?: string[];

  // Outcome
  icuStayDays: number;
  ventilatorDays?: number;

  // Transfer details (if applicable)
  transferTo?: string;
  transferInstructions?: string;

  // Discharge instructions
  medications: string[];
  followUpInstructions: string;
  specialInstructions?: string;
};
