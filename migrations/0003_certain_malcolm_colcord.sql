CREATE SCHEMA "telemedicine";
--> statement-breakpoint
CREATE TYPE "public"."connection_quality_enum" AS ENUM('Excellent', 'Good', 'Fair', 'Poor', 'Failed');--> statement-breakpoint
CREATE TYPE "public"."consultation_mode_enum" AS ENUM('In-Person', 'Video', 'Audio', 'Chat', 'Phone');--> statement-breakpoint
CREATE TYPE "public"."device_type_enum" AS ENUM('Desktop', 'Laptop', 'Mobile', 'Tablet');--> statement-breakpoint
CREATE TYPE "public"."digital_prescription_type_enum" AS ENUM('E-Prescription', 'Digital-Signature', 'SMS-Prescription', 'WhatsApp-Prescription');--> statement-breakpoint
CREATE TYPE "public"."prescription_status_enum" AS ENUM('Draft', 'Active', 'Dispensed', 'Expired', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."recording_status_enum" AS ENUM('Not-Recorded', 'Recording', 'Recorded', 'Processing', 'Available', 'Failed');--> statement-breakpoint
CREATE TYPE "public"."telemedicine_compliance_enum" AS ENUM('MCI-Compliant', 'Teleconsultation-Guidelines', 'NABH-Digital', 'Ayushman-Bharat-Digital');--> statement-breakpoint
CREATE TYPE "public"."video_session_status_enum" AS ENUM('Scheduled', 'Starting', 'In-Progress', 'Completed', 'Failed', 'Cancelled', 'No-Show');--> statement-breakpoint
ALTER TYPE "public"."appointment_status_enum" ADD VALUE 'Telemedicine-Scheduled';--> statement-breakpoint
ALTER TYPE "public"."appointment_status_enum" ADD VALUE 'Video-In-Progress';--> statement-breakpoint
ALTER TYPE "public"."appointment_status_enum" ADD VALUE 'Video-Completed';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "telemedicine"."digital_prescriptions" (
	"digital_prescription_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consultation_id" uuid,
	"video_session_id" uuid,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"pharmacy_id" uuid,
	"prescription_type" "digital_prescription_type_enum" DEFAULT 'E-Prescription' NOT NULL,
	"prescription_number" varchar(50) NOT NULL,
	"prescription_status" "prescription_status_enum" DEFAULT 'Draft' NOT NULL,
	"doctor_digital_signature" text,
	"digital_certificate_id" varchar(100),
	"signature_timestamp" timestamp,
	"verification_code" varchar(20),
	"qr_code_data" text,
	"medications" jsonb,
	"investigations_recommended" text[],
	"dietary_instructions" text,
	"follow_up_instructions" text,
	"warnings_and_precautions" text[],
	"prescription_date" timestamp DEFAULT now(),
	"valid_until" date NOT NULL,
	"refills_allowed" integer DEFAULT 0,
	"refills_used" integer DEFAULT 0,
	"delivery_method" varchar(50),
	"sent_to_patient_at" timestamp,
	"sent_to_pharmacy_at" timestamp,
	"patient_viewed_at" timestamp,
	"regulatory_compliance" jsonb,
	"audit_trail" jsonb,
	"emergency_prescription" boolean DEFAULT false,
	"pharmacy_notified" boolean DEFAULT false,
	"insurance_notified" boolean DEFAULT false,
	"government_portal_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1,
	CONSTRAINT "digital_prescriptions_prescription_number_unique" UNIQUE("prescription_number"),
	CONSTRAINT "digital_prescriptions_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "telemedicine"."patient_remote_monitoring" (
	"monitoring_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"program_name" varchar(200) NOT NULL,
	"program_type" varchar(50),
	"start_date" date NOT NULL,
	"end_date" date,
	"monitoring_frequency" varchar(50),
	"connected_devices" jsonb,
	"device_data" jsonb,
	"last_sync_timestamp" timestamp,
	"vitals_trends" jsonb,
	"alert_thresholds" jsonb,
	"critical_alerts" jsonb,
	"symptom_reports" jsonb,
	"medication_adherence" jsonb,
	"daily_activity_data" jsonb,
	"assigned_nurses" uuid[],
	"escalation_protocol" jsonb,
	"last_reviewed_at" timestamp,
	"last_reviewed_by" uuid,
	"patient_engagement_score" integer,
	"auto_reminders_enabled" boolean DEFAULT true,
	"emergency_contact_protocol" jsonb,
	"health_improvement_score" numeric(5, 2),
	"program_completion_percentage" numeric(5, 2),
	"satisfaction_score" integer,
	"is_active" boolean DEFAULT true,
	"paused_at" timestamp,
	"pause_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "telemedicine"."telemedicine_billing" (
	"telemedicine_bill_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"video_session_id" uuid,
	"digital_prescription_id" uuid,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"bill_number" varchar(50) NOT NULL,
	"bill_date" timestamp DEFAULT now(),
	"service_type" varchar(50),
	"consultation_charges" numeric(10, 2) NOT NULL,
	"technology_fee" numeric(10, 2) DEFAULT '0',
	"platform_fee" numeric(10, 2) DEFAULT '0',
	"convenience_fee" numeric(10, 2) DEFAULT '0',
	"prescription_fee" numeric(10, 2) DEFAULT '0',
	"recording_fee" numeric(10, 2) DEFAULT '0',
	"data_storage_fee" numeric(10, 2) DEFAULT '0',
	"remote_monitoring_fee" numeric(10, 2) DEFAULT '0',
	"gross_amount" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0',
	"tax_amount" numeric(12, 2) DEFAULT '0',
	"net_amount" numeric(12, 2) NOT NULL,
	"payment_status" "bill_status_enum" DEFAULT 'Pending',
	"payment_method" "payment_method_enum",
	"payment_gateway" varchar(50),
	"transaction_id" varchar(100),
	"payment_timestamp" timestamp,
	"insurance_applicable" boolean DEFAULT false,
	"government_scheme_applicable" boolean DEFAULT false,
	"scheme_coverage_amount" numeric(10, 2) DEFAULT '0',
	"patient_payable_amount" numeric(10, 2),
	"telemedicine_tax_compliance" boolean DEFAULT true,
	"gst_applicable" boolean DEFAULT true,
	"gst_number" varchar(50),
	"digital_receipt_url" text,
	"sent_to_patient_email" boolean DEFAULT false,
	"sent_to_patient_sms" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "telemedicine_billing_bill_number_unique" UNIQUE("bill_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "telemedicine"."video_sessions" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"attending_staff" uuid[],
	"session_type" "consultation_mode_enum" DEFAULT 'Video' NOT NULL,
	"session_status" "video_session_status_enum" DEFAULT 'Scheduled' NOT NULL,
	"platform" varchar(50),
	"meeting_room_id" varchar(200),
	"meeting_password" varchar(100),
	"scheduled_start_time" timestamp NOT NULL,
	"scheduled_end_time" timestamp NOT NULL,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"total_duration_minutes" integer,
	"patient_device_type" "device_type_enum",
	"doctor_device_type" "device_type_enum",
	"connection_quality" "connection_quality_enum",
	"bandwidth_test_results" jsonb,
	"technical_issues" text[],
	"recording_enabled" boolean DEFAULT false,
	"recording_status" "recording_status_enum" DEFAULT 'Not-Recorded',
	"recording_url" text,
	"recording_duration_minutes" integer,
	"patient_consent_for_recording" boolean,
	"patient_consent_for_data_sharing" boolean,
	"consent_timestamp" timestamp,
	"consent_ip_address" varchar(45),
	"compliance_checklist" telemedicine_compliance_enum[],
	"patient_identity_verified" boolean DEFAULT false,
	"emergency_contact_available" boolean DEFAULT false,
	"technical_support_contact" varchar(50),
	"session_notes" text,
	"post_session_survey" jsonb,
	"follow_up_required" boolean DEFAULT false,
	"next_video_session_date" timestamp,
	"telemedicine_charges" numeric(10, 2),
	"platform_fees" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
ALTER TABLE "appointments"."appointments" ADD COLUMN "consultation_mode" "consultation_mode_enum" DEFAULT 'In-Person';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."digital_prescriptions" ADD CONSTRAINT "digital_prescriptions_consultation_id_consultations_consultation_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "clinical"."consultations"("consultation_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."digital_prescriptions" ADD CONSTRAINT "digital_prescriptions_video_session_id_video_sessions_session_id_fk" FOREIGN KEY ("video_session_id") REFERENCES "telemedicine"."video_sessions"("session_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."digital_prescriptions" ADD CONSTRAINT "digital_prescriptions_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."digital_prescriptions" ADD CONSTRAINT "digital_prescriptions_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."digital_prescriptions" ADD CONSTRAINT "digital_prescriptions_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."digital_prescriptions" ADD CONSTRAINT "digital_prescriptions_pharmacy_id_clinics_clinic_id_fk" FOREIGN KEY ("pharmacy_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."patient_remote_monitoring" ADD CONSTRAINT "patient_remote_monitoring_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."patient_remote_monitoring" ADD CONSTRAINT "patient_remote_monitoring_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."patient_remote_monitoring" ADD CONSTRAINT "patient_remote_monitoring_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."patient_remote_monitoring" ADD CONSTRAINT "patient_remote_monitoring_last_reviewed_by_users_user_id_fk" FOREIGN KEY ("last_reviewed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."telemedicine_billing" ADD CONSTRAINT "telemedicine_billing_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."telemedicine_billing" ADD CONSTRAINT "telemedicine_billing_video_session_id_video_sessions_session_id_fk" FOREIGN KEY ("video_session_id") REFERENCES "telemedicine"."video_sessions"("session_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."telemedicine_billing" ADD CONSTRAINT "telemedicine_billing_digital_prescription_id_digital_prescriptions_digital_prescription_id_fk" FOREIGN KEY ("digital_prescription_id") REFERENCES "telemedicine"."digital_prescriptions"("digital_prescription_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."telemedicine_billing" ADD CONSTRAINT "telemedicine_billing_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."telemedicine_billing" ADD CONSTRAINT "telemedicine_billing_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."telemedicine_billing" ADD CONSTRAINT "telemedicine_billing_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."video_sessions" ADD CONSTRAINT "video_sessions_appointment_id_appointments_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "appointments"."appointments"("appointment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."video_sessions" ADD CONSTRAINT "video_sessions_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."video_sessions" ADD CONSTRAINT "video_sessions_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."video_sessions" ADD CONSTRAINT "video_sessions_doctor_id_users_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telemedicine"."video_sessions" ADD CONSTRAINT "video_sessions_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "digital_prescriptions_number_idx" ON "telemedicine"."digital_prescriptions" USING btree ("prescription_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_prescriptions_patient_doctor_idx" ON "telemedicine"."digital_prescriptions" USING btree ("patient_id","doctor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_prescriptions_status_idx" ON "telemedicine"."digital_prescriptions" USING btree ("prescription_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_prescriptions_validity_idx" ON "telemedicine"."digital_prescriptions" USING btree ("valid_until");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_prescriptions_verification_idx" ON "telemedicine"."digital_prescriptions" USING btree ("verification_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_remote_monitoring_patient_idx" ON "telemedicine"."patient_remote_monitoring" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_remote_monitoring_doctor_idx" ON "telemedicine"."patient_remote_monitoring" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_remote_monitoring_active_idx" ON "telemedicine"."patient_remote_monitoring" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_remote_monitoring_program_type_idx" ON "telemedicine"."patient_remote_monitoring" USING btree ("program_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "telemedicine_billing_bill_number_idx" ON "telemedicine"."telemedicine_billing" USING btree ("bill_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "telemedicine_billing_patient_idx" ON "telemedicine"."telemedicine_billing" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "telemedicine_billing_payment_status_idx" ON "telemedicine"."telemedicine_billing" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "telemedicine_billing_date_idx" ON "telemedicine"."telemedicine_billing" USING btree ("bill_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "telemedicine_billing_video_session_idx" ON "telemedicine"."telemedicine_billing" USING btree ("video_session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "video_sessions_appointment_id_idx" ON "telemedicine"."video_sessions" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "video_sessions_status_idx" ON "telemedicine"."video_sessions" USING btree ("session_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "video_sessions_scheduled_time_idx" ON "telemedicine"."video_sessions" USING btree ("scheduled_start_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "video_sessions_patient_doctor_idx" ON "telemedicine"."video_sessions" USING btree ("patient_id","doctor_id");