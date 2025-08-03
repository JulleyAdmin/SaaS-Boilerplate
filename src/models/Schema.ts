/**
 * HMS INDIA COMPLETE SCHEMA v6.0.0 - Drizzle ORM Implementation
 * Hospital Management System - Production Ready Schema
 * Enhanced with Comprehensive Role Management (95+ Roles)
 *
 * Features:
 * - Multi-tenant healthcare architecture
 * - Indian healthcare compliance (ABHA, Aadhaar, Government Schemes)
 * - 95+ comprehensive hospital roles with hierarchy
 * - Advanced duty management and scheduling
 * - Clinical workflows (MAR, nursing, OT, allied health)
 * - WhatsApp communication system
 * - Enhanced security with field-level encryption
 * - Comprehensive audit and activity tracking
 * - Support for partitioning and performance optimization
 */

import {
  bigint,
  boolean,
  date,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgSchema,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// ============================================================================
// SCHEMA DEFINITIONS
// ============================================================================

export const coreSchema = pgSchema('core');
export const appointmentsSchema = pgSchema('appointments');
export const clinicalSchema = pgSchema('clinical');
export const billingSchema = pgSchema('billing');
export const inventorySchema = pgSchema('inventory');
export const laboratorySchema = pgSchema('laboratory');
export const reportsSchema = pgSchema('reports');
export const auditSchema = pgSchema('audit');
export const securitySchema = pgSchema('security');
export const communicationSchema = pgSchema('communication');
export const insuranceSchema = pgSchema('insurance');
export const programsSchema = pgSchema('programs');
export const configSchema = pgSchema('config');
export const networkSchema = pgSchema('network');
export const collaborationSchema = pgSchema('collaboration');

// ============================================================================
// ENHANCED ENUM TYPES (95+ Roles)
// ============================================================================

// Extended user roles (95+ roles for comprehensive hospital management)
export const userRoleEnum = pgEnum('user_role_enum', [
  // Basic 10 roles (existing)
  'Doctor',
  'Nurse',
  'Receptionist',
  'Pharmacist',
  'Lab-Technician',
  'Admin',
  'Accountant',
  'Manager',
  'Support-Staff',
  'Billing-Manager',

  // Medical Staff (Senior & Specialized)
  'Medical-Superintendent',
  'Deputy-Medical-Superintendent',
  'Senior-Doctor',
  'Junior-Doctor',
  'Resident-Medical-Officer',
  'House-Officer',
  'Visiting-Consultant',
  'Specialist-Consultant',
  'Surgeon',
  'Assistant-Surgeon',
  'Anesthesiologist',
  'Radiologist',
  'Pathologist',
  'Microbiologist',
  'Emergency-Medicine-Doctor',
  'ICU-Specialist',
  'Pediatrician',
  'Gynecologist',
  'Orthopedic-Surgeon',
  'Cardiologist',
  'Neurologist',
  'Dermatologist',
  'ENT-Specialist',
  'Ophthalmologist',
  'Psychiatrist',
  'General-Surgeon',

  // Nursing Staff (Hierarchical)
  'Chief-Nursing-Officer',
  'Deputy-Nursing-Officer',
  'Nursing-Superintendent',
  'Nursing-Supervisor',
  'Staff-Nurse',
  'Senior-Staff-Nurse',
  'Nursing-Assistant',
  'Nursing-Intern',
  'Ward-Sister',
  'ICU-Nurse',
  'OT-Nurse',
  'Emergency-Nurse',
  'Midwife',

  // Diagnostic & Technical
  'Chief-Lab-Technician',
  'Senior-Lab-Technician',
  'Radiology-Technician',
  'X-Ray-Technician',
  'CT-Technician',
  'MRI-Technician',
  'ECG-Technician',
  'Echo-Technician',
  'EEG-Technician',
  'Dialysis-Technician',
  'OT-Technician',
  'CSSD-Technician',
  'Anesthesia-Technician',

  // Pharmacy
  'Chief-Pharmacist',
  'Senior-Pharmacist',
  'Clinical-Pharmacist',
  'Pharmacy-Assistant',

  // Administration
  'Hospital-Administrator',
  'Assistant-Administrator',
  'HR-Manager',
  'HR-Executive',
  'Finance-Manager',
  'Marketing-Manager',
  'Quality-Manager',
  'IT-Manager',
  'IT-Support-Executive',
  'Stores-Manager',
  'Purchase-Officer',
  'Medical-Records-Officer',

  // Support Services
  'Ward-Boy',
  'Ward-Girl',
  'Ward-Attendant',
  'Patient-Care-Assistant',
  'Housekeeping-Supervisor',
  'Housekeeping-Staff',
  'Security-Supervisor',
  'Security-Guard',
  'Ambulance-Driver',
  'Ambulance-EMT',
  'Transport-Coordinator',
  'Front-Office-Executive',
  'Admission-Counselor',
  'Insurance-Coordinator',
  'Patient-Relations-Officer',

  // Allied Health Services
  'Physiotherapist',
  'Occupational-Therapist',
  'Speech-Therapist',
  'Dietitian',
  'Clinical-Nutritionist',
  'Medical-Social-Worker',
  'Clinical-Psychologist',
  'Counselor',

  // Indian Healthcare Specific
  'ASHA-Worker',
  'ANM',
  'CHO',
  'MPW',
  'Ayush-Doctor',
  'Ayurveda-Practitioner',
  'Yoga-Instructor',
  'Unani-Practitioner',
  'Siddha-Practitioner',
  'Homeopathy-Doctor',
  'Camp-Coordinator',
  'Scheme-Coordinator',
  'Field-Health-Worker',
]);

// Role categories for organization
export const userRoleCategoryEnum = pgEnum('user_role_category_enum', [
  'Medical',
  'Nursing',
  'Diagnostic',
  'Pharmacy',
  'Administrative',
  'Support-Services',
  'Allied-Health',
  'Indian-Healthcare',
  'Management',
]);

// Employment types
export const employmentTypeEnum = pgEnum('employment_type_enum', [
  'Permanent',
  'Contract',
  'Part-Time',
  'Visiting',
  'Intern',
  'Resident',
  'Volunteer',
  'Consultant',
  'Temporary',
]);

// Shift types for duty management
export const shiftTypeEnum = pgEnum('shift_type_enum', [
  'Morning',
  'Evening',
  'Night',
  'Rotating',
  'On-Call',
  'Day-Shift',
  'Split-Shift',
  'Flexible',
]);

// Healthcare specific enums
export const genderEnum = pgEnum('gender_enum', ['Male', 'Female', 'Other']);
export const bloodGroupEnum = pgEnum('blood_group_enum', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
export const userStatusEnum = pgEnum('user_status_enum', ['Active', 'Inactive', 'Suspended', 'Terminated']);
export const patientStatusEnum = pgEnum('patient_status_enum', ['admitted', 'outpatient', 'discharged', 'emergency', 'inactive', 'deceased']);
export const appointmentStatusEnum = pgEnum('appointment_status_enum', ['Scheduled', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled', 'No-Show', 'Rescheduled']);
export const queueStatusEnum = pgEnum('queue_status_enum', ['Waiting', 'Called', 'In-Progress', 'Completed', 'Skipped']);
export const bedStatusEnum = pgEnum('bed_status_enum', ['Available', 'Occupied', 'Under-Maintenance', 'Blocked', 'Dirty']);
export const billStatusEnum = pgEnum('bill_status_enum', ['Draft', 'Pending', 'Partially-Paid', 'Paid', 'Overdue', 'Cancelled']);
export const paymentMethodEnum = pgEnum('payment_method_enum', ['Cash', 'Card', 'UPI', 'Net-Banking', 'Cheque', 'DD', 'Insurance']);

// Medication administration routes
export const medicationRouteEnum = pgEnum('medication_route_enum', [
  'Oral',
  'IV',
  'IM',
  'SC',
  'Topical',
  'Inhalation',
  'Rectal',
  'Sublingual',
  'Buccal',
  'Nasal',
  'Ophthalmic',
  'Otic',
]);

// Nursing note types
export const nursingNoteTypeEnum = pgEnum('nursing_note_type_enum', [
  'Admission',
  'Routine',
  'Procedure',
  'Education',
  'Discharge',
  'Incident',
  'Handover',
  'Assessment',
  'Medication',
  'Progress',
]);

// Audit and compliance enums
export const auditActionEnum = pgEnum('audit_action_enum', ['create', 'read', 'update', 'delete', 'emergency_access']);
export const auditResourceEnum = pgEnum('audit_resource_enum', [
  'patient',
  'medical_record',
  'prescription',
  'appointment',
  'admission',
  'consultation',
  'lab_test',
  'imaging',
  'billing',
  'user',
  'role',
  'department',
  'audit_log',
  'system_setting',
  'sso_connection',
]);
export const severityEnum = pgEnum('severity_enum', ['low', 'medium', 'high', 'critical']);

// Communication enums
export const messageStatusEnum = pgEnum('message_status_enum', ['pending', 'sent', 'delivered', 'failed', 'read']);
export const communicationTypeEnum = pgEnum('communication_type_enum', ['sms', 'whatsapp', 'email', 'voice_call', 'push_notification']);

// Government schemes enum
export const governmentSchemeEnum = pgEnum('government_scheme_enum', [
  'Ayushman-Bharat',
  'CGHS',
  'ESIC',
  'State-Scheme',
  'ECHS',
  'Railway-Medical',
  'Jan-Aushadhi',
  'Pradhan-Mantri-Suraksha-Bima',
  'Rashtriya-Swasthya-Bima',
]);

// Family relationship enums
export const familyRelationshipEnum = pgEnum('family_relationship_enum', [
  // Immediate Family
  'SELF',
  'SPOUSE',
  'FATHER',
  'MOTHER',
  'SON',
  'DAUGHTER',
  'BROTHER',
  'SISTER',
  // Extended Family
  'GRANDFATHER',
  'GRANDMOTHER',
  'GRANDSON',
  'GRANDDAUGHTER',
  'UNCLE',
  'AUNT',
  'NEPHEW',
  'NIECE',
  'COUSIN',
  // In-Laws
  'FATHER_IN_LAW',
  'MOTHER_IN_LAW',
  'SON_IN_LAW',
  'DAUGHTER_IN_LAW',
  'BROTHER_IN_LAW',
  'SISTER_IN_LAW',
  // Guardian/Other
  'GUARDIAN',
  'CARETAKER',
  'FRIEND',
  'OTHER',
]);

export const relationshipCategoryEnum = pgEnum('relationship_category_enum', [
  'Immediate',
  'Extended',
  'Guardian',
  'Other',
]);

export const familyMemberStatusEnum = pgEnum('family_member_status_enum', [
  'Active',
  'Inactive',
  'Deceased',
]);

export const familyIncomeCategoryEnum = pgEnum('family_income_category_enum', [
  'BPL',
  'APL',
  'AAY',
  'Others',
]);

export const familyAppointmentTypeEnum = pgEnum('family_appointment_type_enum', [
  'Family-Checkup',
  'Vaccination',
  'Consultation',
  'Health-Camp',
  'Other',
]);

export const legalDocumentTypeEnum = pgEnum('legal_document_type_enum', [
  'Birth-Certificate',
  'Court-Order',
  'Notarized-Letter',
  'Other',
]);

export const policyTypeEnum = pgEnum('policy_type_enum', [
  'Family-Floater',
  'Individual-Sum-Insured',
  'Group-Cover',
]);

export const conditionSeverityEnum = pgEnum('condition_severity_enum', [
  'Mild',
  'Moderate',
  'Severe',
  'Fatal',
]);

// ============================================================================
// ICU MANAGEMENT ENUMS
// ============================================================================

export const icuBedTypeEnum = pgEnum('icu_bed_type_enum', [
  'General',
  'Isolation',
  'Cardiac',
  'Neurological',
  'Pediatric',
  'Neonatal',
]);

export const icuBedStatusEnum = pgEnum('icu_bed_status_enum', [
  'Available',
  'Occupied',
  'Maintenance',
  'Isolation',
  'Reserved',
  'Out-of-Service',
]);

export const icuAlertTypeEnum = pgEnum('icu_alert_type_enum', [
  'Vital-Critical',
  'Equipment-Failure',
  'Medication-Due',
  'Protocol-Violation',
  'Emergency-Response',
  'Staff-Required',
]);

export const icuAlertSeverityEnum = pgEnum('icu_alert_severity_enum', [
  'Low',
  'Medium',
  'High',
  'Critical',
  'Emergency',
]);

export const icuShiftTypeEnum = pgEnum('icu_shift_type_enum', [
  'Morning',
  'Evening', 
  'Night',
  'Extended',
]);

export const icuShiftStatusEnum = pgEnum('icu_shift_status_enum', [
  'Scheduled',
  'Active',
  'Completed',
  'Missed',
  'Cancelled',
]);

export const carePlanStatusEnum = pgEnum('care_plan_status_enum', [
  'Active',
  'Completed',
  'Overdue',
  'Cancelled',
  'On-Hold',
]);

export const equipmentStatusEnum = pgEnum('equipment_status_enum', [
  'Functional',
  'Maintenance-Required',
  'Critical-Failure',
  'Calibration-Due',
  'Out-of-Service',
]);

export const equipmentTypeEnum = pgEnum('equipment_type_enum', [
  'Ventilator',
  'Cardiac-Monitor',
  'Infusion-Pump',
  'Defibrillator',
  'Oxygen-Concentrator',
  'IABP',
  'ECMO',
  'Dialysis-Machine',
]);

// ============================================================================
// CORE TABLES
// ============================================================================

// Multi-hospital network configuration
export const hospitalNetworks = coreSchema.table('hospital_networks', {
  networkId: uuid('network_id').primaryKey().defaultRandom(),
  networkName: varchar('network_name', { length: 200 }).notNull(),
  networkCode: varchar('network_code', { length: 50 }).unique().notNull(),

  // Network details
  headquartersAddress: text('headquarters_address'),
  totalHospitals: integer('total_hospitals').default(0),
  totalBeds: integer('total_beds').default(0),

  // Contact
  contactPerson: varchar('contact_person', { length: 200 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  contactEmail: varchar('contact_email', { length: 100 }),

  // Configuration
  sharedPatientRecords: boolean('shared_patient_records').default(true),
  sharedInventory: boolean('shared_inventory').default(false),
  centralizedBilling: boolean('centralized_billing').default(false),

  // Standard fields
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Clinics/Hospitals (Enhanced for networks)
export const clinics = coreSchema.table('clinics', {
  clinicId: uuid('clinic_id').primaryKey().defaultRandom(),
  networkId: uuid('network_id').references(() => hospitalNetworks.networkId),

  // Basic information
  clinicName: varchar('clinic_name', { length: 200 }).notNull(),
  clinicCode: varchar('clinic_code', { length: 50 }).unique().notNull(),
  clinicType: varchar('clinic_type', { length: 100 }).default('Private'),

  // Indian healthcare registration
  registrationNumber: varchar('registration_number', { length: 100 }),
  ayushmanBharatId: varchar('ayushman_bharat_id', { length: 100 }),
  cghsEmpanelmentNumber: varchar('cghs_empanelment_number', { length: 100 }),
  esicRegistrationNumber: varchar('esic_registration_number', { length: 100 }),

  // Contact information
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).default('India'),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  website: varchar('website', { length: 200 }),

  // Capacity
  totalBeds: integer('total_beds').default(0),
  icuBeds: integer('icu_beds').default(0),
  emergencyBeds: integer('emergency_beds').default(0),

  // Services
  servicesOffered: text('services_offered').array(),
  specialties: text('specialties').array(),

  // Timing
  operatingHours: jsonb('operating_hours'), // {day: {start_time, end_time, is_closed}}
  emergencyServices24x7: boolean('emergency_services_24x7').default(false),

  // Configuration
  multiTenant: boolean('multi_tenant').default(true),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Kolkata'),
  defaultLanguage: varchar('default_language', { length: 10 }).default('en'),

  // Standard fields
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Departments (Enhanced)
export const departments = coreSchema.table('departments', {
  departmentId: uuid('department_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Department details
  departmentName: varchar('department_name', { length: 100 }).notNull(),
  departmentCode: varchar('department_code', { length: 20 }).notNull(),
  departmentType: varchar('department_type', { length: 50 }), // Clinical, Non-Clinical, Support

  // Head of department
  hodId: uuid('hod_id'), // Will reference users table

  // Location
  floorNumber: integer('floor_number'),
  wing: varchar('wing', { length: 50 }),

  // Capacity
  totalStaff: integer('total_staff').default(0),
  bedCapacity: integer('bed_capacity').default(0),

  // Services
  servicesProvided: text('services_provided').array(),
  equipmentAvailable: text('equipment_available').array(),

  // Operational
  isRevenueGenerating: boolean('is_revenue_generating').default(true),
  isEmergencyService: boolean('is_emergency_service').default(false),
  operates24x7: boolean('operates_24x7').default(false),

  // Standard fields
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  uniqueClinicDeptCode: uniqueIndex('unique_clinic_dept_code').on(table.clinicId, table.departmentCode),
}));

// Enhanced Users table with comprehensive role management
export const users = coreSchema.table('users', {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Basic information
  username: varchar('username', { length: 100 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),

  // Personal details
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),

  // Enhanced role management
  role: userRoleEnum('role').notNull().default('Support-Staff'),
  roleCategory: userRoleCategoryEnum('role_category'),
  secondaryRole: userRoleEnum('secondary_role'), // For users with multiple roles

  // Employment details
  employmentType: employmentTypeEnum('employment_type').default('Permanent'),
  employeeCode: varchar('employee_code', { length: 50 }).unique(),
  reportingTo: uuid('reporting_to'), // Self-reference to users
  departmentId: uuid('department_id').references(() => departments.departmentId),

  // Scheduling and shifts
  shiftType: shiftTypeEnum('shift_type').default('Day-Shift'),
  weeklyOffDays: integer('weekly_off_days').array().default([0, 6]), // Sunday=0, Saturday=6
  joiningDate: date('joining_date'),
  relievingDate: date('relieving_date'),

  // Visiting consultant details
  isVisiting: boolean('is_visiting').default(false),
  visitingDays: integer('visiting_days').array(), // Days of week when visiting
  visitingTimeStart: time('visiting_time_start'),
  visitingTimeEnd: time('visiting_time_end'),
  consultationFee: decimal('consultation_fee', { precision: 10, scale: 2 }),

  // Capabilities and certifications
  canWorkInEmergency: boolean('can_work_in_emergency').default(false),
  canWorkInIcu: boolean('can_work_in_icu').default(false),
  canWorkInOt: boolean('can_work_in_ot').default(false),
  licenseNumber: varchar('license_number', { length: 100 }),
  licenseExpiryDate: date('license_expiry_date'),
  certifications: jsonb('certifications'), // Array of certification objects

  // Emergency contact (Encrypted)
  emergencyContactName: varchar('emergency_contact_name', { length: 200 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 20 }),
  emergencyContactPhoneEncrypted: text('emergency_contact_phone_encrypted'),
  bloodGroup: bloodGroupEnum('blood_group'),

  // Contact information
  phone: varchar('phone', { length: 20 }).unique(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),

  // Professional details
  registrationNumber: varchar('registration_number', { length: 100 }),
  qualification: varchar('qualification', { length: 200 }),
  specialization: varchar('specialization', { length: 200 }),
  experienceYears: integer('experience_years'),

  // Permissions
  isAdmin: boolean('is_admin').default(false),
  canLogin: boolean('can_login').default(true),

  // Status
  status: userStatusEnum('status').default('Active'),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login', { mode: 'date' }),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by'), // Self-reference
  updatedBy: uuid('updated_by'), // Self-reference
  version: integer('version').default(1),
});

// ============================================================================
// HEALTHCARE CORE TABLES
// ============================================================================

// Patients table (Enhanced for Indian healthcare)
export const patients = coreSchema.table('patients', {
  patientId: uuid('patient_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Basic information
  patientCode: varchar('patient_code', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  dateOfBirth: date('date_of_birth').notNull(),
  age: integer('age'),
  gender: genderEnum('gender').notNull(),

  // Contact information (Encrypted for privacy)
  phone: varchar('phone', { length: 20 }),
  phoneEncrypted: text('phone_encrypted'), // Encrypted primary phone
  alternatePhone: varchar('alternate_phone', { length: 20 }),
  email: varchar('email', { length: 100 }),

  // Address
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }).default('India'),
  pincode: varchar('pincode', { length: 10 }),

  // Identity documents (Indian specific)
  aadhaarNumber: varchar('aadhaar_number', { length: 12 }),
  aadhaarNumberEncrypted: text('aadhaar_number_encrypted'), // Encrypted Aadhaar
  panNumber: varchar('pan_number', { length: 10 }),
  voterId: varchar('voter_id', { length: 20 }),

  // Medical information
  bloodGroup: bloodGroupEnum('blood_group'),
  allergies: text('allergies').array(),
  chronicConditions: text('chronic_conditions').array(),

  // Emergency contact (Encrypted)
  emergencyContactName: varchar('emergency_contact_name', { length: 200 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 20 }),
  emergencyContactPhoneEncrypted: text('emergency_contact_phone_encrypted'),
  emergencyContactRelation: varchar('emergency_contact_relation', { length: 50 }),

  // Insurance and schemes
  insuranceDetails: jsonb('insurance_details'),
  governmentSchemeNumber: varchar('government_scheme_number', { length: 100 }),

  // ABHA integration (Ayushman Bharat Health Account)
  abhaNumber: varchar('abha_number', { length: 17 }),
  abhaAddress: varchar('abha_address', { length: 100 }),

  // Statistics
  totalVisits: integer('total_visits').default(0),
  lastVisitDate: timestamp('last_visit_date', { mode: 'date' }),

  // Status
  isActive: boolean('is_active').default(true),
  isVip: boolean('is_vip').default(false),
  status: patientStatusEnum('status').default('outpatient'),
  // Admission tracking
  admissionDate: timestamp('admission_date', { mode: 'date' }),
  dischargeDate: timestamp('discharge_date', { mode: 'date' }),
  currentDepartmentId: uuid('current_department_id').references(() => departments.departmentId),
  admissionReason: text('admission_reason'),
  dischargeReason: text('discharge_reason'),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
  updatedBy: uuid('updated_by').references(() => users.userId),

}, table => ({
  uniqueClinicPatientCode: uniqueIndex('unique_clinic_patient_code').on(table.clinicId, table.patientCode),
}));

// ============================================================================
// DUTY ROSTER AND SCHEDULING
// ============================================================================

// Doctor schedules with OPD timings
export const doctorSchedules = coreSchema.table('doctor_schedules', {
  scheduleId: uuid('schedule_id').primaryKey().defaultRandom(),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  departmentId: uuid('department_id').notNull().references(() => departments.departmentId),

  // Schedule details
  dayOfWeek: integer('day_of_week'), // 0=Sunday
  scheduleDate: date('schedule_date', { mode: 'date' }),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),

  // Consultation settings
  consultationDuration: integer('consultation_duration').default(15), // minutes
  maxAppointments: integer('max_appointments'),
  bufferTime: integer('buffer_time').default(5), // minutes between appointments

  // Schedule type
  scheduleType: varchar('schedule_type', { length: 20 }).default('Regular'),

  // Availability
  isActive: boolean('is_active').default(true),
  effectiveFrom: date('effective_from', { mode: 'date' }).notNull().defaultNow(),
  effectiveTill: date('effective_till', { mode: 'date' }),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  createdBy: uuid('created_by').references(() => users.userId),
  updatedBy: uuid('updated_by').references(() => users.userId),
});

// Schedule exceptions (leaves, holidays, unavailability)
export const scheduleExceptions = coreSchema.table('schedule_exceptions', {
  exceptionId: uuid('exception_id').primaryKey().defaultRandom(),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Exception details
  exceptionType: varchar('exception_type', { length: 50 }).notNull().default('Leave'),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),

  // Date and time ranges
  startDate: date('start_date', { mode: 'date' }).notNull(),
  endDate: date('end_date', { mode: 'date' }).notNull(),
  startTime: time('start_time'), // Optional for partial day exceptions
  endTime: time('end_time'), // Optional for partial day exceptions

  // Status and approval
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  approvedBy: uuid('approved_by').references(() => users.userId),
  approvedAt: timestamp('approved_at', { mode: 'date' }),

  // Recurrence
  isRecurring: boolean('is_recurring').default(false),
  recurrencePattern: varchar('recurrence_pattern', { length: 100 }),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
  updatedBy: uuid('updated_by').references(() => users.userId),
});

// Department services
export const departmentServices = coreSchema.table('department_services', {
  serviceId: uuid('service_id').primaryKey().defaultRandom(),
  departmentId: uuid('department_id').notNull().references(() => departments.departmentId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Service details
  serviceName: varchar('service_name', { length: 200 }).notNull(),
  serviceCode: varchar('service_code', { length: 50 }).notNull(),
  description: text('description'),

  // Service settings
  category: varchar('category', { length: 100 }),
  subCategory: varchar('sub_category', { length: 100 }),
  defaultDuration: integer('default_duration').default(30), // minutes

  // Pricing and billing
  basePrice: decimal('base_price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('INR'),

  // Service availability
  isActive: boolean('is_active').default(true),
  isEmergencyService: boolean('is_emergency_service').default(false),
  requires24x7: boolean('requires_24x7').default(false),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
  updatedBy: uuid('updated_by').references(() => users.userId),
}, table => ({
  uniqueDeptServiceCode: uniqueIndex('unique_dept_service_code').on(table.departmentId, table.serviceCode),
}));

// Queue management
export const queueEntries = coreSchema.table('queue_entries', {
  queueId: uuid('queue_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  departmentId: uuid('department_id').notNull().references(() => departments.departmentId),

  // Queue details
  queueDate: date('queue_date').notNull().defaultNow(),
  tokenNumber: integer('token_number').notNull(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').references(() => users.userId),

  // Status
  status: queueStatusEnum('status').default('Waiting'),
  priority: integer('priority').default(0),

  // Timing
  arrivalTime: timestamp('arrival_time', { mode: 'date' }).defaultNow(),
  calledTime: timestamp('called_time', { mode: 'date' }),
  consultationStartTime: timestamp('consultation_start_time', { mode: 'date' }),
  consultationEndTime: timestamp('consultation_end_time', { mode: 'date' }),

  // Queue type
  queueType: varchar('queue_type', { length: 50 }).default('OPD'),
  serviceType: varchar('service_type', { length: 100 }),

  // Link to appointment if scheduled
  appointmentId: uuid('appointment_id'),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, table => ({
  uniqueClinicQueueToken: uniqueIndex('unique_clinic_queue_token').on(table.clinicId, table.queueDate, table.queueType, table.tokenNumber),
}));

// ============================================================================
// FAMILY RELATIONSHIP MANAGEMENT TABLES
// ============================================================================

// Relationship types lookup table
export const relationshipTypes = coreSchema.table('relationship_types', {
  relationshipId: integer('relationship_id').primaryKey().generatedByDefaultAsIdentity(),
  relationshipCode: familyRelationshipEnum('relationship_code').unique().notNull(),
  relationshipName: varchar('relationship_name', { length: 50 }).notNull(),
  relationshipNameHindi: varchar('relationship_name_hindi', { length: 50 }),
  relationshipNameLocal: varchar('relationship_name_local', { length: 50 }),
  reverseRelationship: varchar('reverse_relationship', { length: 50 }),
  category: relationshipCategoryEnum('category'),
  isBloodRelation: boolean('is_blood_relation').default(false),
  isLegalGuardian: boolean('is_legal_guardian').default(false),
  displayOrder: integer('display_order'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Family Groups (Households)
export const familyGroups = coreSchema.table('family_groups', {
  familyId: uuid('family_id').primaryKey().defaultRandom(),
  familyCode: varchar('family_code', { length: 20 }).unique().notNull(),
  familyName: varchar('family_name', { length: 200 }),

  // Primary contact/head of family
  primaryMemberId: uuid('primary_member_id').references(() => patients.patientId),

  // Address (shared household address)
  addressLine1: varchar('address_line1', { length: 500 }),
  addressLine2: varchar('address_line2', { length: 500 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),

  // Contact
  primaryPhone: varchar('primary_phone', { length: 20 }),
  secondaryPhone: varchar('secondary_phone', { length: 20 }),
  email: varchar('email', { length: 200 }),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  isActive: boolean('is_active').default(true),

  // Indian specific
  rationCardNumber: varchar('ration_card_number', { length: 50 }),
  familyIncomeCategory: familyIncomeCategoryEnum('family_income_category'),
});

// Family Members with Relationships
export const familyMembers = coreSchema.table('family_members', {
  memberId: uuid('member_id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => familyGroups.familyId, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),

  // Relationship to primary member
  relationshipToPrimary: familyRelationshipEnum('relationship_to_primary'),

  // Additional relationships (for complex families)
  relationshipDetails: jsonb('relationship_details').default({}),

  // Member details
  isPrimaryMember: boolean('is_primary_member').default(false),
  isEarningMember: boolean('is_earning_member').default(false),
  isDependent: boolean('is_dependent').default(true),

  // Consent and sharing
  shareMedicalHistory: boolean('share_medical_history').default(false),
  shareInsurance: boolean('share_insurance').default(true),
  shareBilling: boolean('share_billing').default(true),
  consentDate: timestamp('consent_date', { mode: 'date' }),
  consentBy: uuid('consent_by').references(() => users.userId),

  // Status
  joinDate: date('join_date').defaultNow(),
  leaveDate: date('leave_date'),
  status: familyMemberStatusEnum('status').default('Active'),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  uniqueFamilyPatient: uniqueIndex('unique_family_patient').on(table.familyId, table.patientId),
}));

// Family Medical History (Structured)
export const familyMedicalHistory = clinicalSchema.table('family_medical_history', {
  historyId: uuid('history_id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => familyGroups.familyId, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').references(() => patients.patientId),

  // Condition details
  conditionName: varchar('condition_name', { length: 200 }).notNull(),
  icd10Code: varchar('icd10_code', { length: 10 }),

  // Affected members
  affectedRelationship: familyRelationshipEnum('affected_relationship'),
  affectedCount: integer('affected_count').default(1),

  // Details
  ageOfOnset: integer('age_of_onset'),
  severity: conditionSeverityEnum('severity'),
  isHereditary: boolean('is_hereditary').default(false),

  // Additional information
  notes: text('notes'),

  // Metadata
  reportedBy: uuid('reported_by').notNull().references(() => patients.patientId),
  reportedDate: date('reported_date').defaultNow(),
  verifiedBy: uuid('verified_by').references(() => users.userId),
  verificationDate: timestamp('verification_date', { mode: 'date' }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Guardian Relationships (for minors/special needs)
export const guardianRelationships = coreSchema.table('guardian_relationships', {
  guardianId: uuid('guardian_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  guardianPatientId: uuid('guardian_patient_id').notNull().references(() => patients.patientId),

  // Guardian details
  relationshipType: familyRelationshipEnum('relationship_type').notNull(),
  isPrimaryGuardian: boolean('is_primary_guardian').default(false),

  // Legal details
  legalDocumentType: legalDocumentTypeEnum('legal_document_type'),
  documentNumber: varchar('document_number', { length: 100 }),
  documentCopy: varchar('document_copy', { length: 500 }), // File path or blob reference

  // Permissions
  canConsentMedical: boolean('can_consent_medical').default(true),
  canAccessRecords: boolean('can_access_records').default(true),
  canApproveProcedures: boolean('can_approve_procedures').default(false),

  // Validity
  effectiveFrom: date('effective_from').defaultNow(),
  effectiveUntil: date('effective_until'),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
  verifiedBy: uuid('verified_by').references(() => users.userId),
  verificationDate: timestamp('verification_date', { mode: 'date' }),
});

// Family Insurance Coverage
export const familyInsurance = insuranceSchema.table('family_insurance', {
  familyInsuranceId: uuid('family_insurance_id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => familyGroups.familyId, { onDelete: 'cascade' }),

  // Policy details
  insuranceProvider: varchar('insurance_provider', { length: 100 }).notNull(),
  policyNumber: varchar('policy_number', { length: 100 }).unique().notNull(),
  policyType: policyTypeEnum('policy_type'),

  // Coverage
  totalSumInsured: decimal('total_sum_insured', { precision: 12, scale: 2 }),
  remainingSumInsured: decimal('remaining_sum_insured', { precision: 12, scale: 2 }),

  // Members covered
  coveredMembers: jsonb('covered_members').default([]),
  primaryMemberId: uuid('primary_member_id').references(() => patients.patientId),

  // Validity
  policyStartDate: date('policy_start_date').notNull(),
  policyEndDate: date('policy_end_date').notNull(),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  isActive: boolean('is_active').default(true),
});

// Family Appointments (Group bookings)
export const familyAppointments = appointmentsSchema.table('family_appointments', {
  familyAppointmentId: uuid('family_appointment_id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => familyGroups.familyId, { onDelete: 'cascade' }),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Appointment details
  appointmentDate: date('appointment_date').notNull(),
  appointmentTime: time('appointment_time').notNull(),
  appointmentType: familyAppointmentTypeEnum('appointment_type'),

  // Members included
  memberAppointments: jsonb('member_appointments').default([]),

  // Booking details
  bookedBy: uuid('booked_by').notNull().references(() => patients.patientId),
  bookedAt: timestamp('booked_at', { mode: 'date' }).defaultNow(),

  // Status
  status: appointmentStatusEnum('status').default('Scheduled'),
  cancellationReason: text('cancellation_reason'),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// ============================================================================
// ICU MANAGEMENT TABLES - Phase 1 Essential
// ============================================================================

// 1. ICU Beds Management - Real-time bed status and patient assignment
export const icuBeds = clinicalSchema.table('icu_beds', {
  icuBedId: uuid('icu_bed_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  departmentId: uuid('department_id').notNull().references(() => departments.departmentId),

  // Bed identification
  bedNumber: varchar('bed_number', { length: 10 }).notNull(),
  bedType: icuBedTypeEnum('bed_type').default('General').notNull(),
  
  // Patient assignment
  patientId: uuid('patient_id').references(() => patients.patientId),
  
  // Status and availability
  status: icuBedStatusEnum('status').default('Available').notNull(),
  lastSanitized: timestamp('last_sanitized', { mode: 'date' }),
  
  // Equipment and monitoring
  monitoringEquipment: jsonb('monitoring_equipment').default({}), // Equipment attached to bed
  cardiacMonitoringLevel: varchar('cardiac_monitoring_level', { length: 20 }), // basic, advanced, swan_ganz
  telemetryEnabled: boolean('telemetry_enabled').default(false),
  
  // Indian healthcare compliance
  oxygenSupplyType: varchar('oxygen_supply_type', { length: 20 }).default('Central'), // Central, Cylinder, Concentrator
  backupOxygenAvailable: boolean('backup_oxygen_available').default(false),
  isolationCapable: boolean('isolation_capable').default(false),

  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  uniqueClinicBed: uniqueIndex('unique_clinic_bed').on(table.clinicId, table.bedNumber),
}));

// 2. ICU Nursing Care Plans - Structured nursing care and compliance tracking
export const icuNursingCarePlans = clinicalSchema.table('icu_nursing_care_plans', {
  carePlanId: uuid('care_plan_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  icuBedId: uuid('icu_bed_id').notNull().references(() => icuBeds.icuBedId),
  
  // Care assignment
  assignedNurseId: uuid('assigned_nurse_id').notNull().references(() => users.userId),
  carePlanTemplateId: uuid('care_plan_template_id'), // Future: link to care plan templates
  
  // Care instructions and protocols
  careInstructions: jsonb('care_instructions').notNull(), // Structured nursing instructions
  cardiacProtocolId: uuid('cardiac_protocol_id'), // Links to cardiac care protocols
  frequencyHours: integer('frequency_hours').default(2), // How often to assess (hours)
  
  // Assessment scheduling
  nextAssessmentDue: timestamp('next_assessment_due', { mode: 'date' }),
  lastAssessmentCompleted: timestamp('last_assessment_completed', { mode: 'date' }),
  
  // Cardiac-specific tracking
  fluidBalanceTarget: integer('fluid_balance_target'), // Critical for cardiac patients (ml)
  cardiacMedications: jsonb('cardiac_medications').default([]), // Specialized cardiac drugs
  
  // Compliance and status
  complianceStatus: carePlanStatusEnum('compliance_status').default('Active'),
  compliancePercentage: decimal('compliance_percentage', { precision: 5, scale: 2 }),
  
  // ISCCM compliance tracking
  nursePatientRatio: decimal('nurse_patient_ratio', { precision: 3, scale: 1 }).default('2.0'), // 1:2 per ISCCM
  
  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
});

// 3. ICU Critical Alerts - Patient safety alerts and escalation management
export const icuCriticalAlerts = clinicalSchema.table('icu_critical_alerts', {
  alertId: uuid('alert_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  icuBedId: uuid('icu_bed_id').notNull().references(() => icuBeds.icuBedId),
  
  // Alert details
  alertType: icuAlertTypeEnum('alert_type').notNull(),
  severity: icuAlertSeverityEnum('severity').notNull(),
  message: text('message').notNull(),
  alertData: jsonb('alert_data').default({}), // Additional alert context (vital values, etc.)
  
  // Response tracking
  acknowledgedBy: uuid('acknowledged_by').references(() => users.userId),
  acknowledgedAt: timestamp('acknowledged_at', { mode: 'date' }),
  resolvedBy: uuid('resolved_by').references(() => users.userId),
  resolvedAt: timestamp('resolved_at', { mode: 'date' }),
  responseTimeMinutes: integer('response_time_minutes'),
  
  // Escalation
  escalatedTo: uuid('escalated_to').references(() => users.userId),
  escalatedAt: timestamp('escalated_at', { mode: 'date' }),
  
  // Indian compliance
  reportedToAuthorities: boolean('reported_to_authorities').default(false), // For serious incidents
  incidentReportNumber: varchar('incident_report_number', { length: 50 }),
  
  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  isActive: boolean('is_active').default(true),
});

// 4. ICU Staff Shifts - Shift management and handover documentation
export const icuStaffShifts = coreSchema.table('icu_staff_shifts', {
  shiftId: uuid('shift_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  departmentId: uuid('department_id').notNull().references(() => departments.departmentId), // ICU department
  
  // Staff assignment
  staffId: uuid('staff_id').notNull().references(() => users.userId),
  shiftType: icuShiftTypeEnum('shift_type').notNull(),
  
  // Shift timing
  shiftDate: date('shift_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  actualStartTime: timestamp('actual_start_time', { mode: 'date' }),
  actualEndTime: timestamp('actual_end_time', { mode: 'date' }),
  
  // Patient assignments
  patientAssignments: jsonb('patient_assignments').default([]), // Array of patient IDs assigned
  maxPatientCapacity: integer('max_patient_capacity').default(2), // Per ISCCM guidelines
  
  // Handover documentation
  handoverNotes: text('handover_notes'),
  handoverReceivedFrom: uuid('handover_received_from').references(() => users.userId),
  handoverGivenTo: uuid('handover_given_to').references(() => users.userId),
  handoverCompletedAt: timestamp('handover_completed_at', { mode: 'date' }),
  
  // Shift status and compliance
  status: icuShiftStatusEnum('status').default('Scheduled'),
  
  // ISCCM compliance
  minimumStaffRatioCompliance: boolean('minimum_staff_ratio_compliance').default(false),
  specialistAvailability: varchar('specialist_availability', { length: 20 }).default('Available'), // Available, On-Call, Unavailable
  
  // Emergency coverage
  emergencyContactNumber: varchar('emergency_contact_number', { length: 15 }),
  backupStaffId: uuid('backup_staff_id').references(() => users.userId),
  
  // Metadata
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, (table) => ({
  uniqueStaffShift: uniqueIndex('unique_staff_shift').on(table.staffId, table.shiftDate, table.shiftType),
}));

// ============================================================================
// APPOINTMENTS AND SCHEDULING
// ============================================================================

// Appointments table (partitioned by date)
export const appointments = appointmentsSchema.table('appointments', {
  appointmentId: uuid('appointment_id').primaryKey().defaultRandom(),
  appointmentCode: varchar('appointment_code', { length: 20 }).notNull(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Patient and doctor
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  departmentId: uuid('department_id').notNull().references(() => departments.departmentId),

  // Appointment details
  appointmentDate: date('appointment_date').notNull(),
  appointmentTime: time('appointment_time').notNull(),
  appointmentEndTime: time('appointment_end_time'),
  appointmentType: varchar('appointment_type', { length: 50 }).default('Consultation'),
  visitType: varchar('visit_type', { length: 20 }).default('First-Visit'),

  // Status tracking
  status: appointmentStatusEnum('status').default('Scheduled'),
  checkedInAt: timestamp('checked_in_at', { mode: 'date' }),
  consultationStartAt: timestamp('consultation_start_at', { mode: 'date' }),
  consultationEndAt: timestamp('consultation_end_at', { mode: 'date' }),

  // Queue management
  tokenNumber: integer('token_number'),
  queuePriority: integer('queue_priority').default(0),

  // Scheduling metadata
  scheduledBy: uuid('scheduled_by').references(() => users.userId),
  scheduledAt: timestamp('scheduled_at', { mode: 'date' }).defaultNow(),
  rescheduledFrom: uuid('rescheduled_from'), // Self-reference
  cancellationReason: text('cancellation_reason'),
  cancelledBy: uuid('cancelled_by').references(() => users.userId),

  // Fees
  consultationFee: decimal('consultation_fee', { precision: 10, scale: 2 }),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  discountReason: varchar('discount_reason', { length: 200 }),

  // Notes
  chiefComplaint: text('chief_complaint'),
  appointmentNotes: text('appointment_notes'),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  isDeleted: boolean('is_deleted').default(false),
  version: integer('version').default(1),
}, table => ({
  uniqueClinicAppointmentCode: uniqueIndex('unique_clinic_appointment_code').on(table.clinicId, table.appointmentCode),
}));

// ============================================================================
// CLINICAL WORKFLOW TABLES
// ============================================================================

// Consultations
export const consultations = clinicalSchema.table('consultations', {
  consultationId: uuid('consultation_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  appointmentId: uuid('appointment_id').references(() => appointments.appointmentId),

  // Consultation details
  consultationDate: timestamp('consultation_date', { mode: 'date' }).defaultNow(),
  consultationType: varchar('consultation_type', { length: 50 }).default('OPD'),

  // Vitals (captured during consultation)
  vitals: jsonb('vitals'), // {bp_systolic, bp_diastolic, pulse, temperature, weight, height, spo2}

  // Clinical findings
  chiefComplaint: text('chief_complaint'),
  historyOfPresentIllness: text('history_of_present_illness'),
  pastMedicalHistory: text('past_medical_history'),
  familyHistory: text('family_history'),
  socialHistory: text('social_history'),

  // Examination
  generalExamination: text('general_examination'),
  systemicExamination: text('systemic_examination'),
  localExamination: text('local_examination'),

  // Diagnosis
  provisionalDiagnosis: text('provisional_diagnosis').array(),
  finalDiagnosis: text('final_diagnosis').array(),
  icd10Codes: varchar('icd10_codes', { length: 10 }).array(),

  // Plan
  treatmentPlan: text('treatment_plan'),
  followUpDate: date('follow_up_date'),
  followUpInstructions: text('follow_up_instructions'),

  // Referrals
  referredTo: uuid('referred_to').references(() => users.userId),
  referralReason: text('referral_reason'),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
  updatedBy: uuid('updated_by').references(() => users.userId),
  isDeleted: boolean('is_deleted').default(false),
});

// Prescriptions
export const prescriptions = clinicalSchema.table('prescriptions', {
  prescriptionId: uuid('prescription_id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').notNull().references(() => consultations.consultationId),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),

  // Prescription details
  prescriptionDate: timestamp('prescription_date', { mode: 'date' }).defaultNow(),
  prescriptionCode: varchar('prescription_code', { length: 50 }).unique().notNull(),

  // Validity
  validTill: date('valid_till'),

  // Notes
  generalAdvice: text('general_advice'),
  dietAdvice: text('diet_advice'),

  // Encrypted diagnosis for HIPAA compliance
  diagnosisEncrypted: text('diagnosis_encrypted'),

  // Follow up
  followUpDate: date('follow_up_date'),
  followUpInstructions: text('follow_up_instructions'),

  // Status tracking
  status: varchar('status', { length: 20 }).default('active'),
  cancellationReason: text('cancellation_reason'),
  cancelledBy: uuid('cancelled_by').references(() => users.userId),
  cancelledAt: timestamp('cancelled_at', { mode: 'date' }),

  // Digital signature
  isSigned: boolean('is_signed').default(false),
  signedAt: timestamp('signed_at', { mode: 'date' }),
  signatureData: text('signature_data'),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  createdBy: uuid('created_by').references(() => users.userId),
});

// Prescription items table
export const prescriptionItems = clinicalSchema.table('prescription_items', {
  itemId: uuid('item_id').primaryKey().defaultRandom(),
  prescriptionId: uuid('prescription_id').notNull().references(() => prescriptions.prescriptionId),

  // Medicine details
  medicineName: varchar('medicine_name', { length: 200 }).notNull(),
  genericName: varchar('generic_name', { length: 200 }),
  medicineType: varchar('medicine_type', { length: 50 }), // Tablet, Capsule, Syrup, etc.
  strength: varchar('strength', { length: 50 }),

  // Dosage
  dosage: varchar('dosage', { length: 100 }),
  frequency: varchar('frequency', { length: 100 }), // BD, TDS, QID, SOS
  duration: varchar('duration', { length: 50 }), // 3 days, 1 week, etc.
  quantity: integer('quantity'),

  // Route
  route: varchar('route', { length: 50 }).default('oral'),

  // Instructions
  beforeFood: boolean('before_food').default(false),
  instructions: text('instructions'),

  // Controlled substance tracking
  isControlled: boolean('is_controlled').default(false),
  controlledSchedule: varchar('controlled_schedule', { length: 20 }), // schedule_h, schedule_h1, schedule_x, narcotics

  // Dispensing
  isDispensed: boolean('is_dispensed').default(false),
  dispensedQuantity: integer('dispensed_quantity'),
  dispensedBy: uuid('dispensed_by').references(() => users.userId),
  dispensedAt: timestamp('dispensed_at', { mode: 'date' }),

  // Order
  displayOrder: integer('display_order').default(1),
});

// ============================================================================
// AUDIT AND COMPLIANCE TABLES
// ============================================================================

// Enhanced audit logs table for healthcare compliance
export const auditLogs = auditSchema.table('audit_logs', {
  auditId: uuid('audit_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Actor information
  actorId: uuid('actor_id').notNull(), // User who performed the action
  actorName: varchar('actor_name', { length: 200 }).notNull(),
  actorEmail: varchar('actor_email', { length: 100 }),
  actorRole: varchar('actor_role', { length: 100 }),

  // Action details
  action: auditActionEnum('action').notNull(),
  resource: auditResourceEnum('resource').notNull(),
  resourceId: uuid('resource_id'), // ID of the affected resource
  resourceName: varchar('resource_name', { length: 200 }),

  // Change tracking
  changes: jsonb('changes'), // {before: {}, after: {}}

  // Request context
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  sessionId: varchar('session_id', { length: 100 }),
  requestId: varchar('request_id', { length: 100 }),

  // Outcome
  success: boolean('success').default(true).notNull(),
  errorMessage: text('error_message'),
  duration: integer('duration'), // Action duration in milliseconds

  // Healthcare specific fields
  flags: text('flags').array().default([]), // phi_access, emergency_access, etc.
  severity: severityEnum('severity').default('medium'),

  // Additional metadata
  metadata: jsonb('metadata').default({}),

  // Compliance and retention
  retentionPeriod: integer('retention_period').default(2555), // Days (7 years default for healthcare)

  // Audit trail
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ============================================================================
// COMMUNICATION SYSTEM (WhatsApp Integration)
// ============================================================================

// WhatsApp message templates
export const whatsappTemplates = communicationSchema.table('whatsapp_templates', {
  templateId: uuid('template_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Template details
  templateName: varchar('template_name', { length: 100 }).notNull(),
  templateCode: varchar('template_code', { length: 50 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // appointment, medication, report, emergency

  // WhatsApp template structure
  language: varchar('language', { length: 10 }).default('en'),
  headerType: varchar('header_type', { length: 20 }), // text, image, document
  headerContent: text('header_content'),
  bodyContent: text('body_content').notNull(),
  footerContent: text('footer_content'),

  // Variables/placeholders
  variables: jsonb('variables').default([]), // [{name, type, description}]

  // Status
  isActive: boolean('is_active').default(true),
  isApproved: boolean('is_approved').default(false),
  approvedBy: uuid('approved_by').references(() => users.userId),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  uniqueClinicTemplateCode: uniqueIndex('unique_clinic_template_code').on(table.clinicId, table.templateCode),
}));

// WhatsApp messages
export const whatsappMessages = communicationSchema.table('whatsapp_messages', {
  messageId: uuid('message_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Recipient details
  recipientPhone: varchar('recipient_phone', { length: 20 }).notNull(),
  recipientName: varchar('recipient_name', { length: 200 }),
  patientId: uuid('patient_id').references(() => patients.patientId),

  // Message details
  templateId: uuid('template_id').references(() => whatsappTemplates.templateId),
  messageType: communicationTypeEnum('message_type').default('whatsapp'),
  messageContent: text('message_content').notNull(),
  variables: jsonb('variables').default({}), // Variable values for template

  // Scheduling
  scheduledAt: timestamp('scheduled_at', { mode: 'date' }),
  sentAt: timestamp('sent_at', { mode: 'date' }),

  // Status tracking
  status: messageStatusEnum('status').default('pending'),
  deliveryStatus: varchar('delivery_status', { length: 50 }),
  failureReason: text('failure_reason'),

  // WhatsApp specific
  whatsappMessageId: varchar('whatsapp_message_id', { length: 100 }),
  conversationId: varchar('conversation_id', { length: 100 }),

  // Retry logic
  retryCount: integer('retry_count').default(0),
  maxRetries: integer('max_retries').default(3),
  nextRetryAt: timestamp('next_retry_at', { mode: 'date' }),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
});

// ============================================================================
// GOVERNMENT SCHEMES AND BILLING
// ============================================================================

// Government schemes configuration
export const governmentSchemes = billingSchema.table('government_schemes', {
  schemeId: uuid('scheme_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Scheme details
  schemeName: governmentSchemeEnum('scheme_name').notNull(),
  schemeCode: varchar('scheme_code', { length: 50 }).notNull(),
  description: text('description'),

  // Configuration
  isActive: boolean('is_active').default(true),
  empanelmentNumber: varchar('empanelment_number', { length: 100 }),
  empanelmentDate: date('empanelment_date'),
  validTill: date('valid_till'),

  // Coverage limits
  maxCoverageAmount: decimal('max_coverage_amount', { precision: 12, scale: 2 }),
  familySize: integer('family_size'),

  // Contact details
  nodOfficerName: varchar('nod_officer_name', { length: 200 }),
  nodOfficerContact: varchar('nod_officer_contact', { length: 20 }),

  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  uniqueClinicSchemeCode: uniqueIndex('unique_clinic_scheme_code').on(table.clinicId, table.schemeCode),
}));

// ============================================================================
// PHARMACY MANAGEMENT
// ============================================================================

// Medicine master data
export const medicineMaster = coreSchema.table('medicine_master', {
  medicineId: uuid('medicine_id').primaryKey().defaultRandom(),
  medicineCode: varchar('medicine_code', { length: 50 }).unique().notNull(),
  medicineName: varchar('medicine_name', { length: 200 }).notNull(),
  genericName: varchar('generic_name', { length: 200 }).notNull(),

  // Classification
  category: varchar('category', { length: 100 }).notNull(),
  drugClass: varchar('drug_class', { length: 100 }),
  scheduleType: varchar('schedule_type', { length: 20 }), // OTC, H, H1, X, G, J, C, C1

  // Formulation
  dosageForm: varchar('dosage_form', { length: 50 }).notNull(),
  strength: varchar('strength', { length: 50 }),

  // Manufacturer
  manufacturer: varchar('manufacturer', { length: 200 }),
  brandName: varchar('brand_name', { length: 200 }),

  // Storage
  storageConditions: varchar('storage_conditions', { length: 100 }),
  requiresRefrigeration: boolean('requires_refrigeration').default(false),
  lightSensitive: boolean('light_sensitive').default(false),

  // Regulatory
  drugLicenseNumber: varchar('drug_license_number', { length: 100 }),
  isBanned: boolean('is_banned').default(false),
  isNarcotic: boolean('is_narcotic').default(false),

  // Prescription Requirements
  prescriptionRequired: boolean('prescription_required').default(true),
  maxRetailPrice: decimal('max_retail_price', { precision: 10, scale: 2 }).notNull(),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Pharmacy inventory
export const pharmacyInventory = coreSchema.table('pharmacy_inventory', {
  inventoryId: uuid('inventory_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  medicineId: uuid('medicine_id').notNull().references(() => medicineMaster.medicineId),

  // Stock Information
  currentStock: integer('current_stock').notNull().default(0),
  unitOfMeasurement: varchar('unit_of_measurement', { length: 20 }).notNull(),

  // Batch Information
  batchNumber: varchar('batch_number', { length: 50 }),
  expiryDate: date('expiry_date').notNull(),
  manufacturingDate: date('manufacturing_date'),

  // Procurement Details
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
  mrp: decimal('mrp', { precision: 10, scale: 2 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).default('0'),

  // Stock Levels
  reorderLevel: integer('reorder_level').notNull(),
  minimumStock: integer('minimum_stock').notNull(),
  maximumStock: integer('maximum_stock').notNull(),

  // Location
  rackNumber: varchar('rack_number', { length: 20 }),
  shelfNumber: varchar('shelf_number', { length: 20 }),

  // Status
  stockStatus: varchar('stock_status', { length: 50 }).default('Normal'),

  lastUpdated: timestamp('last_updated', { mode: 'date' }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  uniqueMedicineBatch: uniqueIndex('unique_medicine_batch').on(table.clinicId, table.medicineId, table.batchNumber),
}));

// Medicine orders
export const medicineOrders = coreSchema.table('medicine_orders', {
  orderId: uuid('order_id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 30 }).unique().notNull(),

  // Patient and Clinical Info
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  prescribedBy: uuid('prescribed_by').notNull().references(() => users.userId),
  consultationId: uuid('consultation_id').references(() => consultations.consultationId),

  // Order Details
  orderDate: timestamp('order_date', { mode: 'date' }).defaultNow().notNull(),
  orderType: varchar('order_type', { length: 50 }).notNull(),

  // Status
  orderStatus: varchar('order_status', { length: 50 }).default('Pending').notNull(),

  // Dispensing Info
  dispensedBy: uuid('dispensed_by').references(() => users.userId),
  dispensedAt: timestamp('dispensed_at', { mode: 'date' }),

  // Financial
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  netAmount: decimal('net_amount', { precision: 10, scale: 2 }),

  // Notes
  prescriptionNotes: text('prescription_notes'),
  pharmacistNotes: text('pharmacist_notes'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Medicine order items
export const medicineOrderItems = coreSchema.table('medicine_order_items', {
  orderItemId: uuid('order_item_id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => medicineOrders.orderId),
  medicineId: uuid('medicine_id').notNull().references(() => medicineMaster.medicineId),

  // Prescription Details
  dosage: varchar('dosage', { length: 100 }),
  frequency: varchar('frequency', { length: 50 }),
  durationDays: integer('duration_days'),
  durationType: varchar('duration_type', { length: 20 }),

  // Instructions
  beforeFood: boolean('before_food').default(false),
  afterFood: boolean('after_food').default(false),
  specialInstructions: text('special_instructions'),

  // Quantity
  prescribedQuantity: integer('prescribed_quantity').notNull(),
  dispensedQuantity: integer('dispensed_quantity').default(0),
  returnedQuantity: integer('returned_quantity').default(0),

  // Substitution
  substituted: boolean('substituted').default(false),
  substitutedMedicineId: uuid('substituted_medicine_id').references(() => medicineMaster.medicineId),
  substitutionReason: text('substitution_reason'),

  // Financial
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).default('0'),
  taxPercentage: decimal('tax_percentage', { precision: 5, scale: 2 }).default('0'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),

  // Stock Reference
  inventoryId: uuid('inventory_id').references(() => pharmacyInventory.inventoryId),
  batchNumber: varchar('batch_number', { length: 50 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Stock movement/transaction log
export const pharmacyStockMovement = coreSchema.table('pharmacy_stock_movement', {
  movementId: uuid('movement_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  medicineId: uuid('medicine_id').notNull().references(() => medicineMaster.medicineId),
  inventoryId: uuid('inventory_id').notNull().references(() => pharmacyInventory.inventoryId),

  // Movement Details
  movementType: varchar('movement_type', { length: 50 }).notNull(),
  movementDate: timestamp('movement_date', { mode: 'date' }).defaultNow().notNull(),

  // Quantity
  quantity: integer('quantity').notNull(),
  unitOfMeasurement: varchar('unit_of_measurement', { length: 20 }),

  // Reference
  referenceType: varchar('reference_type', { length: 50 }),
  referenceId: uuid('reference_id'),

  // Stock Levels
  stockBefore: integer('stock_before').notNull(),
  stockAfter: integer('stock_after').notNull(),

  // Financial Impact
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),

  // User and Notes
  performedBy: uuid('performed_by').notNull().references(() => users.userId),
  notes: text('notes'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ============================================================================
// WEBHOOK MANAGEMENT SYSTEM
// ============================================================================

// Webhook endpoints configuration
export const webhookEndpoints = coreSchema.table('webhook_endpoints', {
  endpointId: uuid('endpoint_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Endpoint Configuration
  name: varchar('name', { length: 100 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  secret: varchar('secret', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),

  // Event Configuration
  events: jsonb('events').notNull().$type<string[]>(),
  description: text('description'),
  headers: jsonb('headers').$type<Record<string, string>>(),
  timeout: integer('timeout').default(30).notNull(),

  // Retry Policy
  retryPolicy: jsonb('retry_policy').notNull().$type<{
    maxRetries: number;
    retryIntervals: number[];
    backoffStrategy: 'linear' | 'exponential' | 'fixed';
    failureThreshold: number;
  }>(),

  // Health Monitoring
  consecutiveFailures: integer('consecutive_failures').default(0),
  lastFailureAt: timestamp('last_failure_at', { mode: 'date' }),
  disabledAt: timestamp('disabled_at', { mode: 'date' }),
  disabledBy: uuid('disabled_by').references(() => users.userId),
  disabledReason: text('disabled_reason'),

  // Audit
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.userId),
});

// Webhook events log
export const webhookEvents = coreSchema.table('webhook_events', {
  eventId: uuid('event_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Event Details
  eventType: varchar('event_type', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  resourceId: uuid('resource_id').notNull(),

  // Event Data
  payload: jsonb('payload').notNull().$type<Record<string, any>>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),

  // Audit
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
});

// Webhook delivery attempts
export const webhookDeliveries = coreSchema.table('webhook_deliveries', {
  deliveryId: uuid('delivery_id').primaryKey().defaultRandom(),
  endpointId: uuid('endpoint_id').notNull().references(() => webhookEndpoints.endpointId),
  eventId: uuid('event_id').notNull().references(() => webhookEvents.eventId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Delivery Status
  status: varchar('status', { length: 20 }).notNull(),
  attempt: integer('attempt').default(0).notNull(),
  maxAttempts: integer('max_attempts').default(3).notNull(),

  // Retry Logic
  nextRetryAt: timestamp('next_retry_at', { mode: 'date' }),
  lastAttemptAt: timestamp('last_attempt_at', { mode: 'date' }),

  // Response Details
  responseStatus: integer('response_status'),
  responseHeaders: jsonb('response_headers').$type<Record<string, string>>(),
  responseBody: text('response_body'),
  errorMessage: text('error_message'),

  // Delivery Metadata
  deliveredAt: timestamp('delivered_at', { mode: 'date' }),
  processingDuration: integer('processing_duration'),
  webhookSignature: varchar('webhook_signature', { length: 100 }),

  // Audit
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ============================================================================
// SECURITY & AUTHENTICATION TABLES
// ============================================================================

// API Keys for authentication
export const apiKey = securitySchema.table('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  organizationId: text('organization_id').notNull(),
  hashedKey: text('hashed_key').notNull().unique(),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  organizationIdIdx: index('api_key_organization_id_idx').on(table.organizationId),
  hashedKeyIdx: uniqueIndex('api_key_hashed_key_idx').on(table.hashedKey),
}));

// Security Events for audit logging
export const securityEvents = securitySchema.table('security_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').notNull(),
  eventType: text('event_type').notNull(),
  severity: severityEnum('severity').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  userId: text('user_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  organizationIdIdx: index('security_events_organization_id_idx').on(table.organizationId),
  eventTypeIdx: index('security_events_event_type_idx').on(table.eventType),
  createdAtIdx: index('security_events_created_at_idx').on(table.createdAt),
}));

// ============================================================================
// BILLING & SUBSCRIPTION TABLES
// ============================================================================

// Subscriptions for billing management
export const subscription = billingSchema.table('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  stripeCustomerId: text('stripe_customer_id'),
  status: text('status').notNull(), // active, inactive, canceled, etc.
  currentPeriodStart: timestamp('current_period_start', { mode: 'date' }),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  canceledAt: timestamp('canceled_at', { mode: 'date' }),
  trialStart: timestamp('trial_start', { mode: 'date' }),
  trialEnd: timestamp('trial_end', { mode: 'date' }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  organizationIdIdx: index('subscription_organization_id_idx').on(table.organizationId),
  stripeSubscriptionIdIdx: uniqueIndex('subscription_stripe_subscription_id_idx').on(table.stripeSubscriptionId),
}));

// ============================================================================
// TEAM MANAGEMENT TABLES
// ============================================================================

// Team Member Management
export const teamMember = coreSchema.table('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').notNull(),
  userId: text('user_id').notNull(),
  role: userRoleEnum('role').notNull(),
  status: text('status').notNull().default('active'), // active, inactive, pending
  joinedAt: timestamp('joined_at', { mode: 'date' }).defaultNow().notNull(),
  invitedBy: text('invited_by'),
  permissions: jsonb('permissions'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  organizationIdIdx: index('team_member_organization_id_idx').on(table.organizationId),
  userIdIdx: index('team_member_user_id_idx').on(table.userId),
  orgUserIdx: uniqueIndex('team_member_org_user_idx').on(table.organizationId, table.userId),
}));

// Invitations for team member onboarding
export const invitation = coreSchema.table('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').notNull(),
  email: text('email').notNull(),
  role: userRoleEnum('role').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  invitedBy: text('invited_by').notNull(),
  acceptedAt: timestamp('accepted_at', { mode: 'date' }),
  sentViaEmail: boolean('sent_via_email').default(false),
  allowedDomains: jsonb('allowed_domains'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  organizationIdIdx: index('invitation_organization_id_idx').on(table.organizationId),
  emailIdx: index('invitation_email_idx').on(table.email),
  tokenIdx: uniqueIndex('invitation_token_idx').on(table.token),
  orgEmailIdx: uniqueIndex('invitation_org_email_idx').on(table.organizationId, table.email),
}));

// ============================================================================
// EXPORT SCHEMA REFERENCES
// ============================================================================

// Legacy table references for backward compatibility
export const organizationSchema = coreSchema.table('organization', {
  id: text('id').primaryKey(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
  stripeSubscriptionStatus: text('stripe_subscription_status'),
  stripeSubscriptionCurrentPeriodEnd: bigint('stripe_subscription_current_period_end', { mode: 'number' }),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(table.stripeCustomerId),
}));

// Export main tables for use in services
// Billing schemas
export const invoice = billingSchema.table('invoice', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 191 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// OAuth schemas
export const oauthClient = securitySchema.table('oauth_client', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: varchar('client_id', { length: 191 }).notNull().unique(),
  clientSecret: varchar('client_secret', { length: 191 }).notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  redirectUris: jsonb('redirect_uris').notNull(), // JSON array
  grants: jsonb('grants').notNull(), // JSON array
  organizationId: uuid('organization_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const oauthClientPermission = securitySchema.table('oauth_client_permission', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull(),
  scope: varchar('scope', { length: 191 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export {
  // Clinical workflow
  appointments as appointmentsTable,
  // Audit and compliance
  auditLogs as auditLogsTable,
  // Core entities
  clinics as clinicsTable,
  consultations as consultationsTable,
  departments as departmentsTable,
  // Family relationship management
  familyAppointments as familyAppointmentsTable,
  familyGroups as familyGroupsTable,
  familyInsurance as familyInsuranceTable,
  familyMedicalHistory as familyMedicalHistoryTable,
  familyMembers as familyMembersTable,
  guardianRelationships as guardianRelationshipsTable,
  relationshipTypes as relationshipTypesTable,
  // ICU management
  icuBeds as icuBedsTable,
  icuNursingCarePlans as icuNursingCarePlansTable,
  icuCriticalAlerts as icuCriticalAlertsTable,
  icuStaffShifts as icuStaffShiftsTable,
  // Government schemes
  governmentSchemes as governmentSchemesTable,
  // Network management
  hospitalNetworks as hospitalNetworksTable,
  // Pharmacy management
  medicineMaster as medicineMasterTable,
  medicineOrderItems as medicineOrderItemsTable,
  medicineOrders as medicineOrdersTable,
  patients as patientsTable,
  pharmacyInventory as pharmacyInventoryTable,
  pharmacyStockMovement as pharmacyStockMovementTable,
  prescriptions as prescriptionsTable,
  users as usersTable,
  webhookDeliveries as webhookDeliveriesTable,
  // Webhook management
  webhookEndpoints as webhookEndpointsTable,
  webhookEvents as webhookEventsTable,
  whatsappMessages as whatsappMessagesTable,
  // Communication
  whatsappTemplates as whatsappTemplatesTable,
};

// ============================================================================
// RE-EXPORT SCHEMA EXTENSIONS
// ============================================================================

// export * from './SchemaExtensions'; // Temporarily disabled to avoid circular dependency
