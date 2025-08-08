CREATE SCHEMA "appointments";
--> statement-breakpoint
CREATE SCHEMA "audit";
--> statement-breakpoint
CREATE SCHEMA "billing";
--> statement-breakpoint
CREATE SCHEMA "clinical";
--> statement-breakpoint
CREATE SCHEMA "collaboration";
--> statement-breakpoint
CREATE SCHEMA "communication";
--> statement-breakpoint
CREATE SCHEMA "config";
--> statement-breakpoint
CREATE SCHEMA "core";
--> statement-breakpoint
CREATE SCHEMA "insurance";
--> statement-breakpoint
CREATE SCHEMA "inventory";
--> statement-breakpoint
CREATE SCHEMA "laboratory";
--> statement-breakpoint
CREATE SCHEMA "network";
--> statement-breakpoint
CREATE SCHEMA "programs";
--> statement-breakpoint
CREATE SCHEMA "reports";
--> statement-breakpoint
CREATE SCHEMA "security";
--> statement-breakpoint
CREATE TYPE "public"."appointment_status_enum" AS ENUM('Scheduled', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled', 'No-Show', 'Rescheduled');--> statement-breakpoint
CREATE TYPE "public"."audit_action_enum" AS ENUM('create', 'read', 'update', 'delete', 'emergency_access');--> statement-breakpoint
CREATE TYPE "public"."audit_resource_enum" AS ENUM('patient', 'medical_record', 'prescription', 'appointment', 'admission', 'consultation', 'lab_test', 'imaging', 'billing', 'user', 'role', 'department', 'audit_log', 'system_setting', 'sso_connection');--> statement-breakpoint
CREATE TYPE "public"."bed_status_enum" AS ENUM('Available', 'Occupied', 'Under-Maintenance', 'Blocked', 'Dirty');--> statement-breakpoint
CREATE TYPE "public"."bill_status_enum" AS ENUM('Draft', 'Pending', 'Partially-Paid', 'Paid', 'Overdue', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."blood_group_enum" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."care_plan_status_enum" AS ENUM('Active', 'Completed', 'Overdue', 'Cancelled', 'On-Hold');--> statement-breakpoint
CREATE TYPE "public"."communication_type_enum" AS ENUM('sms', 'whatsapp', 'email', 'voice_call', 'push_notification');--> statement-breakpoint
CREATE TYPE "public"."condition_severity_enum" AS ENUM('Mild', 'Moderate', 'Severe', 'Fatal');--> statement-breakpoint
CREATE TYPE "public"."employment_type_enum" AS ENUM('Permanent', 'Contract', 'Part-Time', 'Visiting', 'Intern', 'Resident', 'Volunteer', 'Consultant', 'Temporary');--> statement-breakpoint
CREATE TYPE "public"."equipment_status_enum" AS ENUM('Functional', 'Maintenance-Required', 'Critical-Failure', 'Calibration-Due', 'Out-of-Service');--> statement-breakpoint
CREATE TYPE "public"."equipment_type_enum" AS ENUM('Ventilator', 'Cardiac-Monitor', 'Infusion-Pump', 'Defibrillator', 'Oxygen-Concentrator', 'IABP', 'ECMO', 'Dialysis-Machine');--> statement-breakpoint
CREATE TYPE "public"."family_appointment_type_enum" AS ENUM('Family-Checkup', 'Vaccination', 'Consultation', 'Health-Camp', 'Other');--> statement-breakpoint
CREATE TYPE "public"."family_income_category_enum" AS ENUM('BPL', 'APL', 'AAY', 'Others');--> statement-breakpoint
CREATE TYPE "public"."family_member_status_enum" AS ENUM('Active', 'Inactive', 'Deceased');--> statement-breakpoint
CREATE TYPE "public"."family_relationship_enum" AS ENUM('SELF', 'SPOUSE', 'FATHER', 'MOTHER', 'SON', 'DAUGHTER', 'BROTHER', 'SISTER', 'GRANDFATHER', 'GRANDMOTHER', 'GRANDSON', 'GRANDDAUGHTER', 'UNCLE', 'AUNT', 'NEPHEW', 'NIECE', 'COUSIN', 'FATHER_IN_LAW', 'MOTHER_IN_LAW', 'SON_IN_LAW', 'DAUGHTER_IN_LAW', 'BROTHER_IN_LAW', 'SISTER_IN_LAW', 'GUARDIAN', 'CARETAKER', 'FRIEND', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('Male', 'Female', 'Other');--> statement-breakpoint
CREATE TYPE "public"."government_scheme_enum" AS ENUM('Ayushman-Bharat', 'CGHS', 'ESIC', 'State-Scheme', 'ECHS', 'Railway-Medical', 'Jan-Aushadhi', 'Pradhan-Mantri-Suraksha-Bima', 'Rashtriya-Swasthya-Bima');--> statement-breakpoint
CREATE TYPE "public"."icu_alert_severity_enum" AS ENUM('Low', 'Medium', 'High', 'Critical', 'Emergency');--> statement-breakpoint
CREATE TYPE "public"."icu_alert_type_enum" AS ENUM('Vital-Critical', 'Equipment-Failure', 'Medication-Due', 'Protocol-Violation', 'Emergency-Response', 'Staff-Required');--> statement-breakpoint
CREATE TYPE "public"."icu_bed_status_enum" AS ENUM('Available', 'Occupied', 'Maintenance', 'Isolation', 'Reserved', 'Out-of-Service');--> statement-breakpoint
CREATE TYPE "public"."icu_bed_type_enum" AS ENUM('General', 'Isolation', 'Cardiac', 'Neurological', 'Pediatric', 'Neonatal');--> statement-breakpoint
CREATE TYPE "public"."icu_shift_status_enum" AS ENUM('Scheduled', 'Active', 'Completed', 'Missed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."icu_shift_type_enum" AS ENUM('Morning', 'Evening', 'Night', 'Extended');--> statement-breakpoint
CREATE TYPE "public"."legal_document_type_enum" AS ENUM('Birth-Certificate', 'Court-Order', 'Notarized-Letter', 'Other');--> statement-breakpoint
CREATE TYPE "public"."medication_route_enum" AS ENUM('Oral', 'IV', 'IM', 'SC', 'Topical', 'Inhalation', 'Rectal', 'Sublingual', 'Buccal', 'Nasal', 'Ophthalmic', 'Otic');--> statement-breakpoint
CREATE TYPE "public"."message_status_enum" AS ENUM('pending', 'sent', 'delivered', 'failed', 'read');--> statement-breakpoint
CREATE TYPE "public"."nursing_note_type_enum" AS ENUM('Admission', 'Routine', 'Procedure', 'Education', 'Discharge', 'Incident', 'Handover', 'Assessment', 'Medication', 'Progress');--> statement-breakpoint
CREATE TYPE "public"."patient_status_enum" AS ENUM('admitted', 'outpatient', 'discharged', 'emergency', 'inactive', 'deceased');--> statement-breakpoint
CREATE TYPE "public"."payment_method_enum" AS ENUM('Cash', 'Card', 'UPI', 'Net-Banking', 'Cheque', 'DD', 'Insurance');--> statement-breakpoint
CREATE TYPE "public"."policy_type_enum" AS ENUM('Family-Floater', 'Individual-Sum-Insured', 'Group-Cover');--> statement-breakpoint
CREATE TYPE "public"."queue_status_enum" AS ENUM('Waiting', 'Called', 'In-Progress', 'Completed', 'Skipped');--> statement-breakpoint
CREATE TYPE "public"."relationship_category_enum" AS ENUM('Immediate', 'Extended', 'Guardian', 'Other');--> statement-breakpoint
CREATE TYPE "public"."severity_enum" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."shift_type_enum" AS ENUM('Morning', 'Evening', 'Night', 'Rotating', 'On-Call', 'Day-Shift', 'Split-Shift', 'Flexible');--> statement-breakpoint
CREATE TYPE "public"."user_role_category_enum" AS ENUM('Medical', 'Nursing', 'Diagnostic', 'Pharmacy', 'Administrative', 'Support-Services', 'Allied-Health', 'Indian-Healthcare', 'Management');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab-Technician', 'Admin', 'Accountant', 'Manager', 'Support-Staff', 'Billing-Manager', 'Medical-Superintendent', 'Deputy-Medical-Superintendent', 'Senior-Doctor', 'Junior-Doctor', 'Resident-Medical-Officer', 'House-Officer', 'Visiting-Consultant', 'Specialist-Consultant', 'Surgeon', 'Assistant-Surgeon', 'Anesthesiologist', 'Radiologist', 'Pathologist', 'Microbiologist', 'Emergency-Medicine-Doctor', 'ICU-Specialist', 'Pediatrician', 'Gynecologist', 'Orthopedic-Surgeon', 'Cardiologist', 'Neurologist', 'Dermatologist', 'ENT-Specialist', 'Ophthalmologist', 'Psychiatrist', 'General-Surgeon', 'Chief-Nursing-Officer', 'Deputy-Nursing-Officer', 'Nursing-Superintendent', 'Nursing-Supervisor', 'Staff-Nurse', 'Senior-Staff-Nurse', 'Nursing-Assistant', 'Nursing-Intern', 'Ward-Sister', 'ICU-Nurse', 'OT-Nurse', 'Emergency-Nurse', 'Midwife', 'Chief-Lab-Technician', 'Senior-Lab-Technician', 'Radiology-Technician', 'X-Ray-Technician', 'CT-Technician', 'MRI-Technician', 'ECG-Technician', 'Echo-Technician', 'EEG-Technician', 'Dialysis-Technician', 'OT-Technician', 'CSSD-Technician', 'Anesthesia-Technician', 'Chief-Pharmacist', 'Senior-Pharmacist', 'Clinical-Pharmacist', 'Pharmacy-Assistant', 'Hospital-Administrator', 'Assistant-Administrator', 'HR-Manager', 'HR-Executive', 'Finance-Manager', 'Marketing-Manager', 'Quality-Manager', 'IT-Manager', 'IT-Support-Executive', 'Stores-Manager', 'Purchase-Officer', 'Medical-Records-Officer', 'Ward-Boy', 'Ward-Girl', 'Ward-Attendant', 'Patient-Care-Assistant', 'Housekeeping-Supervisor', 'Housekeeping-Staff', 'Security-Supervisor', 'Security-Guard', 'Ambulance-Driver', 'Ambulance-EMT', 'Transport-Coordinator', 'Front-Office-Executive', 'Admission-Counselor', 'Insurance-Coordinator', 'Patient-Relations-Officer', 'Physiotherapist', 'Occupational-Therapist', 'Speech-Therapist', 'Dietitian', 'Clinical-Nutritionist', 'Medical-Social-Worker', 'Clinical-Psychologist', 'Counselor', 'ASHA-Worker', 'ANM', 'CHO', 'MPW', 'Ayush-Doctor', 'Ayurveda-Practitioner', 'Yoga-Instructor', 'Unani-Practitioner', 'Siddha-Practitioner', 'Homeopathy-Doctor', 'Camp-Coordinator', 'Scheme-Coordinator', 'Field-Health-Worker');--> statement-breakpoint
CREATE TYPE "public"."user_status_enum" AS ENUM('Active', 'Inactive', 'Suspended', 'Terminated');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"organization_id" text NOT NULL,
	"hashed_key" text NOT NULL,
	"expires_at" timestamp,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_hashed_key_unique" UNIQUE("hashed_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments"."appointments" (
	"appointment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_code" varchar(20) NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"appointment_date" date NOT NULL,
	"appointment_time" time NOT NULL,
	"appointment_end_time" time,
	"appointment_type" varchar(50) DEFAULT 'Consultation',
	"visit_type" varchar(20) DEFAULT 'First-Visit',
	"status" "appointment_status_enum" DEFAULT 'Scheduled',
	"checked_in_at" timestamp,
	"consultation_start_at" timestamp,
	"consultation_end_at" timestamp,
	"token_number" integer,
	"queue_priority" integer DEFAULT 0,
	"scheduled_by" uuid,
	"scheduled_at" timestamp DEFAULT now(),
	"rescheduled_from" uuid,
	"cancellation_reason" text,
	"cancelled_by" uuid,
	"consultation_fee" numeric(10, 2),
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"discount_reason" varchar(200),
	"chief_complaint" text,
	"appointment_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"version" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit"."audit_logs" (
	"audit_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"actor_name" varchar(200) NOT NULL,
	"actor_email" varchar(100),
	"actor_role" varchar(100),
	"action" "audit_action_enum" NOT NULL,
	"resource" "audit_resource_enum" NOT NULL,
	"resource_id" uuid,
	"resource_name" varchar(200),
	"changes" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"session_id" varchar(100),
	"request_id" varchar(100),
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"duration" integer,
	"flags" text[] DEFAULT '{}',
	"severity" "severity_enum" DEFAULT 'medium',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"retention_period" integer DEFAULT 2555,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."clinics" (
	"clinic_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid,
	"clinic_name" varchar(200) NOT NULL,
	"clinic_code" varchar(50) NOT NULL,
	"clinic_type" varchar(100) DEFAULT 'Private',
	"registration_number" varchar(100),
	"ayushman_bharat_id" varchar(100),
	"cghs_empanelment_number" varchar(100),
	"esic_registration_number" varchar(100),
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) DEFAULT 'India',
	"pincode" varchar(10) NOT NULL,
	"phone" varchar(20),
	"email" varchar(100),
	"website" varchar(200),
	"total_beds" integer DEFAULT 0,
	"icu_beds" integer DEFAULT 0,
	"emergency_beds" integer DEFAULT 0,
	"services_offered" text[],
	"specialties" text[],
	"operating_hours" jsonb,
	"emergency_services_24x7" boolean DEFAULT false,
	"multi_tenant" boolean DEFAULT true,
	"timezone" varchar(50) DEFAULT 'Asia/Kolkata',
	"default_language" varchar(10) DEFAULT 'en',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clinics_clinic_code_unique" UNIQUE("clinic_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical"."consultations" (
	"consultation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"appointment_id" uuid,
	"consultation_date" timestamp DEFAULT now(),
	"consultation_type" varchar(50) DEFAULT 'OPD',
	"vitals" jsonb,
	"chief_complaint" text,
	"history_of_present_illness" text,
	"past_medical_history" text,
	"family_history" text,
	"social_history" text,
	"general_examination" text,
	"systemic_examination" text,
	"local_examination" text,
	"provisional_diagnosis" text[],
	"final_diagnosis" text[],
	"icd10_codes" varchar(10)[],
	"treatment_plan" text,
	"follow_up_date" date,
	"follow_up_instructions" text,
	"referred_to" uuid,
	"referral_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."department_services" (
	"service_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"service_name" varchar(200) NOT NULL,
	"service_code" varchar(50) NOT NULL,
	"description" text,
	"category" varchar(100),
	"sub_category" varchar(100),
	"default_duration" integer DEFAULT 30,
	"base_price" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'INR',
	"is_active" boolean DEFAULT true,
	"is_emergency_service" boolean DEFAULT false,
	"requires_24x7" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."departments" (
	"department_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"department_name" varchar(100) NOT NULL,
	"department_code" varchar(20) NOT NULL,
	"department_type" varchar(50),
	"hod_id" uuid,
	"floor_number" integer,
	"wing" varchar(50),
	"total_staff" integer DEFAULT 0,
	"bed_capacity" integer DEFAULT 0,
	"services_provided" text[],
	"equipment_available" text[],
	"is_revenue_generating" boolean DEFAULT true,
	"is_emergency_service" boolean DEFAULT false,
	"operates_24x7" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."doctor_schedules" (
	"schedule_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"day_of_week" integer,
	"schedule_date" date,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"consultation_duration" integer DEFAULT 15,
	"max_appointments" integer,
	"buffer_time" integer DEFAULT 5,
	"schedule_type" varchar(20) DEFAULT 'Regular',
	"is_active" boolean DEFAULT true,
	"effective_from" date DEFAULT now() NOT NULL,
	"effective_till" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments"."family_appointments" (
	"family_appointment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"appointment_date" date NOT NULL,
	"appointment_time" time NOT NULL,
	"appointment_type" "family_appointment_type_enum",
	"member_appointments" jsonb DEFAULT '[]'::jsonb,
	"booked_by" uuid NOT NULL,
	"booked_at" timestamp DEFAULT now(),
	"status" "appointment_status_enum" DEFAULT 'Scheduled',
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."family_groups" (
	"family_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_code" varchar(20) NOT NULL,
	"family_name" varchar(200),
	"primary_member_id" uuid,
	"address_line1" varchar(500),
	"address_line2" varchar(500),
	"city" varchar(100),
	"state" varchar(100),
	"pincode" varchar(10),
	"primary_phone" varchar(20),
	"secondary_phone" varchar(20),
	"email" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	"ration_card_number" varchar(50),
	"family_income_category" "family_income_category_enum",
	CONSTRAINT "family_groups_family_code_unique" UNIQUE("family_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance"."family_insurance" (
	"family_insurance_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"insurance_provider" varchar(100) NOT NULL,
	"policy_number" varchar(100) NOT NULL,
	"policy_type" "policy_type_enum",
	"total_sum_insured" numeric(12, 2),
	"remaining_sum_insured" numeric(12, 2),
	"covered_members" jsonb DEFAULT '[]'::jsonb,
	"primary_member_id" uuid,
	"policy_start_date" date NOT NULL,
	"policy_end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "family_insurance_policy_number_unique" UNIQUE("policy_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical"."family_medical_history" (
	"history_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"patient_id" uuid,
	"condition_name" varchar(200) NOT NULL,
	"icd10_code" varchar(10),
	"affected_relationship" "family_relationship_enum",
	"affected_count" integer DEFAULT 1,
	"age_of_onset" integer,
	"severity" "condition_severity_enum",
	"is_hereditary" boolean DEFAULT false,
	"notes" text,
	"reported_by" uuid NOT NULL,
	"reported_date" date DEFAULT now(),
	"verified_by" uuid,
	"verification_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."family_members" (
	"member_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"relationship_to_primary" "family_relationship_enum",
	"relationship_details" jsonb DEFAULT '{}'::jsonb,
	"is_primary_member" boolean DEFAULT false,
	"is_earning_member" boolean DEFAULT false,
	"is_dependent" boolean DEFAULT true,
	"share_medical_history" boolean DEFAULT false,
	"share_insurance" boolean DEFAULT true,
	"share_billing" boolean DEFAULT true,
	"consent_date" timestamp,
	"consent_by" uuid,
	"join_date" date DEFAULT now(),
	"leave_date" date,
	"status" "family_member_status_enum" DEFAULT 'Active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."government_schemes" (
	"scheme_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"scheme_name" "government_scheme_enum" NOT NULL,
	"scheme_code" varchar(50) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"empanelment_number" varchar(100),
	"empanelment_date" date,
	"valid_till" date,
	"max_coverage_amount" numeric(12, 2),
	"family_size" integer,
	"nod_officer_name" varchar(200),
	"nod_officer_contact" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."guardian_relationships" (
	"guardian_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"guardian_patient_id" uuid NOT NULL,
	"relationship_type" "family_relationship_enum" NOT NULL,
	"is_primary_guardian" boolean DEFAULT false,
	"legal_document_type" "legal_document_type_enum",
	"document_number" varchar(100),
	"document_copy" varchar(500),
	"can_consent_medical" boolean DEFAULT true,
	"can_access_records" boolean DEFAULT true,
	"can_approve_procedures" boolean DEFAULT false,
	"effective_from" date DEFAULT now(),
	"effective_until" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"verified_by" uuid,
	"verification_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."hospital_networks" (
	"network_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_name" varchar(200) NOT NULL,
	"network_code" varchar(50) NOT NULL,
	"headquarters_address" text,
	"total_hospitals" integer DEFAULT 0,
	"total_beds" integer DEFAULT 0,
	"contact_person" varchar(200),
	"contact_phone" varchar(20),
	"contact_email" varchar(100),
	"shared_patient_records" boolean DEFAULT true,
	"shared_inventory" boolean DEFAULT false,
	"centralized_billing" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hospital_networks_network_code_unique" UNIQUE("network_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical"."icu_beds" (
	"icu_bed_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"bed_number" varchar(10) NOT NULL,
	"bed_type" "icu_bed_type_enum" DEFAULT 'General' NOT NULL,
	"patient_id" uuid,
	"status" "icu_bed_status_enum" DEFAULT 'Available' NOT NULL,
	"last_sanitized" timestamp,
	"monitoring_equipment" jsonb DEFAULT '{}'::jsonb,
	"cardiac_monitoring_level" varchar(20),
	"telemetry_enabled" boolean DEFAULT false,
	"oxygen_supply_type" varchar(20) DEFAULT 'Central',
	"backup_oxygen_available" boolean DEFAULT false,
	"isolation_capable" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical"."icu_critical_alerts" (
	"alert_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"icu_bed_id" uuid NOT NULL,
	"alert_type" "icu_alert_type_enum" NOT NULL,
	"severity" "icu_alert_severity_enum" NOT NULL,
	"message" text NOT NULL,
	"alert_data" jsonb DEFAULT '{}'::jsonb,
	"acknowledged_by" uuid,
	"acknowledged_at" timestamp,
	"resolved_by" uuid,
	"resolved_at" timestamp,
	"response_time_minutes" integer,
	"escalated_to" uuid,
	"escalated_at" timestamp,
	"reported_to_authorities" boolean DEFAULT false,
	"incident_report_number" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical"."icu_nursing_care_plans" (
	"care_plan_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"icu_bed_id" uuid NOT NULL,
	"assigned_nurse_id" uuid NOT NULL,
	"care_plan_template_id" uuid,
	"care_instructions" jsonb NOT NULL,
	"cardiac_protocol_id" uuid,
	"frequency_hours" integer DEFAULT 2,
	"next_assessment_due" timestamp,
	"last_assessment_completed" timestamp,
	"fluid_balance_target" integer,
	"cardiac_medications" jsonb DEFAULT '[]'::jsonb,
	"compliance_status" "care_plan_status_enum" DEFAULT 'Active',
	"compliance_percentage" numeric(5, 2),
	"nurse_patient_ratio" numeric(3, 1) DEFAULT '2.0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."icu_staff_shifts" (
	"shift_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL,
	"shift_type" "icu_shift_type_enum" NOT NULL,
	"shift_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"patient_assignments" jsonb DEFAULT '[]'::jsonb,
	"max_patient_capacity" integer DEFAULT 2,
	"handover_notes" text,
	"handover_received_from" uuid,
	"handover_given_to" uuid,
	"handover_completed_at" timestamp,
	"status" "icu_shift_status_enum" DEFAULT 'Scheduled',
	"minimum_staff_ratio_compliance" boolean DEFAULT false,
	"specialist_availability" varchar(20) DEFAULT 'Available',
	"emergency_contact_number" varchar(15),
	"backup_staff_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role_enum" NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"invited_by" text NOT NULL,
	"accepted_at" timestamp,
	"sent_via_email" boolean DEFAULT false,
	"allowed_domains" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) NOT NULL,
	"stripe_invoice_id" varchar(191),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."medicine_master" (
	"medicine_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medicine_code" varchar(50) NOT NULL,
	"medicine_name" varchar(200) NOT NULL,
	"generic_name" varchar(200) NOT NULL,
	"category" varchar(100) NOT NULL,
	"drug_class" varchar(100),
	"schedule_type" varchar(20),
	"dosage_form" varchar(50) NOT NULL,
	"strength" varchar(50),
	"manufacturer" varchar(200),
	"brand_name" varchar(200),
	"storage_conditions" varchar(100),
	"requires_refrigeration" boolean DEFAULT false,
	"light_sensitive" boolean DEFAULT false,
	"drug_license_number" varchar(100),
	"is_banned" boolean DEFAULT false,
	"is_narcotic" boolean DEFAULT false,
	"prescription_required" boolean DEFAULT true,
	"max_retail_price" numeric(10, 2) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medicine_master_medicine_code_unique" UNIQUE("medicine_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."medicine_order_items" (
	"order_item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"medicine_id" uuid NOT NULL,
	"dosage" varchar(100),
	"frequency" varchar(50),
	"duration_days" integer,
	"duration_type" varchar(20),
	"before_food" boolean DEFAULT false,
	"after_food" boolean DEFAULT false,
	"special_instructions" text,
	"prescribed_quantity" integer NOT NULL,
	"dispensed_quantity" integer DEFAULT 0,
	"returned_quantity" integer DEFAULT 0,
	"substituted" boolean DEFAULT false,
	"substituted_medicine_id" uuid,
	"substitution_reason" text,
	"unit_price" numeric(10, 2) NOT NULL,
	"discount_percentage" numeric(5, 2) DEFAULT '0',
	"tax_percentage" numeric(5, 2) DEFAULT '0',
	"total_price" numeric(10, 2) NOT NULL,
	"inventory_id" uuid,
	"batch_number" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."medicine_orders" (
	"order_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(30) NOT NULL,
	"patient_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"prescribed_by" uuid NOT NULL,
	"consultation_id" uuid,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"order_type" varchar(50) NOT NULL,
	"order_status" varchar(50) DEFAULT 'Pending' NOT NULL,
	"dispensed_by" uuid,
	"dispensed_at" timestamp,
	"total_amount" numeric(10, 2),
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"net_amount" numeric(10, 2),
	"prescription_notes" text,
	"pharmacist_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medicine_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."oauth_client" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" varchar(191) NOT NULL,
	"client_secret" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL,
	"redirect_uris" jsonb NOT NULL,
	"grants" jsonb NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_client_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."oauth_client_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"scope" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."organization" (
	"id" text PRIMARY KEY NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_subscription_price_id" text,
	"stripe_subscription_status" text,
	"stripe_subscription_current_period_end" bigint,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."patients" (
	"patient_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_code" varchar(50) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"middle_name" varchar(100),
	"date_of_birth" date NOT NULL,
	"age" integer,
	"gender" "gender_enum" NOT NULL,
	"phone" varchar(20),
	"phone_encrypted" text,
	"alternate_phone" varchar(20),
	"email" varchar(100),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100) DEFAULT 'India',
	"pincode" varchar(10),
	"aadhaar_number" varchar(12),
	"aadhaar_number_encrypted" text,
	"pan_number" varchar(10),
	"voter_id" varchar(20),
	"blood_group" "blood_group_enum",
	"allergies" text[],
	"chronic_conditions" text[],
	"emergency_contact_name" varchar(200),
	"emergency_contact_phone" varchar(20),
	"emergency_contact_phone_encrypted" text,
	"emergency_contact_relation" varchar(50),
	"insurance_details" jsonb,
	"government_scheme_number" varchar(100),
	"abha_number" varchar(17),
	"abha_address" varchar(100),
	"total_visits" integer DEFAULT 0,
	"last_visit_date" timestamp,
	"is_active" boolean DEFAULT true,
	"is_vip" boolean DEFAULT false,
	"status" "patient_status_enum" DEFAULT 'outpatient',
	"admission_date" timestamp,
	"discharge_date" timestamp,
	"current_department_id" uuid,
	"admission_reason" text,
	"discharge_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."pharmacy_inventory" (
	"inventory_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"medicine_id" uuid NOT NULL,
	"current_stock" integer DEFAULT 0 NOT NULL,
	"unit_of_measurement" varchar(20) NOT NULL,
	"batch_number" varchar(50),
	"expiry_date" date NOT NULL,
	"manufacturing_date" date,
	"purchase_price" numeric(10, 2) NOT NULL,
	"selling_price" numeric(10, 2) NOT NULL,
	"mrp" numeric(10, 2) NOT NULL,
	"discount_percentage" numeric(5, 2) DEFAULT '0',
	"reorder_level" integer NOT NULL,
	"minimum_stock" integer NOT NULL,
	"maximum_stock" integer NOT NULL,
	"rack_number" varchar(20),
	"shelf_number" varchar(20),
	"stock_status" varchar(50) DEFAULT 'Normal',
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."pharmacy_stock_movement" (
	"movement_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"medicine_id" uuid NOT NULL,
	"inventory_id" uuid NOT NULL,
	"movement_type" varchar(50) NOT NULL,
	"movement_date" timestamp DEFAULT now() NOT NULL,
	"quantity" integer NOT NULL,
	"unit_of_measurement" varchar(20),
	"reference_type" varchar(50),
	"reference_id" uuid,
	"stock_before" integer NOT NULL,
	"stock_after" integer NOT NULL,
	"unit_cost" numeric(10, 2),
	"total_cost" numeric(10, 2),
	"performed_by" uuid NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical"."prescription_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prescription_id" uuid NOT NULL,
	"medicine_name" varchar(200) NOT NULL,
	"generic_name" varchar(200),
	"medicine_type" varchar(50),
	"strength" varchar(50),
	"dosage" varchar(100),
	"frequency" varchar(100),
	"duration" varchar(50),
	"quantity" integer,
	"route" varchar(50) DEFAULT 'oral',
	"before_food" boolean DEFAULT false,
	"instructions" text,
	"is_controlled" boolean DEFAULT false,
	"controlled_schedule" varchar(20),
	"is_dispensed" boolean DEFAULT false,
	"dispensed_quantity" integer,
	"dispensed_by" uuid,
	"dispensed_at" timestamp,
	"display_order" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical"."prescriptions" (
	"prescription_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consultation_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"prescription_date" timestamp DEFAULT now(),
	"prescription_code" varchar(50) NOT NULL,
	"valid_till" date,
	"general_advice" text,
	"diet_advice" text,
	"diagnosis_encrypted" text,
	"follow_up_date" date,
	"follow_up_instructions" text,
	"status" varchar(20) DEFAULT 'active',
	"cancellation_reason" text,
	"cancelled_by" uuid,
	"cancelled_at" timestamp,
	"is_signed" boolean DEFAULT false,
	"signed_at" timestamp,
	"signature_data" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by" uuid,
	CONSTRAINT "prescriptions_prescription_code_unique" UNIQUE("prescription_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."queue_entries" (
	"queue_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"queue_date" date DEFAULT now() NOT NULL,
	"token_number" integer NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid,
	"status" "queue_status_enum" DEFAULT 'Waiting',
	"priority" integer DEFAULT 0,
	"arrival_time" timestamp DEFAULT now(),
	"called_time" timestamp,
	"consultation_start_time" timestamp,
	"consultation_end_time" timestamp,
	"queue_type" varchar(50) DEFAULT 'OPD',
	"service_type" varchar(100),
	"appointment_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."relationship_types" (
	"relationship_id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "core"."relationship_types_relationship_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"relationship_code" "family_relationship_enum" NOT NULL,
	"relationship_name" varchar(50) NOT NULL,
	"relationship_name_hindi" varchar(50),
	"relationship_name_local" varchar(50),
	"reverse_relationship" varchar(50),
	"category" "relationship_category_enum",
	"is_blood_relation" boolean DEFAULT false,
	"is_legal_guardian" boolean DEFAULT false,
	"display_order" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "relationship_types_relationship_code_unique" UNIQUE("relationship_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."schedule_exceptions" (
	"exception_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"exception_type" varchar(50) DEFAULT 'Leave' NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"start_time" time,
	"end_time" time,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp,
	"is_recurring" boolean DEFAULT false,
	"recurrence_pattern" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security"."security_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"event_type" text NOT NULL,
	"severity" "severity_enum" NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb,
	"user_id" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"stripe_customer_id" text,
	"status" text NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"canceled_at" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "user_role_enum" NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"invited_by" text,
	"permissions" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"middle_name" varchar(100),
	"date_of_birth" date,
	"gender" "gender_enum",
	"role" "user_role_enum" DEFAULT 'Support-Staff' NOT NULL,
	"role_category" "user_role_category_enum",
	"secondary_role" "user_role_enum",
	"employment_type" "employment_type_enum" DEFAULT 'Permanent',
	"employee_code" varchar(50),
	"reporting_to" uuid,
	"department_id" uuid,
	"shift_type" "shift_type_enum" DEFAULT 'Day-Shift',
	"weekly_off_days" integer[] DEFAULT '{0,6}',
	"joining_date" date,
	"relieving_date" date,
	"is_visiting" boolean DEFAULT false,
	"visiting_days" integer[],
	"visiting_time_start" time,
	"visiting_time_end" time,
	"consultation_fee" numeric(10, 2),
	"can_work_in_emergency" boolean DEFAULT false,
	"can_work_in_icu" boolean DEFAULT false,
	"can_work_in_ot" boolean DEFAULT false,
	"license_number" varchar(100),
	"license_expiry_date" date,
	"certifications" jsonb,
	"emergency_contact_name" varchar(200),
	"emergency_contact_phone" varchar(20),
	"emergency_contact_phone_encrypted" text,
	"blood_group" "blood_group_enum",
	"phone" varchar(20),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"pincode" varchar(10),
	"registration_number" varchar(100),
	"qualification" varchar(200),
	"specialization" varchar(200),
	"experience_years" integer,
	"is_admin" boolean DEFAULT false,
	"can_login" boolean DEFAULT true,
	"status" "user_status_enum" DEFAULT 'Active',
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"version" integer DEFAULT 1,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_employee_code_unique" UNIQUE("employee_code"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."webhook_deliveries" (
	"delivery_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"status" varchar(20) NOT NULL,
	"attempt" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"next_retry_at" timestamp,
	"last_attempt_at" timestamp,
	"response_status" integer,
	"response_headers" jsonb,
	"response_body" text,
	"error_message" text,
	"delivered_at" timestamp,
	"processing_duration" integer,
	"webhook_signature" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."webhook_endpoints" (
	"endpoint_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"url" varchar(500) NOT NULL,
	"secret" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"events" jsonb NOT NULL,
	"description" text,
	"headers" jsonb,
	"timeout" integer DEFAULT 30 NOT NULL,
	"retry_policy" jsonb NOT NULL,
	"consecutive_failures" integer DEFAULT 0,
	"last_failure_at" timestamp,
	"disabled_at" timestamp,
	"disabled_by" uuid,
	"disabled_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."webhook_events" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"resource_id" uuid NOT NULL,
	"payload" jsonb NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communication"."whatsapp_messages" (
	"message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"recipient_phone" varchar(20) NOT NULL,
	"recipient_name" varchar(200),
	"patient_id" uuid,
	"template_id" uuid,
	"message_type" "communication_type_enum" DEFAULT 'whatsapp',
	"message_content" text NOT NULL,
	"variables" jsonb DEFAULT '{}'::jsonb,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"status" "message_status_enum" DEFAULT 'pending',
	"delivery_status" varchar(50),
	"failure_reason" text,
	"whatsapp_message_id" varchar(100),
	"conversation_id" varchar(100),
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"next_retry_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communication"."whatsapp_templates" (
	"template_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"template_name" varchar(100) NOT NULL,
	"template_code" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"language" varchar(10) DEFAULT 'en',
	"header_type" varchar(20),
	"header_content" text,
	"body_content" text NOT NULL,
	"footer_content" text,
	"variables" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"is_approved" boolean DEFAULT false,
	"approved_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."appointments" ADD CONSTRAINT "appointments_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."appointments" ADD CONSTRAINT "appointments_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."appointments" ADD CONSTRAINT "appointments_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."appointments" ADD CONSTRAINT "appointments_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."appointments" ADD CONSTRAINT "appointments_scheduled_by_users_user_id_fk" FOREIGN KEY ("scheduled_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."appointments" ADD CONSTRAINT "appointments_cancelled_by_users_user_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit"."audit_logs" ADD CONSTRAINT "audit_logs_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."clinics" ADD CONSTRAINT "clinics_network_id_hospital_networks_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "core"."hospital_networks"("network_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."consultations" ADD CONSTRAINT "consultations_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."consultations" ADD CONSTRAINT "consultations_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."consultations" ADD CONSTRAINT "consultations_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."consultations" ADD CONSTRAINT "consultations_appointment_id_appointments_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "appointments"."appointments"("appointment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."consultations" ADD CONSTRAINT "consultations_referred_to_users_user_id_fk" FOREIGN KEY ("referred_to") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."consultations" ADD CONSTRAINT "consultations_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."consultations" ADD CONSTRAINT "consultations_updated_by_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."department_services" ADD CONSTRAINT "department_services_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."department_services" ADD CONSTRAINT "department_services_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."department_services" ADD CONSTRAINT "department_services_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."department_services" ADD CONSTRAINT "department_services_updated_by_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."departments" ADD CONSTRAINT "departments_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."doctor_schedules" ADD CONSTRAINT "doctor_schedules_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."doctor_schedules" ADD CONSTRAINT "doctor_schedules_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."doctor_schedules" ADD CONSTRAINT "doctor_schedules_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."doctor_schedules" ADD CONSTRAINT "doctor_schedules_updated_by_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."family_appointments" ADD CONSTRAINT "family_appointments_family_id_family_groups_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "core"."family_groups"("family_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."family_appointments" ADD CONSTRAINT "family_appointments_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments"."family_appointments" ADD CONSTRAINT "family_appointments_booked_by_patients_patient_id_fk" FOREIGN KEY ("booked_by") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."family_groups" ADD CONSTRAINT "family_groups_primary_member_id_patients_patient_id_fk" FOREIGN KEY ("primary_member_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."family_groups" ADD CONSTRAINT "family_groups_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance"."family_insurance" ADD CONSTRAINT "family_insurance_family_id_family_groups_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "core"."family_groups"("family_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance"."family_insurance" ADD CONSTRAINT "family_insurance_primary_member_id_patients_patient_id_fk" FOREIGN KEY ("primary_member_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."family_medical_history" ADD CONSTRAINT "family_medical_history_family_id_family_groups_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "core"."family_groups"("family_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."family_medical_history" ADD CONSTRAINT "family_medical_history_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."family_medical_history" ADD CONSTRAINT "family_medical_history_reported_by_patients_patient_id_fk" FOREIGN KEY ("reported_by") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."family_medical_history" ADD CONSTRAINT "family_medical_history_verified_by_users_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."family_members" ADD CONSTRAINT "family_members_family_id_family_groups_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "core"."family_groups"("family_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."family_members" ADD CONSTRAINT "family_members_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."family_members" ADD CONSTRAINT "family_members_consent_by_users_user_id_fk" FOREIGN KEY ("consent_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."family_members" ADD CONSTRAINT "family_members_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."government_schemes" ADD CONSTRAINT "government_schemes_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."guardian_relationships" ADD CONSTRAINT "guardian_relationships_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."guardian_relationships" ADD CONSTRAINT "guardian_relationships_guardian_patient_id_patients_patient_id_fk" FOREIGN KEY ("guardian_patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."guardian_relationships" ADD CONSTRAINT "guardian_relationships_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."guardian_relationships" ADD CONSTRAINT "guardian_relationships_verified_by_users_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_beds" ADD CONSTRAINT "icu_beds_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_beds" ADD CONSTRAINT "icu_beds_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_beds" ADD CONSTRAINT "icu_beds_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_critical_alerts" ADD CONSTRAINT "icu_critical_alerts_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_critical_alerts" ADD CONSTRAINT "icu_critical_alerts_icu_bed_id_icu_beds_icu_bed_id_fk" FOREIGN KEY ("icu_bed_id") REFERENCES "clinical"."icu_beds"("icu_bed_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_critical_alerts" ADD CONSTRAINT "icu_critical_alerts_acknowledged_by_users_user_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_critical_alerts" ADD CONSTRAINT "icu_critical_alerts_resolved_by_users_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_critical_alerts" ADD CONSTRAINT "icu_critical_alerts_escalated_to_users_user_id_fk" FOREIGN KEY ("escalated_to") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_nursing_care_plans" ADD CONSTRAINT "icu_nursing_care_plans_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_nursing_care_plans" ADD CONSTRAINT "icu_nursing_care_plans_icu_bed_id_icu_beds_icu_bed_id_fk" FOREIGN KEY ("icu_bed_id") REFERENCES "clinical"."icu_beds"("icu_bed_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_nursing_care_plans" ADD CONSTRAINT "icu_nursing_care_plans_assigned_nurse_id_users_user_id_fk" FOREIGN KEY ("assigned_nurse_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."icu_nursing_care_plans" ADD CONSTRAINT "icu_nursing_care_plans_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."icu_staff_shifts" ADD CONSTRAINT "icu_staff_shifts_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."icu_staff_shifts" ADD CONSTRAINT "icu_staff_shifts_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."icu_staff_shifts" ADD CONSTRAINT "icu_staff_shifts_staff_id_users_user_id_fk" FOREIGN KEY ("staff_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."icu_staff_shifts" ADD CONSTRAINT "icu_staff_shifts_handover_received_from_users_user_id_fk" FOREIGN KEY ("handover_received_from") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."icu_staff_shifts" ADD CONSTRAINT "icu_staff_shifts_handover_given_to_users_user_id_fk" FOREIGN KEY ("handover_given_to") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."icu_staff_shifts" ADD CONSTRAINT "icu_staff_shifts_backup_staff_id_users_user_id_fk" FOREIGN KEY ("backup_staff_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."icu_staff_shifts" ADD CONSTRAINT "icu_staff_shifts_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_order_items" ADD CONSTRAINT "medicine_order_items_order_id_medicine_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "core"."medicine_orders"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_order_items" ADD CONSTRAINT "medicine_order_items_medicine_id_medicine_master_medicine_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "core"."medicine_master"("medicine_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_order_items" ADD CONSTRAINT "medicine_order_items_substituted_medicine_id_medicine_master_medicine_id_fk" FOREIGN KEY ("substituted_medicine_id") REFERENCES "core"."medicine_master"("medicine_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_order_items" ADD CONSTRAINT "medicine_order_items_inventory_id_pharmacy_inventory_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "core"."pharmacy_inventory"("inventory_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_orders" ADD CONSTRAINT "medicine_orders_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_orders" ADD CONSTRAINT "medicine_orders_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_orders" ADD CONSTRAINT "medicine_orders_prescribed_by_users_user_id_fk" FOREIGN KEY ("prescribed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_orders" ADD CONSTRAINT "medicine_orders_consultation_id_consultations_consultation_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "clinical"."consultations"("consultation_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."medicine_orders" ADD CONSTRAINT "medicine_orders_dispensed_by_users_user_id_fk" FOREIGN KEY ("dispensed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."patients" ADD CONSTRAINT "patients_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."patients" ADD CONSTRAINT "patients_current_department_id_departments_department_id_fk" FOREIGN KEY ("current_department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."patients" ADD CONSTRAINT "patients_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."patients" ADD CONSTRAINT "patients_updated_by_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."pharmacy_inventory" ADD CONSTRAINT "pharmacy_inventory_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."pharmacy_inventory" ADD CONSTRAINT "pharmacy_inventory_medicine_id_medicine_master_medicine_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "core"."medicine_master"("medicine_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."pharmacy_stock_movement" ADD CONSTRAINT "pharmacy_stock_movement_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."pharmacy_stock_movement" ADD CONSTRAINT "pharmacy_stock_movement_medicine_id_medicine_master_medicine_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "core"."medicine_master"("medicine_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."pharmacy_stock_movement" ADD CONSTRAINT "pharmacy_stock_movement_inventory_id_pharmacy_inventory_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "core"."pharmacy_inventory"("inventory_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."pharmacy_stock_movement" ADD CONSTRAINT "pharmacy_stock_movement_performed_by_users_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_prescriptions_prescription_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "clinical"."prescriptions"("prescription_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."prescription_items" ADD CONSTRAINT "prescription_items_dispensed_by_users_user_id_fk" FOREIGN KEY ("dispensed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."prescriptions" ADD CONSTRAINT "prescriptions_consultation_id_consultations_consultation_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "clinical"."consultations"("consultation_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."prescriptions" ADD CONSTRAINT "prescriptions_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."prescriptions" ADD CONSTRAINT "prescriptions_cancelled_by_users_user_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical"."prescriptions" ADD CONSTRAINT "prescriptions_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."queue_entries" ADD CONSTRAINT "queue_entries_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."queue_entries" ADD CONSTRAINT "queue_entries_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."queue_entries" ADD CONSTRAINT "queue_entries_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."queue_entries" ADD CONSTRAINT "queue_entries_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_updated_by_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."users" ADD CONSTRAINT "users_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."users" ADD CONSTRAINT "users_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpoint_id_webhook_endpoints_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "core"."webhook_endpoints"("endpoint_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_event_id_webhook_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "core"."webhook_events"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_disabled_by_users_user_id_fk" FOREIGN KEY ("disabled_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_events" ADD CONSTRAINT "webhook_events_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."webhook_events" ADD CONSTRAINT "webhook_events_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication"."whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication"."whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication"."whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_template_id_whatsapp_templates_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "communication"."whatsapp_templates"("template_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication"."whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication"."whatsapp_templates" ADD CONSTRAINT "whatsapp_templates_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication"."whatsapp_templates" ADD CONSTRAINT "whatsapp_templates_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication"."whatsapp_templates" ADD CONSTRAINT "whatsapp_templates_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_key_organization_id_idx" ON "security"."api_keys" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "api_key_hashed_key_idx" ON "security"."api_keys" USING btree ("hashed_key");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_clinic_appointment_code" ON "appointments"."appointments" USING btree ("clinic_id","appointment_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_dept_service_code" ON "core"."department_services" USING btree ("department_id","service_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_clinic_dept_code" ON "core"."departments" USING btree ("clinic_id","department_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_family_patient" ON "core"."family_members" USING btree ("family_id","patient_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_clinic_scheme_code" ON "billing"."government_schemes" USING btree ("clinic_id","scheme_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_clinic_bed" ON "clinical"."icu_beds" USING btree ("clinic_id","bed_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_staff_shift" ON "core"."icu_staff_shifts" USING btree ("staff_id","shift_date","shift_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_organization_id_idx" ON "core"."invitations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_email_idx" ON "core"."invitations" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invitation_token_idx" ON "core"."invitations" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invitation_org_email_idx" ON "core"."invitations" USING btree ("organization_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "stripe_customer_id_idx" ON "core"."organization" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_clinic_patient_code" ON "core"."patients" USING btree ("clinic_id","patient_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_medicine_batch" ON "core"."pharmacy_inventory" USING btree ("clinic_id","medicine_id","batch_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_clinic_queue_token" ON "core"."queue_entries" USING btree ("clinic_id","queue_date","queue_type","token_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "security_events_organization_id_idx" ON "security"."security_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "security_events_event_type_idx" ON "security"."security_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "security_events_created_at_idx" ON "security"."security_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_organization_id_idx" ON "billing"."subscriptions" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_stripe_subscription_id_idx" ON "billing"."subscriptions" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_member_organization_id_idx" ON "core"."team_members" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_member_user_id_idx" ON "core"."team_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "team_member_org_user_idx" ON "core"."team_members" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_clinic_template_code" ON "communication"."whatsapp_templates" USING btree ("clinic_id","template_code");