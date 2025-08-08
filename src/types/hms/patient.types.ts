/**
 * HMS Patient Type Definitions
 * Matching patient and family management tables from Schema.ts
 */

import type {
  BloodGroup,
  ConditionSeverity,
  FamilyAppointmentType,
  FamilyIncomeCategory,
  FamilyMemberStatus,
  FamilyRelationship,
  Gender,
  LegalDocumentType,
  PatientStatus,
  PolicyType,
  RelationshipCategory,
} from './enums.types';

// Core Patient Interface
export type Patient = {
  patientId: string;
  clinicId: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date | string;
  age?: number;
  gender: Gender;

  // Contact information
  phone?: string;
  phoneEncrypted?: string;
  alternatePhone?: string;
  email?: string;

  // Address
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // Identity documents (Indian specific)
  aadhaarNumber?: string;
  aadhaarNumberEncrypted?: string;
  panNumber?: string;
  voterId?: string;

  // Medical information
  bloodGroup?: BloodGroup;
  allergies?: string[];
  chronicConditions?: string[];

  // Emergency contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactPhoneEncrypted?: string;
  emergencyContactRelation?: string;

  // Insurance and schemes
  insuranceDetails?: InsuranceDetails;
  governmentSchemeNumber?: string;

  // ABHA integration
  abhaNumber?: string;
  abhaAddress?: string;

  // Statistics
  totalVisits?: number;
  lastVisitDate?: Date | string;

  // Status
  isActive?: boolean;
  isVip?: boolean;
  status?: PatientStatus;

  // Admission tracking
  admissionDate?: Date | string;
  dischargeDate?: Date | string;
  currentDepartmentId?: string;
  admissionReason?: string;
  dischargeReason?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
};

// Insurance Details Type
export type InsuranceDetails = {
  provider?: string;
  policyNumber?: string;
  validFrom?: Date | string;
  validTill?: Date | string;
  coverageAmount?: number;
  coverageType?: string;
  tpaName?: string;
  remarks?: string;
};

// Family Group Interface
export type FamilyGroup = {
  familyId: string;
  familyCode: string;
  familyName?: string;
  primaryMemberId?: string;

  // Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // Contact
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;

  // Indian specific
  rationCardNumber?: string;
  familyIncomeCategory?: FamilyIncomeCategory;

  // Metadata
  createdAt?: Date | string;
  createdBy?: string;
  updatedAt?: Date | string;
  isActive?: boolean;
};

// Family Member Interface
export type FamilyMember = {
  memberId: string;
  familyId: string;
  patientId: string;
  relationshipToPrimary?: FamilyRelationship;
  relationshipDetails?: Record<string, any>;

  // Member details
  isPrimaryMember?: boolean;
  isEarningMember?: boolean;
  isDependent?: boolean;

  // Consent and sharing
  shareMedicalHistory?: boolean;
  shareInsurance?: boolean;
  shareBilling?: boolean;
  consentDate?: Date | string;
  consentBy?: string;

  // Status
  joinDate?: Date | string;
  leaveDate?: Date | string;
  status?: FamilyMemberStatus;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;

  // Extended patient info (for UI display)
  patient?: Patient;
};

// Family Medical History Interface
export type FamilyMedicalHistory = {
  historyId: string;
  familyId: string;
  patientId?: string;

  // Condition details
  conditionName: string;
  icd10Code?: string;

  // Affected members
  affectedRelationship?: FamilyRelationship;
  affectedCount?: number;

  // Details
  ageOfOnset?: number;
  severity?: ConditionSeverity;
  isHereditary?: boolean;

  // Additional information
  notes?: string;

  // Metadata
  reportedBy: string;
  reportedDate?: Date | string;
  verifiedBy?: string;
  verificationDate?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Guardian Relationship Interface
export type GuardianRelationship = {
  guardianId: string;
  patientId: string;
  guardianPatientId: string;

  // Guardian details
  relationshipType: FamilyRelationship;
  isPrimaryGuardian?: boolean;

  // Legal details
  legalDocumentType?: LegalDocumentType;
  documentNumber?: string;
  documentCopy?: string;

  // Permissions
  canConsentMedical?: boolean;
  canAccessRecords?: boolean;
  canApproveProcedures?: boolean;

  // Validity
  effectiveFrom?: Date | string;
  effectiveUntil?: Date | string;

  // Metadata
  createdAt?: Date | string;
  createdBy?: string;
  verifiedBy?: string;
  verificationDate?: Date | string;

  // Extended guardian info (for UI display)
  guardianPatient?: Patient;
};

// Family Insurance Interface
export type FamilyInsurance = {
  familyInsuranceId: string;
  familyId: string;

  // Policy details
  insuranceProvider: string;
  policyNumber: string;
  policyType?: PolicyType;

  // Coverage
  totalSumInsured?: number;
  remainingSumInsured?: number;

  // Members covered
  coveredMembers?: CoveredMember[];
  primaryMemberId?: string;

  // Validity
  policyStartDate: Date | string;
  policyEndDate: Date | string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isActive?: boolean;
};

// Covered Member Type
export type CoveredMember = {
  patientId: string;
  memberName?: string;
  relationship?: FamilyRelationship;
  sumInsured?: number;
  utilizationAmount?: number;
};

// Family Appointment Interface
export type FamilyAppointment = {
  familyAppointmentId: string;
  familyId: string;
  clinicId: string;

  // Appointment details
  appointmentDate: Date | string;
  appointmentTime: string;
  appointmentType?: FamilyAppointmentType;

  // Members included
  memberAppointments?: MemberAppointment[];

  // Booking details
  bookedBy: string;
  bookedAt?: Date | string;

  // Status
  status?: string;
  cancellationReason?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Member Appointment Type
export type MemberAppointment = {
  patientId: string;
  patientName?: string;
  appointmentId?: string;
  doctorId?: string;
  departmentId?: string;
  tokenNumber?: number;
  status?: string;
};

// Relationship Type Interface
export type RelationshipType = {
  relationshipId: number;
  relationshipCode: FamilyRelationship;
  relationshipName: string;
  relationshipNameHindi?: string;
  relationshipNameLocal?: string;
  reverseRelationship?: string;
  category?: RelationshipCategory;
  isBloodRelation?: boolean;
  isLegalGuardian?: boolean;
  displayOrder?: number;
  createdAt?: Date | string;
};

// Patient Search Filters
export type PatientSearchFilters = {
  searchQuery?: string;
  status?: PatientStatus[];
  gender?: Gender[];
  bloodGroup?: BloodGroup[];
  ageRange?: {
    min?: number;
    max?: number;
  };
  hasInsurance?: boolean;
  hasGovernmentScheme?: boolean;
  departmentId?: string;
  doctorId?: string;
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
};

// Patient Statistics
export type PatientStatistics = {
  totalPatients: number;
  activePatients: number;
  admittedPatients: number;
  outpatients: number;
  emergencyPatients: number;
  todayRegistrations: number;
  todayVisits: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  insuranceCoverage: {
    withInsurance: number;
    withGovernmentScheme: number;
    selfPay: number;
  };
};

// Patient Registration Form Data
export type PatientRegistrationData = {
  // Basic Information
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date | string;
  gender: Gender;

  // Contact
  phone: string;
  alternatePhone?: string;
  email?: string;

  // Address
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Identity
  aadhaarNumber?: string;
  panNumber?: string;
  voterId?: string;
  abhaNumber?: string;

  // Medical
  bloodGroup?: BloodGroup;
  allergies?: string[];
  chronicConditions?: string[];

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Insurance
  hasInsurance?: boolean;
  insuranceProvider?: string;
  policyNumber?: string;

  // Government Scheme
  hasGovernmentScheme?: boolean;
  governmentSchemeType?: string;
  governmentSchemeNumber?: string;
};
