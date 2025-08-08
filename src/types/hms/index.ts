/**
 * HMS Type Definitions Index
 * Central export for all Hospital Management System types
 */

// Export all enum types
export * from './enums.types';

// Export patient and family types
export * from './patient.types';

// Export user and staff types
export * from './user.types';

// Export clinical workflow types
export * from './clinical.types';

// Export ICU management types
export * from './icu.types';

// Export pharmacy types
export * from './pharmacy.types';

// Export billing and administrative types
export * from './billing.types';

// Export communication and audit types
export * from './communication.types';

// Re-export commonly used types for convenience
export type {
  Appointment,
  AppointmentStatus,
  AuditStats,
  BillingStatistics,
  BloodGroup,
  ClinicalStatistics,
  CommunicationStats,
  Consultation,
  Department,
  Gender,
  ICUDashboardStats,
  // Core entities
  Patient,
  // Statistics
  PatientStatistics,
  PatientStatus,
  PharmacyDashboardStats,
  Prescription,
  StaffStatistics,
  User,
  // Key enums
  UserRole,
} from './index';

// Export utility type for all dashboard statistics
export type HMSDashboardStats = {
  patients: import('./patient.types').PatientStatistics;
  staff: import('./user.types').StaffStatistics;
  clinical: import('./clinical.types').ClinicalStatistics;
  icu: import('./icu.types').ICUDashboardStats;
  pharmacy: import('./pharmacy.types').PharmacyDashboardStats;
  billing: import('./billing.types').BillingStatistics;
  communication: import('./communication.types').CommunicationStats;
  audit: import('./communication.types').AuditStats;
};

// Export type for complete patient record with all relations
export type CompletePatientRecord = {
  patient: import('./patient.types').Patient;
  familyGroup?: import('./patient.types').FamilyGroup;
  familyMembers?: import('./patient.types').FamilyMember[];
  guardians?: import('./patient.types').GuardianRelationship[];
  appointments?: import('./clinical.types').Appointment[];
  consultations?: import('./clinical.types').Consultation[];
  prescriptions?: import('./clinical.types').Prescription[];
  bills?: import('./billing.types').PatientBill[];
  medicalHistory?: import('./clinical.types').ClinicalSummary;
  insuranceCoverage?: import('./patient.types').FamilyInsurance[];
};

// Export type for complete staff record with all relations
export type CompleteStaffRecord = {
  user: import('./user.types').User;
  department?: import('./user.types').Department;
  schedules?: import('./user.types').DoctorSchedule[];
  certifications?: import('./user.types').Certification[];
  currentShift?: import('./icu.types').ICUStaffShift;
  permissions?: import('./user.types').RolePermissions;
};

// Hospital Network type (for multi-hospital support)
export type HospitalNetwork = {
  networkId: string;
  networkName: string;
  networkCode: string;
  headquartersAddress?: string;
  totalHospitals?: number;
  totalBeds?: number;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  sharedPatientRecords?: boolean;
  sharedInventory?: boolean;
  centralizedBilling?: boolean;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Clinic/Hospital type
export type Clinic = {
  clinicId: string;
  networkId?: string;
  clinicName: string;
  clinicCode: string;
  clinicType?: string;

  // Indian healthcare registration
  registrationNumber?: string;
  ayushmanBharatId?: string;
  cghsEmpanelmentNumber?: string;
  esicRegistrationNumber?: string;

  // Contact information
  address: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
  phone?: string;
  email?: string;
  website?: string;

  // Capacity
  totalBeds?: number;
  icuBeds?: number;
  emergencyBeds?: number;

  // Services
  servicesOffered?: string[];
  specialties?: string[];

  // Timing
  operatingHours?: Record<string, { start_time: string; end_time: string; is_closed: boolean }>;
  emergencyServices24x7?: boolean;

  // Configuration
  multiTenant?: boolean;
  timezone?: string;
  defaultLanguage?: string;

  // Metadata
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Extended info
  network?: HospitalNetwork;
  departments?: import('./user.types').Department[];
};

// Export master type for entire HMS system
export type HMSMasterData = {
  networks?: HospitalNetwork[];
  clinics?: Clinic[];
  departments?: import('./user.types').Department[];
  users?: import('./user.types').User[];
  patients?: import('./patient.types').Patient[];
  governmentSchemes?: import('./billing.types').GovernmentSchemeConfig[];
  medicineMaster?: import('./pharmacy.types').MedicineMaster[];
  whatsappTemplates?: import('./communication.types').WhatsAppTemplate[];
};

// Export type guards for runtime type checking
export const isDoctor = (user: import('./user.types').User): boolean => {
  return user.role.includes('Doctor') || user.role.includes('Surgeon') || user.role.includes('Specialist');
};

export const isNurse = (user: import('./user.types').User): boolean => {
  return user.role.includes('Nurse') || user.role === 'Midwife';
};

export const canPrescribe = (user: import('./user.types').User): boolean => {
  const prescribingRoles = [
    'Doctor',
    'Senior-Doctor',
    'Junior-Doctor',
    'Specialist-Consultant',
    'Surgeon',
    'Ayush-Doctor',
    'Ayurveda-Practitioner',
    'Homeopathy-Doctor',
  ];
  return prescribingRoles.includes(user.role);
};

export const canAccessICU = (user: import('./user.types').User): boolean => {
  return user.canWorkInIcu === true || user.role === 'ICU-Specialist' || user.role === 'ICU-Nurse';
};

export const canAccessEmergency = (user: import('./user.types').User): boolean => {
  return user.canWorkInEmergency === true || user.role === 'Emergency-Medicine-Doctor' || user.role === 'Emergency-Nurse';
};
