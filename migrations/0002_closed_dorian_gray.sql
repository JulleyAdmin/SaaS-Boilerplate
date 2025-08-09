CREATE TABLE IF NOT EXISTS "collaboration"."collaboration_agreements" (
	"agreement_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_a_id" uuid NOT NULL,
	"clinic_b_id" uuid NOT NULL,
	"network_id" uuid,
	"agreement_type" varchar(100) NOT NULL,
	"agreement_name" varchar(200) NOT NULL,
	"agreement_code" varchar(50) NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"auto_renewal" boolean DEFAULT false,
	"renewal_period_months" integer,
	"covered_services" text[],
	"covered_departments" varchar(100)[],
	"covered_procedures" text[],
	"payment_terms" varchar(100),
	"revenue_share_percentage" numeric(5, 2),
	"minimum_guaranteed_amount" numeric(12, 2),
	"billing_cycle_days" integer DEFAULT 30,
	"sla_response_time_hours" integer,
	"sla_bed_allocation_priority" varchar(50),
	"sla_report_sharing" boolean DEFAULT true,
	"shared_resources" jsonb,
	"resource_booking_allowed" boolean DEFAULT false,
	"advance_booking_days" integer,
	"regulatory_approvals" jsonb,
	"insurance_coverage" jsonb,
	"liability_terms" text,
	"total_services_utilized" integer DEFAULT 0,
	"total_revenue_generated" numeric(12, 2) DEFAULT '0',
	"last_settlement_date" date,
	"agreement_status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp,
	CONSTRAINT "collaboration_agreements_agreement_code_unique" UNIQUE("agreement_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "network"."network_doctors" (
	"network_doctor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"primary_clinic_id" uuid NOT NULL,
	"network_id" uuid,
	"practicing_clinics" uuid[],
	"visiting_consultant_at" uuid[],
	"availability_schedule" jsonb,
	"consultation_modes" varchar(50)[],
	"network_role" varchar(100),
	"specialized_services" text[],
	"accepts_referrals" boolean DEFAULT true,
	"referral_specialties" text[],
	"preferred_referral_types" varchar(50)[],
	"max_referrals_per_week" integer,
	"network_registration_number" varchar(100),
	"network_privileges" text[],
	"total_network_consultations" integer DEFAULT 0,
	"total_referrals_received" integer DEFAULT 0,
	"total_referrals_completed" integer DEFAULT 0,
	"average_response_time_hours" numeric(5, 2),
	"patient_satisfaction_score" numeric(3, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collaboration"."network_resources" (
	"resource_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid,
	"resource_name" varchar(200) NOT NULL,
	"resource_type" varchar(100) NOT NULL,
	"resource_category" varchar(100),
	"resource_code" varchar(50) NOT NULL,
	"owner_clinic_id" uuid NOT NULL,
	"managing_department_id" uuid,
	"specifications" jsonb,
	"capacity_details" jsonb,
	"sharing_enabled" boolean DEFAULT true,
	"sharing_priority" varchar(50),
	"available_to_clinics" uuid[],
	"current_status" varchar(50) DEFAULT 'Available' NOT NULL,
	"current_user_clinic_id" uuid,
	"current_user_details" jsonb,
	"requires_booking" boolean DEFAULT true,
	"booking_lead_time_hours" integer DEFAULT 2,
	"max_booking_duration_hours" integer,
	"current_bookings" jsonb,
	"total_usage_hours" numeric(10, 2) DEFAULT '0',
	"total_bookings" integer DEFAULT 0,
	"utilization_rate_percent" numeric(5, 2),
	"last_maintenance_date" date,
	"next_maintenance_date" date,
	"maintenance_provider" varchar(200),
	"hourly_rate" numeric(10, 2),
	"maintenance_cost_sharing" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "network_resources_resource_code_unique" UNIQUE("resource_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "network"."patient_transfers" (
	"transfer_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"source_clinic_id" uuid NOT NULL,
	"destination_clinic_id" uuid NOT NULL,
	"transfer_type" varchar(50),
	"transfer_reason" text,
	"clinical_summary" text,
	"diagnosis_at_transfer" text[],
	"vital_signs_at_transfer" jsonb,
	"medications_on_transfer" jsonb,
	"transfer_status" varchar(50) DEFAULT 'Initiated' NOT NULL,
	"initiated_by" uuid,
	"initiated_at" timestamp DEFAULT now(),
	"accepted_by" uuid,
	"accepted_at" timestamp,
	"completed_at" timestamp,
	"transport_mode" varchar(50),
	"transport_provider" varchar(200),
	"estimated_arrival" timestamp,
	"actual_arrival" timestamp,
	"transfer_documents" jsonb,
	"handover_notes" text,
	"receiving_doctor_id" uuid,
	"requested_department" varchar(100),
	"allocated_bed_id" uuid,
	"transfer_charges" numeric(10, 2),
	"billing_status" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "network"."referral_management" (
	"referral_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"consultation_id" uuid,
	"referring_doctor_id" uuid NOT NULL,
	"referring_clinic_id" uuid NOT NULL,
	"referred_to_doctor_id" uuid,
	"referred_to_clinic_id" uuid,
	"referred_to_department" varchar(100),
	"referral_type" varchar(50) NOT NULL,
	"referral_priority" varchar(20) DEFAULT 'Normal' NOT NULL,
	"referral_reason" text NOT NULL,
	"clinical_notes" text,
	"provisional_diagnosis" text[],
	"icd10_codes" varchar(10)[],
	"investigations_done" jsonb,
	"investigations_pending" jsonb,
	"current_medications" jsonb,
	"referral_status" varchar(50) DEFAULT 'Initiated' NOT NULL,
	"status_reason" text,
	"initiated_at" timestamp DEFAULT now(),
	"sent_at" timestamp,
	"acknowledged_at" timestamp,
	"accepted_at" timestamp,
	"appointment_date" date,
	"completed_at" timestamp,
	"expiry_date" date,
	"response_notes" text,
	"treatment_provided" text,
	"follow_up_required" boolean DEFAULT false,
	"follow_up_with" varchar(50),
	"referral_letter_url" text,
	"supporting_documents" jsonb,
	"response_letter_url" text,
	"referral_fee" numeric(10, 2),
	"fee_split_percentage" numeric(5, 2),
	"billing_status" varchar(50),
	"patient_feedback_score" integer,
	"outcome_status" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collaboration"."shared_services" (
	"shared_service_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid,
	"service_name" varchar(200) NOT NULL,
	"service_type" varchar(100) NOT NULL,
	"service_category" varchar(100),
	"host_clinic_id" uuid NOT NULL,
	"department_id" uuid,
	"location_details" text,
	"available_to_clinics" uuid[],
	"availability_schedule" jsonb,
	"advance_booking_required" boolean DEFAULT true,
	"min_advance_booking_hours" integer DEFAULT 24,
	"daily_capacity" integer,
	"current_utilization_percent" numeric(5, 2),
	"specialist_ids" uuid[],
	"specialist_availability" jsonb,
	"equipment_details" jsonb,
	"maintenance_schedule" jsonb,
	"pricing_model" varchar(50),
	"base_price" numeric(10, 2),
	"network_discount_percent" numeric(5, 2),
	"external_price" numeric(10, 2),
	"booking_system" varchar(50),
	"max_bookings_per_clinic_per_day" integer,
	"average_wait_time_days" numeric(5, 2),
	"service_satisfaction_score" numeric(3, 2),
	"total_services_provided" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."collaboration_agreements" ADD CONSTRAINT "collaboration_agreements_clinic_a_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_a_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."collaboration_agreements" ADD CONSTRAINT "collaboration_agreements_clinic_b_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_b_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."collaboration_agreements" ADD CONSTRAINT "collaboration_agreements_network_id_hospital_networks_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "core"."hospital_networks"("network_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."collaboration_agreements" ADD CONSTRAINT "collaboration_agreements_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."network_doctors" ADD CONSTRAINT "network_doctors_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."network_doctors" ADD CONSTRAINT "network_doctors_primary_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("primary_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."network_doctors" ADD CONSTRAINT "network_doctors_network_id_hospital_networks_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "core"."hospital_networks"("network_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."network_resources" ADD CONSTRAINT "network_resources_network_id_hospital_networks_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "core"."hospital_networks"("network_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."network_resources" ADD CONSTRAINT "network_resources_owner_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("owner_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."network_resources" ADD CONSTRAINT "network_resources_managing_department_id_departments_department_id_fk" FOREIGN KEY ("managing_department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."network_resources" ADD CONSTRAINT "network_resources_current_user_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("current_user_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."patient_transfers" ADD CONSTRAINT "patient_transfers_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."patient_transfers" ADD CONSTRAINT "patient_transfers_source_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("source_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."patient_transfers" ADD CONSTRAINT "patient_transfers_destination_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("destination_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."patient_transfers" ADD CONSTRAINT "patient_transfers_initiated_by_users_user_id_fk" FOREIGN KEY ("initiated_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."patient_transfers" ADD CONSTRAINT "patient_transfers_accepted_by_users_user_id_fk" FOREIGN KEY ("accepted_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."patient_transfers" ADD CONSTRAINT "patient_transfers_receiving_doctor_id_users_user_id_fk" FOREIGN KEY ("receiving_doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_consultation_id_consultations_consultation_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "clinical"."consultations"("consultation_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_referring_doctor_id_users_user_id_fk" FOREIGN KEY ("referring_doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_referring_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("referring_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_referred_to_doctor_id_users_user_id_fk" FOREIGN KEY ("referred_to_doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_referred_to_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("referred_to_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "network"."referral_management" ADD CONSTRAINT "referral_management_updated_by_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."shared_services" ADD CONSTRAINT "shared_services_network_id_hospital_networks_network_id_fk" FOREIGN KEY ("network_id") REFERENCES "core"."hospital_networks"("network_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."shared_services" ADD CONSTRAINT "shared_services_host_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("host_clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaboration"."shared_services" ADD CONSTRAINT "shared_services_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
