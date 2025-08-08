/**
 * HMS User & Staff Type Definitions
 * Matching users and related tables from Schema.ts
 */

import type {
  BloodGroup,
  EmploymentType,
  Gender,
  ShiftType,
  UserRole,
  UserRoleCategory,
  UserStatus,
} from './enums.types';

// Core User Interface
export type User = {
  userId: string;
  clinicId: string;

  // Basic information
  username: string;
  email: string;
  passwordHash?: string; // Excluded from API responses

  // Personal details
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: Date | string;
  gender?: Gender;

  // Enhanced role management
  role: UserRole;
  roleCategory?: UserRoleCategory;
  secondaryRole?: UserRole;

  // Employment details
  employmentType?: EmploymentType;
  employeeCode?: string;
  reportingTo?: string;
  departmentId?: string;

  // Scheduling and shifts
  shiftType?: ShiftType;
  weeklyOffDays?: number[];
  joiningDate?: Date | string;
  relievingDate?: Date | string;

  // Visiting consultant details
  isVisiting?: boolean;
  visitingDays?: number[];
  visitingTimeStart?: string;
  visitingTimeEnd?: string;
  consultationFee?: number;

  // Capabilities and certifications
  canWorkInEmergency?: boolean;
  canWorkInIcu?: boolean;
  canWorkInOt?: boolean;
  licenseNumber?: string;
  licenseExpiryDate?: Date | string;
  certifications?: Certification[];

  // Emergency contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactPhoneEncrypted?: string;
  bloodGroup?: BloodGroup;

  // Contact information
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // Professional details
  registrationNumber?: string;
  qualification?: string;
  specialization?: string;
  experienceYears?: number;

  // Permissions
  isAdmin?: boolean;
  canLogin?: boolean;

  // Status
  status?: UserStatus;
  isActive?: boolean;
  lastLogin?: Date | string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;

  // Extended info (for UI display)
  department?: Department;
  reportingManager?: User;
};

// Certification Interface
export type Certification = {
  certificationId?: string;
  name: string;
  issuingAuthority: string;
  issueDate: Date | string;
  expiryDate?: Date | string;
  certificateNumber?: string;
  documentUrl?: string;
  isVerified?: boolean;
};

// Department Interface
export type Department = {
  departmentId: string;
  clinicId: string;

  // Department details
  departmentName: string;
  departmentCode: string;
  departmentType?: string;

  // Head of department
  hodId?: string;

  // Location
  floorNumber?: number;
  wing?: string;

  // Capacity
  totalStaff?: number;
  bedCapacity?: number;

  // Services
  servicesProvided?: string[];
  equipmentAvailable?: string[];

  // Operational
  isRevenueGenerating?: boolean;
  isEmergencyService?: boolean;
  operates24x7?: boolean;

  // Metadata
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Extended info
  hod?: User;
  staffMembers?: User[];
  services?: DepartmentService[];
};

// Department Service Interface
export type DepartmentService = {
  serviceId: string;
  departmentId: string;
  clinicId: string;

  // Service details
  serviceName: string;
  serviceCode: string;
  description?: string;

  // Service settings
  category?: string;
  subCategory?: string;
  defaultDuration?: number;

  // Pricing and billing
  basePrice?: number;
  currency?: string;

  // Service availability
  isActive?: boolean;
  isEmergencyService?: boolean;
  requires24x7?: boolean;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
};

// Doctor Schedule Interface
export type DoctorSchedule = {
  scheduleId: string;
  doctorId: string;
  clinicId: string;
  departmentId: string;

  // Schedule details
  dayOfWeek?: number;
  scheduleDate?: Date | string;
  startTime: string;
  endTime: string;

  // Consultation settings
  consultationDuration?: number;
  maxAppointments?: number;
  bufferTime?: number;

  // Schedule type
  scheduleType?: string;

  // Availability
  isActive?: boolean;
  effectiveFrom: Date | string;
  effectiveTill?: Date | string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;

  // Extended info
  doctor?: User;
  department?: Department;
  appointmentCount?: number;
  availableSlots?: number;
};

// Schedule Exception Interface
export type ScheduleException = {
  exceptionId: string;
  doctorId: string;
  clinicId: string;

  // Exception details
  exceptionType: string;
  title: string;
  description?: string;

  // Date and time ranges
  startDate: Date | string;
  endDate: Date | string;
  startTime?: string;
  endTime?: string;

  // Status and approval
  status: string;
  approvedBy?: string;
  approvedAt?: Date | string;

  // Recurrence
  isRecurring?: boolean;
  recurrencePattern?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;

  // Extended info
  doctor?: User;
  approver?: User;
};

// User Search Filters
export type UserSearchFilters = {
  searchQuery?: string;
  role?: UserRole[];
  roleCategory?: UserRoleCategory[];
  department?: string[];
  status?: UserStatus[];
  employmentType?: EmploymentType[];
  shiftType?: ShiftType[];
  canWorkInEmergency?: boolean;
  canWorkInIcu?: boolean;
  canWorkInOt?: boolean;
  isVisiting?: boolean;
};

// Staff Statistics
export type StaffStatistics = {
  totalStaff: number;
  activeStaff: number;
  onDutyToday: number;
  onLeaveToday: number;

  byCategory: {
    medical: number;
    nursing: number;
    diagnostic: number;
    pharmacy: number;
    administrative: number;
    supportServices: number;
    alliedHealth: number;
    indianHealthcare: number;
    management: number;
  };

  byDepartment: Record<string, number>;

  byShiftType: {
    morning: number;
    evening: number;
    night: number;
    rotating: number;
    onCall: number;
    dayShift: number;
    splitShift: number;
    flexible: number;
  };

  certificationExpiring: number;
  licenseExpiring: number;
};

// User Registration Form Data
export type UserRegistrationData = {
  // Basic Information
  username: string;
  email: string;
  password: string;

  // Personal Details
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: Date | string;
  gender?: Gender;

  // Role and Employment
  role: UserRole;
  employmentType: EmploymentType;
  departmentId: string;
  reportingTo?: string;

  // Contact
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Professional
  registrationNumber?: string;
  qualification: string;
  specialization?: string;
  experienceYears?: number;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup?: BloodGroup;

  // Scheduling
  shiftType: ShiftType;
  weeklyOffDays?: number[];
  joiningDate: Date | string;

  // Capabilities
  canWorkInEmergency?: boolean;
  canWorkInIcu?: boolean;
  canWorkInOt?: boolean;

  // Certifications
  certifications?: Certification[];
};

// Schedule Creation Form Data
export type ScheduleCreationData = {
  doctorId: string;
  departmentId: string;

  // For recurring schedule
  recurringDays?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];

  // For specific dates
  specificDates?: {
    date: Date | string;
    startTime: string;
    endTime: string;
  }[];

  // Settings
  consultationDuration: number;
  maxAppointments?: number;
  bufferTime?: number;

  // Validity
  effectiveFrom: Date | string;
  effectiveTill?: Date | string;
};

// Role Permission Map (for UI access control)
export type RolePermissions = {
  canViewPatients: boolean;
  canEditPatients: boolean;
  canDeletePatients: boolean;
  canViewAppointments: boolean;
  canManageAppointments: boolean;
  canStartConsultation: boolean;
  canPrescribe: boolean;
  canViewMedicalRecords: boolean;
  canEditMedicalRecords: boolean;
  canManageInventory: boolean;
  canDispenseMedicine: boolean;
  canManageUsers: boolean;
  canManageDepartments: boolean;
  canViewReports: boolean;
  canManageBilling: boolean;
  canAccessEmergency: boolean;
  canAccessICU: boolean;
  canAccessOT: boolean;
  canManageSchedules: boolean;
  canApproveLeaves: boolean;
  canViewAuditLogs: boolean;
};

// Helper function to get permissions by role
export const getRolePermissions = (role: UserRole): RolePermissions => {
  // This would be implemented based on business logic
  const basePermissions: RolePermissions = {
    canViewPatients: false,
    canEditPatients: false,
    canDeletePatients: false,
    canViewAppointments: false,
    canManageAppointments: false,
    canStartConsultation: false,
    canPrescribe: false,
    canViewMedicalRecords: false,
    canEditMedicalRecords: false,
    canManageInventory: false,
    canDispenseMedicine: false,
    canManageUsers: false,
    canManageDepartments: false,
    canViewReports: false,
    canManageBilling: false,
    canAccessEmergency: false,
    canAccessICU: false,
    canAccessOT: false,
    canManageSchedules: false,
    canApproveLeaves: false,
    canViewAuditLogs: false,
  };

  // Role-specific permissions would be defined here
  // This is a simplified example
  switch (role) {
    case 'Admin':
    case 'Hospital-Administrator':
      return { ...basePermissions, ...Object.fromEntries(Object.keys(basePermissions).map(k => [k, true])) } as RolePermissions;

    case 'Doctor':
    case 'Senior-Doctor':
      return {
        ...basePermissions,
        canViewPatients: true,
        canEditPatients: true,
        canViewAppointments: true,
        canManageAppointments: true,
        canStartConsultation: true,
        canPrescribe: true,
        canViewMedicalRecords: true,
        canEditMedicalRecords: true,
        canAccessEmergency: true,
        canManageSchedules: true,
      };

    case 'Nurse':
    case 'Staff-Nurse':
      return {
        ...basePermissions,
        canViewPatients: true,
        canEditPatients: true,
        canViewAppointments: true,
        canViewMedicalRecords: true,
        canEditMedicalRecords: true,
        canAccessEmergency: true,
      };

    case 'Receptionist':
      return {
        ...basePermissions,
        canViewPatients: true,
        canEditPatients: true,
        canViewAppointments: true,
        canManageAppointments: true,
      };

    case 'Pharmacist':
      return {
        ...basePermissions,
        canViewPatients: true,
        canViewMedicalRecords: true,
        canManageInventory: true,
        canDispenseMedicine: true,
      };

    default:
      return basePermissions;
  }
};
