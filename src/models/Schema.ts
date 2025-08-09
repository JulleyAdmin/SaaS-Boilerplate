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
export const engagementSchema = pgSchema('engagement');
export const csrSchema = pgSchema('csr');
export const crmSchema = pgSchema('crm');
export const telemedicineSchema = pgSchema('telemedicine');

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
export const appointmentStatusEnum = pgEnum('appointment_status_enum', ['Scheduled', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled', 'No-Show', 'Rescheduled', 'Telemedicine-Scheduled', 'Video-In-Progress', 'Video-Completed']);
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

// Telemedicine enums
export const consultationModeEnum = pgEnum('consultation_mode_enum', ['In-Person', 'Video', 'Audio', 'Chat', 'Phone']);
export const videoSessionStatusEnum = pgEnum('video_session_status_enum', ['Scheduled', 'Starting', 'In-Progress', 'Completed', 'Failed', 'Cancelled', 'No-Show']);
export const recordingStatusEnum = pgEnum('recording_status_enum', ['Not-Recorded', 'Recording', 'Recorded', 'Processing', 'Available', 'Failed']);
export const prescriptionStatusEnum = pgEnum('prescription_status_enum', ['Draft', 'Active', 'Dispensed', 'Expired', 'Cancelled']);
export const digitalPrescriptionTypeEnum = pgEnum('digital_prescription_type_enum', ['E-Prescription', 'Digital-Signature', 'SMS-Prescription', 'WhatsApp-Prescription']);
export const telemedicineComplianceEnum = pgEnum('telemedicine_compliance_enum', ['MCI-Compliant', 'Teleconsultation-Guidelines', 'NABH-Digital', 'Ayushman-Bharat-Digital']);
export const deviceTypeEnum = pgEnum('device_type_enum', ['Desktop', 'Laptop', 'Mobile', 'Tablet']);
export const connectionQualityEnum = pgEnum('connection_quality_enum', ['Excellent', 'Good', 'Fair', 'Poor', 'Failed']);

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
// ENGAGEMENT, CSR & CRM ENUM TYPES
// ============================================================================

// Patient engagement enums
export const engagementLevelEnum = pgEnum('engagement_level_enum', ['cold', 'warm', 'hot', 'active', 'loyal']);
export const journeyStageEnum = pgEnum('journey_stage_enum', ['awareness', 'consideration', 'active', 'loyal', 'at_risk', 'churned']);
export const goalStatusEnum = pgEnum('goal_status_enum', ['active', 'paused', 'achieved', 'abandoned']);
export const goalTypeEnum = pgEnum('goal_type_enum', [
  'weight_loss', 'weight_gain', 'bp_control', 'diabetes_management', 
  'cholesterol_control', 'fitness_improvement', 'quit_smoking', 'mental_health'
]);
export const feedbackTypeEnum = pgEnum('feedback_type_enum', ['consultation', 'service', 'facility', 'staff', 'overall']);

// CSR and community health enums
export const programTypeEnum = pgEnum('program_type_enum', [
  'health_camp', 'vaccination_drive', 'screening_program', 'health_education',
  'blood_donation', 'mental_health_awareness', 'nutrition_program', 'fitness_program'
]);
export const programStatusEnum = pgEnum('program_status_enum', ['planned', 'approved', 'active', 'completed', 'cancelled']);
export const eventStatusEnum = pgEnum('event_status_enum', ['scheduled', 'in_progress', 'completed', 'cancelled']);
export const volunteerStatusEnum = pgEnum('volunteer_status_enum', ['active', 'inactive', 'training', 'suspended']);
export const venueTypeEnum = pgEnum('venue_type_enum', ['hospital', 'community_center', 'school', 'mobile_van', 'outdoor']);

// CRM and marketing enums
export const leadStatusEnum = pgEnum('lead_status_enum', ['new', 'contacted', 'qualified', 'converted', 'lost']);
export const leadSourceEnum = pgEnum('lead_source_enum', [
  'website', 'referral', 'event', 'campaign', 'walk_in', 'social_media', 'phone_inquiry'
]);
export const campaignTypeEnum = pgEnum('campaign_type_enum', ['awareness', 'acquisition', 'retention', 'reactivation']);
export const campaignStatusEnum = pgEnum('campaign_status_enum', ['draft', 'scheduled', 'active', 'paused', 'completed']);
export const segmentTypeEnum = pgEnum('segment_type_enum', ['static', 'dynamic']);
export const automationTriggerEnum = pgEnum('automation_trigger_enum', [
  'patient_registered', 'appointment_booked', 'consultation_completed', 
  'prescription_issued', 'bill_generated', 'payment_received', 'feedback_submitted'
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
}, table => ({
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
}, table => ({
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
  consultationMode: consultationModeEnum('consultation_mode').default('In-Person'),

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

// ============================================================================
// HOSPITAL BILLING MANAGEMENT TABLES
// ============================================================================

// Patient Bills (Hospital-specific billing)
export const patientBills = billingSchema.table('patient_bills', {
  billId: uuid('bill_id').primaryKey().defaultRandom(),
  billNumber: varchar('bill_number', { length: 50 }).unique().notNull(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  consultationId: uuid('consultation_id').references(() => consultations.consultationId),
  
  // Bill Details
  billDate: timestamp('bill_date', { mode: 'date' }).defaultNow().notNull(),
  billType: varchar('bill_type', { length: 50 }).notNull(), // consultation, emergency, admission, lab, pharmacy
  
  // Financial Summary
  grossAmount: decimal('gross_amount', { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0'),
  netAmount: decimal('net_amount', { precision: 12, scale: 2 }).notNull(),
  
  // Government Scheme Integration
  governmentSchemeId: uuid('government_scheme_id').references(() => governmentSchemes.schemeId),
  schemeCoverageAmount: decimal('scheme_coverage_amount', { precision: 12, scale: 2 }).default('0'),
  patientAmount: decimal('patient_amount', { precision: 12, scale: 2 }).notNull(),
  
  // Status & Audit
  billStatus: billStatusEnum('bill_status').default('Draft'),
  createdBy: uuid('created_by').notNull().references(() => users.userId),
  approvedBy: uuid('approved_by').references(() => users.userId),
  approvedAt: timestamp('approved_at', { mode: 'date' }),
  
  // Notes
  billNotes: text('bill_notes'),
  internalNotes: text('internal_notes'),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  clinicPatientIdx: index('patient_bills_clinic_patient_idx').on(table.clinicId, table.patientId),
  billDateIdx: index('patient_bills_bill_date_idx').on(table.billDate),
  billStatusIdx: index('patient_bills_bill_status_idx').on(table.billStatus),
}));

// Bill Items (Itemized billing)
export const billItems = billingSchema.table('bill_items', {
  billItemId: uuid('bill_item_id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').notNull().references(() => patientBills.billId, { onDelete: 'cascade' }),
  
  // Service Reference
  serviceId: uuid('service_id').references(() => departmentServices.serviceId),
  itemDescription: varchar('item_description', { length: 500 }).notNull(),
  itemCategory: varchar('item_category', { length: 100 }), // consultation, procedure, lab, medicine, room, equipment
  itemCode: varchar('item_code', { length: 50 }), // Internal coding system
  
  // Pricing
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  taxPercentage: decimal('tax_percentage', { precision: 5, scale: 2 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  lineTotal: decimal('line_total', { precision: 10, scale: 2 }).notNull(),
  
  // Medical Context
  prescribedBy: uuid('prescribed_by').references(() => users.userId),
  serviceDate: timestamp('service_date', { mode: 'date' }),
  departmentId: uuid('department_id').references(() => departments.departmentId),
  
  // Government Scheme Coverage
  schemeCoverage: boolean('scheme_coverage').default(false),
  schemeRate: decimal('scheme_rate', { precision: 10, scale: 2 }),
  patientShare: decimal('patient_share', { precision: 10, scale: 2 }),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  billIdIdx: index('bill_items_bill_id_idx').on(table.billId),
  serviceIdIdx: index('bill_items_service_id_idx').on(table.serviceId),
  categoryIdx: index('bill_items_category_idx').on(table.itemCategory),
}));

// Payments
export const payments = billingSchema.table('payments', {
  paymentId: uuid('payment_id').primaryKey().defaultRandom(),
  paymentNumber: varchar('payment_number', { length: 50 }).unique().notNull(),
  billId: uuid('bill_id').notNull().references(() => patientBills.billId),
  
  // Payment Details
  paymentDate: timestamp('payment_date', { mode: 'date' }).defaultNow().notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  
  // Transaction Details
  transactionId: varchar('transaction_id', { length: 100 }),
  referenceNumber: varchar('reference_number', { length: 100 }),
  gatewayResponse: jsonb('gateway_response'),
  
  // Collection Details
  collectedBy: uuid('collected_by').notNull().references(() => users.userId),
  collectionPoint: varchar('collection_point', { length: 100 }), // reception, pharmacy, cashier, online
  
  // Status & Reconciliation
  paymentStatus: varchar('payment_status', { length: 50 }).default('completed'), // pending, completed, failed, refunded
  reconciled: boolean('reconciled').default(false),
  reconciledBy: uuid('reconciled_by').references(() => users.userId),
  reconciledAt: timestamp('reconciled_at', { mode: 'date' }),
  
  // Notes
  paymentNotes: text('payment_notes'),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  billIdIdx: index('payments_bill_id_idx').on(table.billId),
  paymentDateIdx: index('payments_payment_date_idx').on(table.paymentDate),
  paymentMethodIdx: index('payments_payment_method_idx').on(table.paymentMethod),
  paymentStatusIdx: index('payments_payment_status_idx').on(table.paymentStatus),
}));

// Insurance Claims
export const insuranceClaims = billingSchema.table('insurance_claims', {
  claimId: uuid('claim_id').primaryKey().defaultRandom(),
  claimNumber: varchar('claim_number', { length: 50 }).unique().notNull(),
  billId: uuid('bill_id').notNull().references(() => patientBills.billId),
  
  // Insurance Details
  insuranceProvider: varchar('insurance_provider', { length: 200 }).notNull(),
  policyNumber: varchar('policy_number', { length: 100 }).notNull(),
  policyHolderName: varchar('policy_holder_name', { length: 200 }).notNull(),
  relationshipToPatient: varchar('relationship_to_patient', { length: 50 }), // self, spouse, child, parent
  
  // Claim Details
  claimAmount: decimal('claim_amount', { precision: 12, scale: 2 }).notNull(),
  claimType: varchar('claim_type', { length: 50 }).notNull(), // cashless, reimbursement
  
  // Processing Status
  claimStatus: varchar('claim_status', { length: 50 }).default('submitted'), // submitted, under_review, approved, rejected, settled
  submittedDate: timestamp('submitted_date', { mode: 'date' }).defaultNow().notNull(),
  reviewedDate: timestamp('reviewed_date', { mode: 'date' }),
  approvedDate: timestamp('approved_date', { mode: 'date' }),
  settlementDate: timestamp('settlement_date', { mode: 'date' }),
  
  // Settlement Details
  approvedAmount: decimal('approved_amount', { precision: 12, scale: 2 }),
  settledAmount: decimal('settled_amount', { precision: 12, scale: 2 }),
  deductible: decimal('deductible', { precision: 10, scale: 2 }).default('0'),
  copay: decimal('copay', { precision: 10, scale: 2 }).default('0'),
  
  // Rejection/Issues
  rejectionReason: text('rejection_reason'),
  issuesNotes: text('issues_notes'),
  
  // Processing Officer
  processedBy: uuid('processed_by').references(() => users.userId),
  reviewedBy: varchar('reviewed_by', { length: 200 }), // Insurance company reviewer
  
  // Documents
  documentsSubmitted: jsonb('documents_submitted'),
  additionalDocumentsRequired: jsonb('additional_documents_required'),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  billIdIdx: index('insurance_claims_bill_id_idx').on(table.billId),
  claimStatusIdx: index('insurance_claims_status_idx').on(table.claimStatus),
  insuranceProviderIdx: index('insurance_claims_provider_idx').on(table.insuranceProvider),
  submittedDateIdx: index('insurance_claims_submitted_date_idx').on(table.submittedDate),
}));

// Bill Audit Trail
export const billAuditTrail = billingSchema.table('bill_audit_trail', {
  auditId: uuid('audit_id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').notNull().references(() => patientBills.billId, { onDelete: 'cascade' }),
  
  // Audit Details
  actionType: varchar('action_type', { length: 50 }).notNull(), // created, modified, approved, paid, cancelled
  fieldChanged: varchar('field_changed', { length: 100 }), // Specific field that changed
  oldValue: text('old_value'),
  newValue: text('new_value'),
  reason: text('reason'),
  
  // User Context
  performedBy: uuid('performed_by').notNull().references(() => users.userId),
  performedAt: timestamp('performed_at', { mode: 'date' }).defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  
  // System Context
  sessionId: varchar('session_id', { length: 100 }),
  applicationModule: varchar('application_module', { length: 100 }), // billing, pharmacy, lab, etc.
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  billIdIdx: index('bill_audit_trail_bill_id_idx').on(table.billId),
  actionTypeIdx: index('bill_audit_trail_action_type_idx').on(table.actionType),
  performedByIdx: index('bill_audit_trail_performed_by_idx').on(table.performedBy),
  performedAtIdx: index('bill_audit_trail_performed_at_idx').on(table.performedAt),
}));

// Export main tables for use in services
// Legacy Billing schemas (for backward compatibility)
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

// ============================================================================
// PATIENT ENGAGEMENT TABLES
// ============================================================================

// Patient engagement preferences
export const patientPreferences = engagementSchema.table('patient_preferences', {
  preferenceId: uuid('preference_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Communication preferences
  preferredLanguage: varchar('preferred_language', { length: 10 }).default('en'),
  preferredChannel: communicationTypeEnum('preferred_channel').default('whatsapp'),
  communicationFrequency: varchar('communication_frequency', { length: 20 }).default('weekly'),
  quietHoursStart: time('quiet_hours_start'),
  quietHoursEnd: time('quiet_hours_end'),

  // Engagement preferences
  interestedPrograms: text('interested_programs').array(),
  healthGoals: text('health_goals').array(),
  preferredDoctorId: uuid('preferred_doctor_id').references(() => users.userId),
  allowFamilyAccess: boolean('allow_family_access').default(false),

  // Consent management
  marketingConsent: boolean('marketing_consent').default(false),
  researchConsent: boolean('research_consent').default(false),
  dataSharingConsent: boolean('data_sharing_consent').default(false),
  consentUpdatedAt: timestamp('consent_updated_at', { mode: 'date' }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  patientIdIdx: index('patient_preferences_patient_id_idx').on(table.patientId),
  clinicIdIdx: index('patient_preferences_clinic_id_idx').on(table.clinicId),
}));

// Patient journey tracking
export const patientJourney = crmSchema.table('patient_journey', {
  journeyId: uuid('journey_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Journey details
  stage: journeyStageEnum('stage').notNull(),
  subStage: varchar('sub_stage', { length: 100 }),
  entryDate: timestamp('entry_date', { mode: 'date' }).defaultNow().notNull(),
  expectedTransitionDate: date('expected_transition_date'),

  // Engagement metrics
  engagementScore: integer('engagement_score').default(0), // 0-100
  lastInteractionDate: timestamp('last_interaction_date', { mode: 'date' }),
  interactionCount: integer('interaction_count').default(0),
  responseRate: decimal('response_rate', { precision: 5, scale: 2 }),

  // Predictive analytics
  churnRiskScore: decimal('churn_risk_score', { precision: 5, scale: 2 }), // 0-100
  lifetimeValue: decimal('lifetime_value', { precision: 12, scale: 2 }),
  nextBestAction: varchar('next_best_action', { length: 200 }),

  // Segmentation
  segments: text('segments').array(),
  personas: text('personas').array(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  patientIdIdx: index('patient_journey_patient_id_idx').on(table.patientId),
  stageIdx: index('patient_journey_stage_idx').on(table.stage),
  engagementScoreIdx: index('patient_journey_engagement_score_idx').on(table.engagementScore),
}));

// Health goals and tracking
export const healthGoals = engagementSchema.table('health_goals', {
  goalId: uuid('goal_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Goal definition
  goalType: goalTypeEnum('goal_type').notNull(),
  goalName: varchar('goal_name', { length: 200 }).notNull(),
  targetValue: jsonb('target_value'), // {metric: value, unit: string}
  currentValue: jsonb('current_value'),

  // Timeline
  startDate: date('start_date').notNull(),
  targetDate: date('target_date').notNull(),
  achievedDate: date('achieved_date'),

  // Progress tracking
  progressPercentage: integer('progress_percentage').default(0),
  milestones: jsonb('milestones').array(), // [{date, value, note}]

  // Support system
  assignedCoachId: uuid('assigned_coach_id').references(() => users.userId),
  supportGroupId: uuid('support_group_id'),

  // Status
  status: goalStatusEnum('status').default('active'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  patientIdIdx: index('health_goals_patient_id_idx').on(table.patientId),
  goalTypeIdx: index('health_goals_goal_type_idx').on(table.goalType),
  statusIdx: index('health_goals_status_idx').on(table.status),
}));

// Patient feedback and satisfaction
export const patientFeedback = engagementSchema.table('patient_feedback', {
  feedbackId: uuid('feedback_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Context
  feedbackType: feedbackTypeEnum('feedback_type').notNull(),
  referenceId: uuid('reference_id'), // consultation_id, appointment_id, etc.
  departmentId: uuid('department_id').references(() => departments.departmentId),

  // Ratings
  overallRating: integer('overall_rating'), // 1-5
  waitTimeRating: integer('wait_time_rating'), // 1-5
  staffRating: integer('staff_rating'), // 1-5
  facilityRating: integer('facility_rating'), // 1-5
  treatmentRating: integer('treatment_rating'), // 1-5

  // Feedback
  feedbackText: text('feedback_text'),
  improvementSuggestions: text('improvement_suggestions'),

  // NPS score
  npsScore: integer('nps_score'), // 0-10
  wouldRecommend: boolean('would_recommend'),

  // Follow-up
  requiresFollowup: boolean('requires_followup').default(false),
  followupCompleted: boolean('followup_completed').default(false),
  followupNotes: text('followup_notes'),

  submittedAt: timestamp('submitted_at', { mode: 'date' }).defaultNow().notNull(),
  platform: varchar('platform', { length: 20 }), // web, mobile, kiosk, sms
  anonymous: boolean('anonymous').default(false),
}, table => ({
  patientIdIdx: index('patient_feedback_patient_id_idx').on(table.patientId),
  feedbackTypeIdx: index('patient_feedback_feedback_type_idx').on(table.feedbackType),
  overallRatingIdx: index('patient_feedback_overall_rating_idx').on(table.overallRating),
  submittedAtIdx: index('patient_feedback_submitted_at_idx').on(table.submittedAt),
}));

// ============================================================================
// CSR EVENT MANAGEMENT TABLES
// ============================================================================

// CSR programs and events
export const csrPrograms = csrSchema.table('programs', {
  programId: uuid('program_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Program details
  programName: varchar('program_name', { length: 200 }).notNull(),
  programType: programTypeEnum('program_type').notNull(),
  description: text('description'),
  objectives: text('objectives').array(),

  // Target audience
  targetDemographic: varchar('target_demographic', { length: 100 }),
  targetCount: integer('target_count'),
  eligibilityCriteria: jsonb('eligibility_criteria'),

  // Timeline
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  registrationDeadline: date('registration_deadline'),

  // Location
  venueType: venueTypeEnum('venue_type'),
  venueName: varchar('venue_name', { length: 200 }),
  venueAddress: text('venue_address'),

  // Resources
  budget: decimal('budget', { precision: 12, scale: 2 }),
  requiredStaff: integer('required_staff'),
  requiredVolunteers: integer('required_volunteers'),
  equipmentNeeded: text('equipment_needed').array(),

  // Partners
  partnerOrganizations: text('partner_organizations').array(),
  sponsors: text('sponsors').array(),
  governmentSchemeId: uuid('government_scheme_id').references(() => governmentSchemes.schemeId),

  // Status
  status: programStatusEnum('status').default('planned'),
  approvalStatus: varchar('approval_status', { length: 20 }).default('pending'),
  approvedBy: uuid('approved_by').references(() => users.userId),

  // Impact metrics
  actualBeneficiaries: integer('actual_beneficiaries').default(0),
  servicesProvided: jsonb('services_provided'), // {service_type: count}
  feedbackScore: decimal('feedback_score', { precision: 3, scale: 2 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  clinicIdIdx: index('csr_programs_clinic_id_idx').on(table.clinicId),
  programTypeIdx: index('csr_programs_program_type_idx').on(table.programType),
  statusIdx: index('csr_programs_status_idx').on(table.status),
  startDateIdx: index('csr_programs_start_date_idx').on(table.startDate),
}));

// CSR event schedule
export const csrEvents = csrSchema.table('events', {
  eventId: uuid('event_id').primaryKey().defaultRandom(),
  programId: uuid('program_id').notNull().references(() => csrPrograms.programId),

  // Event details
  eventName: varchar('event_name', { length: 200 }).notNull(),
  eventDate: date('event_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),

  // Capacity
  maxParticipants: integer('max_participants'),
  registeredCount: integer('registered_count').default(0),
  attendedCount: integer('attended_count').default(0),

  // Activities
  activities: jsonb('activities').array(), // [{name, duration, facilitator, materials}]

  // Team assignment
  coordinatorId: uuid('coordinator_id').references(() => users.userId),
  teamMembers: uuid('team_members').array(),
  volunteers: uuid('volunteers').array(),

  // Status
  status: eventStatusEnum('status').default('scheduled'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  programIdIdx: index('csr_events_program_id_idx').on(table.programId),
  eventDateIdx: index('csr_events_event_date_idx').on(table.eventDate),
  statusIdx: index('csr_events_status_idx').on(table.status),
}));

// CSR event registrations
export const csrEventRegistrations = csrSchema.table('event_registrations', {
  registrationId: uuid('registration_id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => csrEvents.eventId),

  // Participant details
  participantName: varchar('participant_name', { length: 200 }).notNull(),
  age: integer('age'),
  gender: genderEnum('gender'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  address: text('address'),

  // Medical info (for health camps)
  bloodGroup: bloodGroupEnum('blood_group'),
  knownConditions: text('known_conditions').array(),
  currentMedications: text('current_medications').array(),

  // Registration details
  registrationDate: timestamp('registration_date', { mode: 'date' }).defaultNow().notNull(),
  registrationNumber: varchar('registration_number', { length: 50 }).unique(),
  qrCode: varchar('qr_code', { length: 200 }),

  // Attendance
  checkedIn: boolean('checked_in').default(false),
  checkInTime: timestamp('check_in_time', { mode: 'date' }),
  servicesAvailed: jsonb('services_availed').array(), // [{service, provider, time, notes}]

  // Follow-up
  requiresFollowup: boolean('requires_followup').default(false),
  followupDate: date('followup_date'),
  followupNotes: text('followup_notes'),
  convertedToPatient: boolean('converted_to_patient').default(false),
  patientId: uuid('patient_id').references(() => patients.patientId),

  // Source
  source: varchar('source', { length: 50 }), // walk-in, online, phone, referral
  referredBy: varchar('referred_by', { length: 200 }),
}, table => ({
  eventIdIdx: index('csr_event_registrations_event_id_idx').on(table.eventId),
  registrationNumberIdx: uniqueIndex('csr_event_registrations_registration_number_idx').on(table.registrationNumber),
  phoneIdx: index('csr_event_registrations_phone_idx').on(table.phone),
}));

// Volunteer management
export const volunteers = csrSchema.table('volunteers', {
  volunteerId: uuid('volunteer_id').primaryKey().defaultRandom(),

  // Personal information
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),

  // Professional background
  occupation: varchar('occupation', { length: 100 }),
  organization: varchar('organization', { length: 200 }),
  skills: text('skills').array(),
  languages: text('languages').array(),

  // Availability
  availableDays: integer('available_days').array(), // 0=Sunday, 6=Saturday
  availableHours: jsonb('available_hours'), // {day: {start, end}}

  // Verification
  idVerified: boolean('id_verified').default(false),
  backgroundCheckCompleted: boolean('background_check_completed').default(false),
  trainingCompleted: boolean('training_completed').default(false),

  // Activity tracking
  totalHours: integer('total_hours').default(0),
  eventsParticipated: integer('events_participated').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  badges: text('badges').array(),

  // Status
  status: volunteerStatusEnum('status').default('active'),

  joinedDate: date('joined_date').defaultNow().notNull(),
  lastActiveDate: date('last_active_date'),
}, table => ({
  emailIdx: uniqueIndex('volunteers_email_idx').on(table.email),
  phoneIdx: index('volunteers_phone_idx').on(table.phone),
  statusIdx: index('volunteers_status_idx').on(table.status),
}));

// ============================================================================
// CRM & MARKETING AUTOMATION TABLES
// ============================================================================

// CRM campaigns
export const crmCampaigns = crmSchema.table('campaigns', {
  campaignId: uuid('campaign_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Campaign details
  campaignName: varchar('campaign_name', { length: 200 }).notNull(),
  campaignType: campaignTypeEnum('campaign_type').notNull(),
  objective: text('objective'),

  // Target audience
  targetSegments: text('target_segments').array(),
  targetCriteria: jsonb('target_criteria'), // SQL-like conditions
  estimatedReach: integer('estimated_reach'),

  // Content
  messageTemplates: jsonb('message_templates').array(), // [{channel, template_id, content}]
  creativeAssets: text('creative_assets').array(), // URLs to images/videos

  // Schedule
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }),
  scheduleType: varchar('schedule_type', { length: 20 }), // immediate, scheduled, recurring
  recurrencePattern: jsonb('recurrence_pattern'),

  // Budget
  budgetAllocated: decimal('budget_allocated', { precision: 12, scale: 2 }),
  budgetSpent: decimal('budget_spent', { precision: 12, scale: 2 }).default('0'),
  costPerAcquisition: decimal('cost_per_acquisition', { precision: 10, scale: 2 }),

  // Performance
  sentCount: integer('sent_count').default(0),
  deliveredCount: integer('delivered_count').default(0),
  openedCount: integer('opened_count').default(0),
  clickedCount: integer('clicked_count').default(0),
  convertedCount: integer('converted_count').default(0),

  // Status
  status: campaignStatusEnum('status').default('draft'),
  approvalStatus: varchar('approval_status', { length: 20 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  clinicIdIdx: index('crm_campaigns_clinic_id_idx').on(table.clinicId),
  campaignTypeIdx: index('crm_campaigns_campaign_type_idx').on(table.campaignType),
  statusIdx: index('crm_campaigns_status_idx').on(table.status),
  startDateIdx: index('crm_campaigns_start_date_idx').on(table.startDate),
}));

// Lead management
export const leads = crmSchema.table('leads', {
  leadId: uuid('lead_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Lead information
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 100 }),

  // Demographics
  ageRange: varchar('age_range', { length: 20 }),
  gender: genderEnum('gender'),
  location: varchar('location', { length: 200 }),

  // Lead source
  source: leadSourceEnum('source').notNull(),
  sourceDetails: jsonb('source_details'),
  referringPatientId: uuid('referring_patient_id').references(() => patients.patientId),
  campaignId: uuid('campaign_id').references(() => crmCampaigns.campaignId),

  // Interest
  interestedServices: text('interested_services').array(),
  healthConcerns: text('health_concerns').array(),
  preferredContactMethod: varchar('preferred_contact_method', { length: 20 }),

  // Lead scoring
  leadScore: integer('lead_score').default(0), // 0-100
  scoreFactors: jsonb('score_factors'), // {factor: score}
  qualificationStatus: varchar('qualification_status', { length: 20 }), // unqualified, qualified, nurturing, converted

  // Engagement
  lastContactDate: timestamp('last_contact_date', { mode: 'date' }),
  contactAttempts: integer('contact_attempts').default(0),
  engagementLevel: engagementLevelEnum('engagement_level'),

  // Conversion
  converted: boolean('converted').default(false),
  conversionDate: timestamp('conversion_date', { mode: 'date' }),
  patientId: uuid('patient_id').references(() => patients.patientId),
  firstAppointmentId: uuid('first_appointment_id').references(() => appointments.appointmentId),

  // Assignment
  assignedTo: uuid('assigned_to').references(() => users.userId),

  // Status
  status: leadStatusEnum('status').default('new'),
  lostReason: varchar('lost_reason', { length: 100 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  clinicIdIdx: index('leads_clinic_id_idx').on(table.clinicId),
  phoneIdx: index('leads_phone_idx').on(table.phone),
  sourceIdx: index('leads_source_idx').on(table.source),
  statusIdx: index('leads_status_idx').on(table.status),
  leadScoreIdx: index('leads_lead_score_idx').on(table.leadScore),
  assignedToIdx: index('leads_assigned_to_idx').on(table.assignedTo),
}));

// Marketing automation rules
export const automationRules = crmSchema.table('automation_rules', {
  ruleId: uuid('rule_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Rule definition
  ruleName: varchar('rule_name', { length: 200 }).notNull(),
  ruleType: varchar('rule_type', { length: 50 }), // trigger, condition, action
  description: text('description'),

  // Trigger configuration
  triggerEvent: automationTriggerEnum('trigger_event'),
  triggerConditions: jsonb('trigger_conditions'),

  // Action configuration
  actionType: varchar('action_type', { length: 50 }), // send_message, update_field, create_task
  actionConfig: jsonb('action_config'),
  delayMinutes: integer('delay_minutes').default(0),

  // Execution
  isActive: boolean('is_active').default(true),
  priority: integer('priority').default(0),
  maxExecutionsPerPatient: integer('max_executions_per_patient'),

  // Performance
  totalExecutions: integer('total_executions').default(0),
  successCount: integer('success_count').default(0),
  lastExecutedAt: timestamp('last_executed_at', { mode: 'date' }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  clinicIdIdx: index('automation_rules_clinic_id_idx').on(table.clinicId),
  triggerEventIdx: index('automation_rules_trigger_event_idx').on(table.triggerEvent),
  isActiveIdx: index('automation_rules_is_active_idx').on(table.isActive),
}));

// Patient segmentation
export const patientSegments = crmSchema.table('segments', {
  segmentId: uuid('segment_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),

  // Segment definition
  segmentName: varchar('segment_name', { length: 200 }).notNull(),
  description: text('description'),

  // Criteria
  criteriaType: segmentTypeEnum('criteria_type'),
  criteriaDefinition: jsonb('criteria_definition'), // SQL-like conditions

  // Members
  memberCount: integer('member_count').default(0),
  lastCalculatedAt: timestamp('last_calculated_at', { mode: 'date' }),

  // Usage
  usedInCampaigns: integer('used_in_campaigns').default(0),

  // Status
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  clinicIdIdx: index('patient_segments_clinic_id_idx').on(table.clinicId),
  criteriaTypeIdx: index('patient_segments_criteria_type_idx').on(table.criteriaType),
  isActiveIdx: index('patient_segments_is_active_idx').on(table.isActive),
}));

export {
  // Clinical workflow
  appointments as appointmentsTable,
  // Audit and compliance
  auditLogs as auditLogsTable,
  // Billing and payments
  billAuditTrail as billAuditTrailTable,
  billItems as billItemsTable,
  insuranceClaims as insuranceClaimsTable,
  patientBills as patientBillsTable,
  payments as paymentsTable,
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
  // Government schemes
  governmentSchemes as governmentSchemesTable,
  guardianRelationships as guardianRelationshipsTable,
  // Network management
  hospitalNetworks as hospitalNetworksTable,
  // ICU management
  icuBeds as icuBedsTable,
  icuCriticalAlerts as icuCriticalAlertsTable,
  icuNursingCarePlans as icuNursingCarePlansTable,
  icuStaffShifts as icuStaffShiftsTable,
  // Pharmacy management
  medicineMaster as medicineMasterTable,
  medicineOrderItems as medicineOrderItemsTable,
  medicineOrders as medicineOrdersTable,
  patients as patientsTable,
  pharmacyInventory as pharmacyInventoryTable,
  pharmacyStockMovement as pharmacyStockMovementTable,
  prescriptions as prescriptionsTable,
  relationshipTypes as relationshipTypesTable,
  users as usersTable,
  webhookDeliveries as webhookDeliveriesTable,
  // Webhook management
  webhookEndpoints as webhookEndpointsTable,
  webhookEvents as webhookEventsTable,
  whatsappMessages as whatsappMessagesTable,
  // Communication
  whatsappTemplates as whatsappTemplatesTable,
  // Patient engagement
  patientPreferences as patientPreferencesTable,
  patientJourney as patientJourneyTable,
  healthGoals as healthGoalsTable,
  patientFeedback as patientFeedbackTable,
  // CSR and community health
  csrPrograms as csrProgramsTable,
  csrEvents as csrEventsTable,
  csrEventRegistrations as csrEventRegistrationsTable,
  volunteers as volunteersTable,
  // CRM and marketing
  crmCampaigns as crmCampaignsTable,
  leads as leadsTable,
  automationRules as automationRulesTable,
  patientSegments as patientSegmentsTable,
  // Network collaboration tables
  patientTransfers as patientTransfersTable,
  referralManagement as referralManagementTable,
  networkDoctors as networkDoctorsTable,
  collaborationAgreements as collaborationAgreementsTable,
  sharedServices as sharedServicesTable,
  networkResources as networkResourcesTable,
  // Telemedicine tables
  videoSessions as videoSessionsTable,
  digitalPrescriptions as digitalPrescriptionsTable,
  patientRemoteMonitoring as patientRemoteMonitoringTable,
  telemedicineBilling as telemedicineBillingTable,
};

// ============================================================================
// NETWORK COLLABORATION TABLES
// ============================================================================

// Patient Transfers Table - For inter-hospital patient movements
export const patientTransfers = networkSchema.table('patient_transfers', {
  transferId: uuid('transfer_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  
  // Transfer hospitals
  sourceClinicId: uuid('source_clinic_id').notNull().references(() => clinics.clinicId),
  destinationClinicId: uuid('destination_clinic_id').notNull().references(() => clinics.clinicId),
  
  // Transfer details
  transferType: varchar('transfer_type', { length: 50 }), // Emergency, Planned, Specialist
  transferReason: text('transfer_reason'),
  clinicalSummary: text('clinical_summary'),
  
  // Medical information
  diagnosisAtTransfer: text('diagnosis_at_transfer').array(),
  vitalSignsAtTransfer: jsonb('vital_signs_at_transfer'),
  medicationsOnTransfer: jsonb('medications_on_transfer'),
  
  // Status workflow
  transferStatus: varchar('transfer_status', { length: 50 }).notNull().default('Initiated'), // Initiated, Accepted, In-Transit, Completed, Cancelled
  initiatedBy: uuid('initiated_by').references(() => users.userId),
  initiatedAt: timestamp('initiated_at', { mode: 'date' }).defaultNow(),
  acceptedBy: uuid('accepted_by').references(() => users.userId),
  acceptedAt: timestamp('accepted_at', { mode: 'date' }),
  completedAt: timestamp('completed_at', { mode: 'date' }),
  
  // Transportation
  transportMode: varchar('transport_mode', { length: 50 }), // Ambulance, Air, Private
  transportProvider: varchar('transport_provider', { length: 200 }),
  estimatedArrival: timestamp('estimated_arrival', { mode: 'date' }),
  actualArrival: timestamp('actual_arrival', { mode: 'date' }),
  
  // Documentation
  transferDocuments: jsonb('transfer_documents'), // Array of document URLs/IDs
  handoverNotes: text('handover_notes'),
  receivingDoctorId: uuid('receiving_doctor_id').references(() => users.userId),
  
  // Bed allocation
  requestedDepartment: varchar('requested_department', { length: 100 }),
  allocatedBedId: uuid('allocated_bed_id'),
  
  // Billing
  transferCharges: decimal('transfer_charges', { precision: 10, scale: 2 }),
  billingStatus: varchar('billing_status', { length: 50 }),
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Referral Management Table - For doctor-to-doctor referrals
export const referralManagement = networkSchema.table('referral_management', {
  referralId: uuid('referral_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  consultationId: uuid('consultation_id').references(() => consultations.consultationId),
  
  // Referral parties
  referringDoctorId: uuid('referring_doctor_id').notNull().references(() => users.userId),
  referringClinicId: uuid('referring_clinic_id').notNull().references(() => clinics.clinicId),
  referredToDoctorId: uuid('referred_to_doctor_id').references(() => users.userId),
  referredToClinicId: uuid('referred_to_clinic_id').references(() => clinics.clinicId),
  referredToDepartment: varchar('referred_to_department', { length: 100 }),
  
  // Referral details
  referralType: varchar('referral_type', { length: 50 }).notNull(), // Internal, External, Emergency, Second-Opinion
  referralPriority: varchar('referral_priority', { length: 20 }).notNull().default('Normal'), // Urgent, High, Normal, Low
  referralReason: text('referral_reason').notNull(),
  clinicalNotes: text('clinical_notes'),
  
  // Medical information
  provisionalDiagnosis: text('provisional_diagnosis').array(),
  icd10Codes: varchar('icd10_codes', { length: 10 }).array(),
  investigationsDone: jsonb('investigations_done'),
  investigationsPending: jsonb('investigations_pending'),
  currentMedications: jsonb('current_medications'),
  
  // Status workflow
  referralStatus: varchar('referral_status', { length: 50 }).notNull().default('Initiated'), // Initiated, Sent, Acknowledged, Accepted, Rejected, Completed, Expired
  statusReason: text('status_reason'),
  
  // Timeline
  initiatedAt: timestamp('initiated_at', { mode: 'date' }).defaultNow(),
  sentAt: timestamp('sent_at', { mode: 'date' }),
  acknowledgedAt: timestamp('acknowledged_at', { mode: 'date' }),
  acceptedAt: timestamp('accepted_at', { mode: 'date' }),
  appointmentDate: date('appointment_date'),
  completedAt: timestamp('completed_at', { mode: 'date' }),
  expiryDate: date('expiry_date'),
  
  // Response
  responseNotes: text('response_notes'),
  treatmentProvided: text('treatment_provided'),
  followUpRequired: boolean('follow_up_required').default(false),
  followUpWith: varchar('follow_up_with', { length: 50 }), // Referring, Referred, Both
  
  // Documentation
  referralLetterUrl: text('referral_letter_url'),
  supportingDocuments: jsonb('supporting_documents'),
  responseLetterUrl: text('response_letter_url'),
  
  // Billing
  referralFee: decimal('referral_fee', { precision: 10, scale: 2 }),
  feeSplitPercentage: decimal('fee_split_percentage', { precision: 5, scale: 2 }),
  billingStatus: varchar('billing_status', { length: 50 }),
  
  // Quality metrics
  patientFeedbackScore: integer('patient_feedback_score'),
  outcomeStatus: varchar('outcome_status', { length: 50 }), // Improved, Stable, Deteriorated
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
  updatedBy: uuid('updated_by').references(() => users.userId),
});

// Network Doctors Table - For multi-hospital practicing doctors
export const networkDoctors = networkSchema.table('network_doctors', {
  networkDoctorId: uuid('network_doctor_id').primaryKey().defaultRandom(),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  
  // Network affiliations
  primaryClinicId: uuid('primary_clinic_id').notNull().references(() => clinics.clinicId),
  networkId: uuid('network_id').references(() => hospitalNetworks.networkId),
  
  // Multi-hospital practice
  practicingClinics: uuid('practicing_clinics').array(), // Array of clinic IDs
  visitingConsultantAt: uuid('visiting_consultant_at').array(), // Clinics where visiting
  
  // Availability
  availabilitySchedule: jsonb('availability_schedule'), // Per clinic schedule
  consultationModes: varchar('consultation_modes', { length: 50 }).array(), // In-Person, Video, Phone
  
  // Specialization across network
  networkRole: varchar('network_role', { length: 100 }), // Network Specialist, Visiting Consultant, Locum
  specializedServices: text('specialized_services').array(),
  
  // Referral preferences
  acceptsReferrals: boolean('accepts_referrals').default(true),
  referralSpecialties: text('referral_specialties').array(),
  preferredReferralTypes: varchar('preferred_referral_types', { length: 50 }).array(),
  maxReferralsPerWeek: integer('max_referrals_per_week'),
  
  // Network credentials
  networkRegistrationNumber: varchar('network_registration_number', { length: 100 }),
  networkPrivileges: text('network_privileges').array(),
  
  // Performance metrics
  totalNetworkConsultations: integer('total_network_consultations').default(0),
  totalReferralsReceived: integer('total_referrals_received').default(0),
  totalReferralsCompleted: integer('total_referrals_completed').default(0),
  averageResponseTimeHours: decimal('average_response_time_hours', { precision: 5, scale: 2 }),
  patientSatisfactionScore: decimal('patient_satisfaction_score', { precision: 3, scale: 2 }),
  
  // Standard fields
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// ============================================================================
// COLLABORATION AGREEMENT TABLES
// ============================================================================

// Collaboration Agreements Table - For inter-hospital agreements
export const collaborationAgreements = collaborationSchema.table('collaboration_agreements', {
  agreementId: uuid('agreement_id').primaryKey().defaultRandom(),
  
  // Agreement parties
  clinicAId: uuid('clinic_a_id').notNull().references(() => clinics.clinicId),
  clinicBId: uuid('clinic_b_id').notNull().references(() => clinics.clinicId),
  networkId: uuid('network_id').references(() => hospitalNetworks.networkId),
  
  // Agreement details
  agreementType: varchar('agreement_type', { length: 100 }).notNull(), // Service-Sharing, Resource-Sharing, Referral, Training
  agreementName: varchar('agreement_name', { length: 200 }).notNull(),
  agreementCode: varchar('agreement_code', { length: 50 }).unique().notNull(),
  
  // Terms
  effectiveFrom: date('effective_from').notNull(),
  effectiveTo: date('effective_to'),
  autoRenewal: boolean('auto_renewal').default(false),
  renewalPeriodMonths: integer('renewal_period_months'),
  
  // Services covered
  coveredServices: text('covered_services').array(),
  coveredDepartments: varchar('covered_departments', { length: 100 }).array(),
  coveredProcedures: text('covered_procedures').array(),
  
  // Financial terms
  paymentTerms: varchar('payment_terms', { length: 100 }), // Per-Service, Monthly, Quarterly, Revenue-Share
  revenueSharePercentage: decimal('revenue_share_percentage', { precision: 5, scale: 2 }),
  minimumGuaranteedAmount: decimal('minimum_guaranteed_amount', { precision: 12, scale: 2 }),
  billingCycleDays: integer('billing_cycle_days').default(30),
  
  // Service levels
  slaResponseTimeHours: integer('sla_response_time_hours'),
  slaBedAllocationPriority: varchar('sla_bed_allocation_priority', { length: 50 }),
  slaReportSharing: boolean('sla_report_sharing').default(true),
  
  // Resource sharing
  sharedResources: jsonb('shared_resources'), // Equipment, facilities, staff
  resourceBookingAllowed: boolean('resource_booking_allowed').default(false),
  advanceBookingDays: integer('advance_booking_days'),
  
  // Compliance
  regulatoryApprovals: jsonb('regulatory_approvals'),
  insuranceCoverage: jsonb('insurance_coverage'),
  liabilityTerms: text('liability_terms'),
  
  // Performance tracking
  totalServicesUtilized: integer('total_services_utilized').default(0),
  totalRevenueGenerated: decimal('total_revenue_generated', { precision: 12, scale: 2 }).default('0'),
  lastSettlementDate: date('last_settlement_date'),
  
  // Status
  agreementStatus: varchar('agreement_status', { length: 50 }).notNull().default('Draft'), // Draft, Active, Suspended, Expired, Terminated
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  approvedBy: uuid('approved_by').references(() => users.userId),
  approvedAt: timestamp('approved_at', { mode: 'date' }),
});

// Shared Services Table - For services available across network
export const sharedServices = collaborationSchema.table('shared_services', {
  sharedServiceId: uuid('shared_service_id').primaryKey().defaultRandom(),
  networkId: uuid('network_id').references(() => hospitalNetworks.networkId),
  
  // Service details
  serviceName: varchar('service_name', { length: 200 }).notNull(),
  serviceType: varchar('service_type', { length: 100 }).notNull(), // Diagnostic, Specialist, Equipment, Facility
  serviceCategory: varchar('service_category', { length: 100 }), // Radiology, Pathology, Cardiology, etc.
  
  // Location
  hostClinicId: uuid('host_clinic_id').notNull().references(() => clinics.clinicId),
  departmentId: uuid('department_id').references(() => departments.departmentId),
  locationDetails: text('location_details'),
  
  // Availability
  availableToClinics: uuid('available_to_clinics').array(), // Array of clinic IDs
  availabilitySchedule: jsonb('availability_schedule'),
  advanceBookingRequired: boolean('advance_booking_required').default(true),
  minAdvanceBookingHours: integer('min_advance_booking_hours').default(24),
  
  // Capacity
  dailyCapacity: integer('daily_capacity'),
  currentUtilizationPercent: decimal('current_utilization_percent', { precision: 5, scale: 2 }),
  
  // Specialists (if applicable)
  specialistIds: uuid('specialist_ids').array(), // Array of doctor IDs
  specialistAvailability: jsonb('specialist_availability'),
  
  // Equipment (if applicable)
  equipmentDetails: jsonb('equipment_details'),
  maintenanceSchedule: jsonb('maintenance_schedule'),
  
  // Pricing
  pricingModel: varchar('pricing_model', { length: 50 }), // Fixed, Variable, Package
  basePrice: decimal('base_price', { precision: 10, scale: 2 }),
  networkDiscountPercent: decimal('network_discount_percent', { precision: 5, scale: 2 }),
  externalPrice: decimal('external_price', { precision: 10, scale: 2 }),
  
  // Booking management
  bookingSystem: varchar('booking_system', { length: 50 }), // Centralized, Host-Managed, First-Come
  maxBookingsPerClinicPerDay: integer('max_bookings_per_clinic_per_day'),
  
  // Quality metrics
  averageWaitTimeDays: decimal('average_wait_time_days', { precision: 5, scale: 2 }),
  serviceSatisfactionScore: decimal('service_satisfaction_score', { precision: 3, scale: 2 }),
  totalServicesProvided: integer('total_services_provided').default(0),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Network Resources Table - For shared equipment and facilities
export const networkResources = collaborationSchema.table('network_resources', {
  resourceId: uuid('resource_id').primaryKey().defaultRandom(),
  networkId: uuid('network_id').references(() => hospitalNetworks.networkId),
  
  // Resource identification
  resourceName: varchar('resource_name', { length: 200 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(), // Equipment, Ambulance, BloodBank, ICU-Bed
  resourceCategory: varchar('resource_category', { length: 100 }),
  resourceCode: varchar('resource_code', { length: 50 }).unique().notNull(),
  
  // Ownership
  ownerClinicId: uuid('owner_clinic_id').notNull().references(() => clinics.clinicId),
  managingDepartmentId: uuid('managing_department_id').references(() => departments.departmentId),
  
  // Specifications
  specifications: jsonb('specifications'),
  capacityDetails: jsonb('capacity_details'),
  
  // Sharing configuration
  sharingEnabled: boolean('sharing_enabled').default(true),
  sharingPriority: varchar('sharing_priority', { length: 50 }), // Network-First, Owner-First, Equal
  availableToClinics: uuid('available_to_clinics').array(),
  
  // Availability tracking
  currentStatus: varchar('current_status', { length: 50 }).notNull().default('Available'), // Available, In-Use, Maintenance, Reserved
  currentUserClinicId: uuid('current_user_clinic_id').references(() => clinics.clinicId),
  currentUserDetails: jsonb('current_user_details'),
  
  // Booking system
  requiresBooking: boolean('requires_booking').default(true),
  bookingLeadTimeHours: integer('booking_lead_time_hours').default(2),
  maxBookingDurationHours: integer('max_booking_duration_hours'),
  currentBookings: jsonb('current_bookings'),
  
  // Usage tracking
  totalUsageHours: decimal('total_usage_hours', { precision: 10, scale: 2 }).default('0'),
  totalBookings: integer('total_bookings').default(0),
  utilizationRatePercent: decimal('utilization_rate_percent', { precision: 5, scale: 2 }),
  
  // Maintenance
  lastMaintenanceDate: date('last_maintenance_date'),
  nextMaintenanceDate: date('next_maintenance_date'),
  maintenanceProvider: varchar('maintenance_provider', { length: 200 }),
  
  // Cost sharing
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  maintenanceCostSharing: jsonb('maintenance_cost_sharing'),
  
  // Standard fields
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// ============================================================================
// TELEMEDICINE SCHEMA TABLES
// ============================================================================

// Video Consultation Sessions - Core telemedicine table
export const videoSessions = telemedicineSchema.table('video_sessions', {
  sessionId: uuid('session_id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id').notNull().references(() => appointments.appointmentId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  
  // Participants
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  attendingStaff: uuid('attending_staff').array(), // Array of staff member IDs who joined
  
  // Session details
  sessionType: consultationModeEnum('session_type').notNull().default('Video'),
  sessionStatus: videoSessionStatusEnum('session_status').notNull().default('Scheduled'),
  platform: varchar('platform', { length: 50 }), // Zoom, Google Meet, WebRTC, Custom
  meetingRoomId: varchar('meeting_room_id', { length: 200 }),
  meetingPassword: varchar('meeting_password', { length: 100 }),
  
  // Timeline
  scheduledStartTime: timestamp('scheduled_start_time', { mode: 'date' }).notNull(),
  scheduledEndTime: timestamp('scheduled_end_time', { mode: 'date' }).notNull(),
  actualStartTime: timestamp('actual_start_time', { mode: 'date' }),
  actualEndTime: timestamp('actual_end_time', { mode: 'date' }),
  totalDurationMinutes: integer('total_duration_minutes'),
  
  // Technical details
  patientDeviceType: deviceTypeEnum('patient_device_type'),
  doctorDeviceType: deviceTypeEnum('doctor_device_type'),
  connectionQuality: connectionQualityEnum('connection_quality'),
  bandwidthTestResults: jsonb('bandwidth_test_results'),
  technicalIssues: text('technical_issues').array(),
  
  // Session configuration
  recordingEnabled: boolean('recording_enabled').default(false),
  recordingStatus: recordingStatusEnum('recording_status').default('Not-Recorded'),
  recordingUrl: text('recording_url'),
  recordingDurationMinutes: integer('recording_duration_minutes'),
  
  // Consent management
  patientConsentForRecording: boolean('patient_consent_for_recording'),
  patientConsentForDataSharing: boolean('patient_consent_for_data_sharing'),
  consentTimestamp: timestamp('consent_timestamp', { mode: 'date' }),
  consentIpAddress: varchar('consent_ip_address', { length: 45 }),
  
  // Telemedicine compliance
  complianceChecklist: telemedicineComplianceEnum('compliance_checklist').array(),
  patientIdentityVerified: boolean('patient_identity_verified').default(false),
  emergencyContactAvailable: boolean('emergency_contact_available').default(false),
  technicalSupportContact: varchar('technical_support_contact', { length: 50 }),
  
  // Session metadata
  sessionNotes: text('session_notes'),
  postSessionSurvey: jsonb('post_session_survey'),
  followUpRequired: boolean('follow_up_required').default(false),
  nextVideoSessionDate: timestamp('next_video_session_date', { mode: 'date' }),
  
  // Billing integration
  telemedicineCharges: decimal('telemedicine_charges', { precision: 10, scale: 2 }),
  platformFees: decimal('platform_fees', { precision: 10, scale: 2 }),
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  appointmentIdIdx: index('video_sessions_appointment_id_idx').on(table.appointmentId),
  sessionStatusIdx: index('video_sessions_status_idx').on(table.sessionStatus),
  scheduledTimeIdx: index('video_sessions_scheduled_time_idx').on(table.scheduledStartTime),
  patientDoctorIdx: index('video_sessions_patient_doctor_idx').on(table.patientId, table.doctorId),
}));

// Digital Prescriptions - Enhanced prescription management for telemedicine
export const digitalPrescriptions = telemedicineSchema.table('digital_prescriptions', {
  digitalPrescriptionId: uuid('digital_prescription_id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').references(() => consultations.consultationId),
  videoSessionId: uuid('video_session_id').references(() => videoSessions.sessionId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  
  // Parties involved
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  pharmacyId: uuid('pharmacy_id').references(() => clinics.clinicId), // Target pharmacy
  
  // Prescription details
  prescriptionType: digitalPrescriptionTypeEnum('prescription_type').notNull().default('E-Prescription'),
  prescriptionNumber: varchar('prescription_number', { length: 50 }).unique().notNull(),
  prescriptionStatus: prescriptionStatusEnum('prescription_status').notNull().default('Draft'),
  
  // Digital signature & validation
  doctorDigitalSignature: text('doctor_digital_signature'), // Base64 encoded signature
  digitalCertificateId: varchar('digital_certificate_id', { length: 100 }),
  signatureTimestamp: timestamp('signature_timestamp', { mode: 'date' }),
  verificationCode: varchar('verification_code', { length: 20 }).unique(),
  qrCodeData: text('qr_code_data'), // QR code for verification
  
  // Prescription content
  medications: jsonb('medications'), // Detailed medication list with dosages
  investigationsRecommended: text('investigations_recommended').array(),
  dietaryInstructions: text('dietary_instructions'),
  followUpInstructions: text('follow_up_instructions'),
  warningsAndPrecautions: text('warnings_and_precautions').array(),
  
  // Validity
  prescriptionDate: timestamp('prescription_date', { mode: 'date' }).defaultNow(),
  validUntil: date('valid_until').notNull(),
  refillsAllowed: integer('refills_allowed').default(0),
  refillsUsed: integer('refills_used').default(0),
  
  // Delivery options
  deliveryMethod: varchar('delivery_method', { length: 50 }), // SMS, Email, WhatsApp, Portal, Pharmacy-Direct
  sentToPatientAt: timestamp('sent_to_patient_at', { mode: 'date' }),
  sentToPharmacyAt: timestamp('sent_to_pharmacy_at', { mode: 'date' }),
  patientViewedAt: timestamp('patient_viewed_at', { mode: 'date' }),
  
  // Compliance tracking
  regulatoryCompliance: jsonb('regulatory_compliance'), // MCI, NABH compliance flags
  auditTrail: jsonb('audit_trail'), // Track all modifications
  emergencyPrescription: boolean('emergency_prescription').default(false),
  
  // Integration
  pharmacyNotified: boolean('pharmacy_notified').default(false),
  insuranceNotified: boolean('insurance_notified').default(false),
  governmentPortalSynced: boolean('government_portal_synced').default(false),
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  version: integer('version').default(1),
}, table => ({
  prescriptionNumberIdx: uniqueIndex('digital_prescriptions_number_idx').on(table.prescriptionNumber),
  patientDoctorIdx: index('digital_prescriptions_patient_doctor_idx').on(table.patientId, table.doctorId),
  statusIdx: index('digital_prescriptions_status_idx').on(table.prescriptionStatus),
  validityIdx: index('digital_prescriptions_validity_idx').on(table.validUntil),
  verificationCodeIdx: index('digital_prescriptions_verification_idx').on(table.verificationCode),
}));

// Telemedicine Patient Monitoring - Remote monitoring capabilities
export const patientRemoteMonitoring = telemedicineSchema.table('patient_remote_monitoring', {
  monitoringId: uuid('monitoring_id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  
  // Monitoring program
  programName: varchar('program_name', { length: 200 }).notNull(),
  programType: varchar('program_type', { length: 50 }), // Chronic-Care, Post-Op, Pregnancy, Elderly-Care
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  monitoringFrequency: varchar('monitoring_frequency', { length: 50 }), // Daily, Weekly, Bi-weekly, Monthly
  
  // Patient devices
  connectedDevices: jsonb('connected_devices'), // BP monitor, glucometer, pulse oximeter, weighing scale
  deviceData: jsonb('device_data'), // Latest readings from connected devices
  lastSyncTimestamp: timestamp('last_sync_timestamp', { mode: 'date' }),
  
  // Vitals tracking
  vitalsTrends: jsonb('vitals_trends'), // Historical vital signs data
  alertThresholds: jsonb('alert_thresholds'), // Custom thresholds for alerts
  criticalAlerts: jsonb('critical_alerts'), // Active alerts requiring immediate attention
  
  // Patient reported data
  symptomReports: jsonb('symptom_reports'), // Patient-reported symptoms
  medicationAdherence: jsonb('medication_adherence'), // Medication compliance tracking
  dailyActivityData: jsonb('daily_activity_data'), // Steps, sleep, activity levels
  
  // Care team monitoring
  assignedNurses: uuid('assigned_nurses').array(), // Monitoring nurses
  escalationProtocol: jsonb('escalation_protocol'), // When to escalate to doctor
  lastReviewedAt: timestamp('last_reviewed_at', { mode: 'date' }),
  lastReviewedBy: uuid('last_reviewed_by').references(() => users.userId),
  
  // Communication
  patientEngagementScore: integer('patient_engagement_score'), // 1-100 engagement rating
  autoRemindersEnabled: boolean('auto_reminders_enabled').default(true),
  emergencyContactProtocol: jsonb('emergency_contact_protocol'),
  
  // Outcomes tracking
  healthImprovementScore: decimal('health_improvement_score', { precision: 5, scale: 2 }),
  programCompletionPercentage: decimal('program_completion_percentage', { precision: 5, scale: 2 }),
  satisfactionScore: integer('satisfaction_score'), // 1-5 patient satisfaction
  
  // Status
  isActive: boolean('is_active').default(true),
  pausedAt: timestamp('paused_at', { mode: 'date' }),
  pauseReason: text('pause_reason'),
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  patientIdx: index('patient_remote_monitoring_patient_idx').on(table.patientId),
  doctorIdx: index('patient_remote_monitoring_doctor_idx').on(table.doctorId),
  activeIdx: index('patient_remote_monitoring_active_idx').on(table.isActive),
  programTypeIdx: index('patient_remote_monitoring_program_type_idx').on(table.programType),
}));

// Telemedicine Billing - Specialized billing for virtual consultations
export const telemedicineBilling = telemedicineSchema.table('telemedicine_billing', {
  telemedicineBillId: uuid('telemedicine_bill_id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id').notNull().references(() => clinics.clinicId),
  
  // Related entities
  videoSessionId: uuid('video_session_id').references(() => videoSessions.sessionId),
  digitalPrescriptionId: uuid('digital_prescription_id').references(() => digitalPrescriptions.digitalPrescriptionId),
  patientId: uuid('patient_id').notNull().references(() => patients.patientId),
  doctorId: uuid('doctor_id').notNull().references(() => users.userId),
  
  // Billing details
  billNumber: varchar('bill_number', { length: 50 }).unique().notNull(),
  billDate: timestamp('bill_date', { mode: 'date' }).defaultNow(),
  serviceType: varchar('service_type', { length: 50 }), // Video-Consultation, Digital-Prescription, Remote-Monitoring
  
  // Charges breakdown
  consultationCharges: decimal('consultation_charges', { precision: 10, scale: 2 }).notNull(),
  technologyFee: decimal('technology_fee', { precision: 10, scale: 2 }).default('0'),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).default('0'),
  convenienceFee: decimal('convenience_fee', { precision: 10, scale: 2 }).default('0'),
  prescriptionFee: decimal('prescription_fee', { precision: 10, scale: 2 }).default('0'),
  
  // Telemedicine specific charges
  recordingFee: decimal('recording_fee', { precision: 10, scale: 2 }).default('0'),
  dataStorageFee: decimal('data_storage_fee', { precision: 10, scale: 2 }).default('0'),
  remoteMonitoringFee: decimal('remote_monitoring_fee', { precision: 10, scale: 2 }).default('0'),
  
  // Total amounts
  grossAmount: decimal('gross_amount', { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0'),
  netAmount: decimal('net_amount', { precision: 12, scale: 2 }).notNull(),
  
  // Payment details
  paymentStatus: billStatusEnum('payment_status').default('Pending'),
  paymentMethod: paymentMethodEnum('payment_method'),
  paymentGateway: varchar('payment_gateway', { length: 50 }), // Razorpay, PayU, Paytm
  transactionId: varchar('transaction_id', { length: 100 }),
  paymentTimestamp: timestamp('payment_timestamp', { mode: 'date' }),
  
  // Insurance and schemes
  insuranceApplicable: boolean('insurance_applicable').default(false),
  governmentSchemeApplicable: boolean('government_scheme_applicable').default(false),
  schemeCoverageAmount: decimal('scheme_coverage_amount', { precision: 10, scale: 2 }).default('0'),
  patientPayableAmount: decimal('patient_payable_amount', { precision: 10, scale: 2 }),
  
  // Compliance
  telemedicineTaxCompliance: boolean('telemedicine_tax_compliance').default(true),
  gstApplicable: boolean('gst_applicable').default(true),
  gstNumber: varchar('gst_number', { length: 50 }),
  
  // Digital receipt
  digitalReceiptUrl: text('digital_receipt_url'),
  sentToPatientEmail: boolean('sent_to_patient_email').default(false),
  sentToPatientSMS: boolean('sent_to_patient_sms').default(false),
  
  // Standard fields
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId),
}, table => ({
  billNumberIdx: uniqueIndex('telemedicine_billing_bill_number_idx').on(table.billNumber),
  patientIdx: index('telemedicine_billing_patient_idx').on(table.patientId),
  paymentStatusIdx: index('telemedicine_billing_payment_status_idx').on(table.paymentStatus),
  billDateIdx: index('telemedicine_billing_date_idx').on(table.billDate),
  videoSessionIdx: index('telemedicine_billing_video_session_idx').on(table.videoSessionId),
}));

// ============================================================================
// RE-EXPORT SCHEMA EXTENSIONS
// ============================================================================

// export * from './SchemaExtensions'; // Temporarily disabled to avoid circular dependency
