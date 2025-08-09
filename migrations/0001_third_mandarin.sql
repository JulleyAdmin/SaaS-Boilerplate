CREATE SCHEMA "crm";
--> statement-breakpoint
CREATE SCHEMA "csr";
--> statement-breakpoint
CREATE SCHEMA "engagement";
--> statement-breakpoint
CREATE TYPE "public"."automation_trigger_enum" AS ENUM('patient_registered', 'appointment_booked', 'consultation_completed', 'prescription_issued', 'bill_generated', 'payment_received', 'feedback_submitted');--> statement-breakpoint
CREATE TYPE "public"."campaign_status_enum" AS ENUM('draft', 'scheduled', 'active', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "public"."campaign_type_enum" AS ENUM('awareness', 'acquisition', 'retention', 'reactivation');--> statement-breakpoint
CREATE TYPE "public"."engagement_level_enum" AS ENUM('cold', 'warm', 'hot', 'active', 'loyal');--> statement-breakpoint
CREATE TYPE "public"."event_status_enum" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."feedback_type_enum" AS ENUM('consultation', 'service', 'facility', 'staff', 'overall');--> statement-breakpoint
CREATE TYPE "public"."goal_status_enum" AS ENUM('active', 'paused', 'achieved', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."goal_type_enum" AS ENUM('weight_loss', 'weight_gain', 'bp_control', 'diabetes_management', 'cholesterol_control', 'fitness_improvement', 'quit_smoking', 'mental_health');--> statement-breakpoint
CREATE TYPE "public"."journey_stage_enum" AS ENUM('awareness', 'consideration', 'active', 'loyal', 'at_risk', 'churned');--> statement-breakpoint
CREATE TYPE "public"."lead_source_enum" AS ENUM('website', 'referral', 'event', 'campaign', 'walk_in', 'social_media', 'phone_inquiry');--> statement-breakpoint
CREATE TYPE "public"."lead_status_enum" AS ENUM('new', 'contacted', 'qualified', 'converted', 'lost');--> statement-breakpoint
CREATE TYPE "public"."program_status_enum" AS ENUM('planned', 'approved', 'active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."program_type_enum" AS ENUM('health_camp', 'vaccination_drive', 'screening_program', 'health_education', 'blood_donation', 'mental_health_awareness', 'nutrition_program', 'fitness_program');--> statement-breakpoint
CREATE TYPE "public"."segment_type_enum" AS ENUM('static', 'dynamic');--> statement-breakpoint
CREATE TYPE "public"."venue_type_enum" AS ENUM('hospital', 'community_center', 'school', 'mobile_van', 'outdoor');--> statement-breakpoint
CREATE TYPE "public"."volunteer_status_enum" AS ENUM('active', 'inactive', 'training', 'suspended');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crm"."automation_rules" (
	"rule_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"rule_name" varchar(200) NOT NULL,
	"rule_type" varchar(50),
	"description" text,
	"trigger_event" "automation_trigger_enum",
	"trigger_conditions" jsonb,
	"action_type" varchar(50),
	"action_config" jsonb,
	"delay_minutes" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"max_executions_per_patient" integer,
	"total_executions" integer DEFAULT 0,
	"success_count" integer DEFAULT 0,
	"last_executed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."bill_audit_trail" (
	"audit_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" uuid NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"field_changed" varchar(100),
	"old_value" text,
	"new_value" text,
	"reason" text,
	"performed_by" uuid NOT NULL,
	"performed_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"session_id" varchar(100),
	"application_module" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."bill_items" (
	"bill_item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" uuid NOT NULL,
	"service_id" uuid,
	"item_description" varchar(500) NOT NULL,
	"item_category" varchar(100),
	"item_code" varchar(50),
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"discount_percentage" numeric(5, 2) DEFAULT '0',
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"tax_percentage" numeric(5, 2) DEFAULT '0',
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"line_total" numeric(10, 2) NOT NULL,
	"prescribed_by" uuid,
	"service_date" timestamp,
	"department_id" uuid,
	"scheme_coverage" boolean DEFAULT false,
	"scheme_rate" numeric(10, 2),
	"patient_share" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crm"."campaigns" (
	"campaign_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"campaign_name" varchar(200) NOT NULL,
	"campaign_type" "campaign_type_enum" NOT NULL,
	"objective" text,
	"target_segments" text[],
	"target_criteria" jsonb,
	"estimated_reach" integer,
	"message_templates" jsonb[],
	"creative_assets" text[],
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"schedule_type" varchar(20),
	"recurrence_pattern" jsonb,
	"budget_allocated" numeric(12, 2),
	"budget_spent" numeric(12, 2) DEFAULT '0',
	"cost_per_acquisition" numeric(10, 2),
	"sent_count" integer DEFAULT 0,
	"delivered_count" integer DEFAULT 0,
	"opened_count" integer DEFAULT 0,
	"clicked_count" integer DEFAULT 0,
	"converted_count" integer DEFAULT 0,
	"status" "campaign_status_enum" DEFAULT 'draft',
	"approval_status" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "csr"."event_registrations" (
	"registration_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"participant_name" varchar(200) NOT NULL,
	"age" integer,
	"gender" "gender_enum",
	"phone" varchar(20),
	"email" varchar(100),
	"address" text,
	"blood_group" "blood_group_enum",
	"known_conditions" text[],
	"current_medications" text[],
	"registration_date" timestamp DEFAULT now() NOT NULL,
	"registration_number" varchar(50),
	"qr_code" varchar(200),
	"checked_in" boolean DEFAULT false,
	"check_in_time" timestamp,
	"services_availed" jsonb[],
	"requires_followup" boolean DEFAULT false,
	"followup_date" date,
	"followup_notes" text,
	"converted_to_patient" boolean DEFAULT false,
	"patient_id" uuid,
	"source" varchar(50),
	"referred_by" varchar(200),
	CONSTRAINT "event_registrations_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "csr"."events" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"event_name" varchar(200) NOT NULL,
	"event_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"max_participants" integer,
	"registered_count" integer DEFAULT 0,
	"attended_count" integer DEFAULT 0,
	"activities" jsonb[],
	"coordinator_id" uuid,
	"team_members" uuid[],
	"volunteers" uuid[],
	"status" "event_status_enum" DEFAULT 'scheduled',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "csr"."programs" (
	"program_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"program_name" varchar(200) NOT NULL,
	"program_type" "program_type_enum" NOT NULL,
	"description" text,
	"objectives" text[],
	"target_demographic" varchar(100),
	"target_count" integer,
	"eligibility_criteria" jsonb,
	"start_date" date NOT NULL,
	"end_date" date,
	"registration_deadline" date,
	"venue_type" "venue_type_enum",
	"venue_name" varchar(200),
	"venue_address" text,
	"budget" numeric(12, 2),
	"required_staff" integer,
	"required_volunteers" integer,
	"equipment_needed" text[],
	"partner_organizations" text[],
	"sponsors" text[],
	"government_scheme_id" uuid,
	"status" "program_status_enum" DEFAULT 'planned',
	"approval_status" varchar(20) DEFAULT 'pending',
	"approved_by" uuid,
	"actual_beneficiaries" integer DEFAULT 0,
	"services_provided" jsonb,
	"feedback_score" numeric(3, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "engagement"."health_goals" (
	"goal_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"goal_type" "goal_type_enum" NOT NULL,
	"goal_name" varchar(200) NOT NULL,
	"target_value" jsonb,
	"current_value" jsonb,
	"start_date" date NOT NULL,
	"target_date" date NOT NULL,
	"achieved_date" date,
	"progress_percentage" integer DEFAULT 0,
	"milestones" jsonb[],
	"assigned_coach_id" uuid,
	"support_group_id" uuid,
	"status" "goal_status_enum" DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."insurance_claims" (
	"claim_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_number" varchar(50) NOT NULL,
	"bill_id" uuid NOT NULL,
	"insurance_provider" varchar(200) NOT NULL,
	"policy_number" varchar(100) NOT NULL,
	"policy_holder_name" varchar(200) NOT NULL,
	"relationship_to_patient" varchar(50),
	"claim_amount" numeric(12, 2) NOT NULL,
	"claim_type" varchar(50) NOT NULL,
	"claim_status" varchar(50) DEFAULT 'submitted',
	"submitted_date" timestamp DEFAULT now() NOT NULL,
	"reviewed_date" timestamp,
	"approved_date" timestamp,
	"settlement_date" timestamp,
	"approved_amount" numeric(12, 2),
	"settled_amount" numeric(12, 2),
	"deductible" numeric(10, 2) DEFAULT '0',
	"copay" numeric(10, 2) DEFAULT '0',
	"rejection_reason" text,
	"issues_notes" text,
	"processed_by" uuid,
	"reviewed_by" varchar(200),
	"documents_submitted" jsonb,
	"additional_documents_required" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insurance_claims_claim_number_unique" UNIQUE("claim_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crm"."leads" (
	"lead_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20) NOT NULL,
	"email" varchar(100),
	"age_range" varchar(20),
	"gender" "gender_enum",
	"location" varchar(200),
	"source" "lead_source_enum" NOT NULL,
	"source_details" jsonb,
	"referring_patient_id" uuid,
	"campaign_id" uuid,
	"interested_services" text[],
	"health_concerns" text[],
	"preferred_contact_method" varchar(20),
	"lead_score" integer DEFAULT 0,
	"score_factors" jsonb,
	"qualification_status" varchar(20),
	"last_contact_date" timestamp,
	"contact_attempts" integer DEFAULT 0,
	"engagement_level" "engagement_level_enum",
	"converted" boolean DEFAULT false,
	"conversion_date" timestamp,
	"patient_id" uuid,
	"first_appointment_id" uuid,
	"assigned_to" uuid,
	"status" "lead_status_enum" DEFAULT 'new',
	"lost_reason" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."patient_bills" (
	"bill_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_number" varchar(50) NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"consultation_id" uuid,
	"bill_date" timestamp DEFAULT now() NOT NULL,
	"bill_type" varchar(50) NOT NULL,
	"gross_amount" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0',
	"tax_amount" numeric(12, 2) DEFAULT '0',
	"net_amount" numeric(12, 2) NOT NULL,
	"government_scheme_id" uuid,
	"scheme_coverage_amount" numeric(12, 2) DEFAULT '0',
	"patient_amount" numeric(12, 2) NOT NULL,
	"bill_status" "bill_status_enum" DEFAULT 'Draft',
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp,
	"bill_notes" text,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patient_bills_bill_number_unique" UNIQUE("bill_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "engagement"."patient_feedback" (
	"feedback_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"feedback_type" "feedback_type_enum" NOT NULL,
	"reference_id" uuid,
	"department_id" uuid,
	"overall_rating" integer,
	"wait_time_rating" integer,
	"staff_rating" integer,
	"facility_rating" integer,
	"treatment_rating" integer,
	"feedback_text" text,
	"improvement_suggestions" text,
	"nps_score" integer,
	"would_recommend" boolean,
	"requires_followup" boolean DEFAULT false,
	"followup_completed" boolean DEFAULT false,
	"followup_notes" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"platform" varchar(20),
	"anonymous" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crm"."patient_journey" (
	"journey_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"stage" "journey_stage_enum" NOT NULL,
	"sub_stage" varchar(100),
	"entry_date" timestamp DEFAULT now() NOT NULL,
	"expected_transition_date" date,
	"engagement_score" integer DEFAULT 0,
	"last_interaction_date" timestamp,
	"interaction_count" integer DEFAULT 0,
	"response_rate" numeric(5, 2),
	"churn_risk_score" numeric(5, 2),
	"lifetime_value" numeric(12, 2),
	"next_best_action" varchar(200),
	"segments" text[],
	"personas" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "engagement"."patient_preferences" (
	"preference_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"preferred_language" varchar(10) DEFAULT 'en',
	"preferred_channel" "communication_type_enum" DEFAULT 'whatsapp',
	"communication_frequency" varchar(20) DEFAULT 'weekly',
	"quiet_hours_start" time,
	"quiet_hours_end" time,
	"interested_programs" text[],
	"health_goals" text[],
	"preferred_doctor_id" uuid,
	"allow_family_access" boolean DEFAULT false,
	"marketing_consent" boolean DEFAULT false,
	"research_consent" boolean DEFAULT false,
	"data_sharing_consent" boolean DEFAULT false,
	"consent_updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crm"."segments" (
	"segment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"segment_name" varchar(200) NOT NULL,
	"description" text,
	"criteria_type" "segment_type_enum",
	"criteria_definition" jsonb,
	"member_count" integer DEFAULT 0,
	"last_calculated_at" timestamp,
	"used_in_campaigns" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing"."payments" (
	"payment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_number" varchar(50) NOT NULL,
	"bill_id" uuid NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"payment_method" "payment_method_enum" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"transaction_id" varchar(100),
	"reference_number" varchar(100),
	"gateway_response" jsonb,
	"collected_by" uuid NOT NULL,
	"collection_point" varchar(100),
	"payment_status" varchar(50) DEFAULT 'completed',
	"reconciled" boolean DEFAULT false,
	"reconciled_by" uuid,
	"reconciled_at" timestamp,
	"payment_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_payment_number_unique" UNIQUE("payment_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "csr"."volunteers" (
	"volunteer_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"occupation" varchar(100),
	"organization" varchar(200),
	"skills" text[],
	"languages" text[],
	"available_days" integer[],
	"available_hours" jsonb,
	"id_verified" boolean DEFAULT false,
	"background_check_completed" boolean DEFAULT false,
	"training_completed" boolean DEFAULT false,
	"total_hours" integer DEFAULT 0,
	"events_participated" integer DEFAULT 0,
	"rating" numeric(3, 2),
	"badges" text[],
	"status" "volunteer_status_enum" DEFAULT 'active',
	"joined_date" date DEFAULT now() NOT NULL,
	"last_active_date" date,
	CONSTRAINT "volunteers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."automation_rules" ADD CONSTRAINT "automation_rules_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."automation_rules" ADD CONSTRAINT "automation_rules_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."bill_audit_trail" ADD CONSTRAINT "bill_audit_trail_bill_id_patient_bills_bill_id_fk" FOREIGN KEY ("bill_id") REFERENCES "billing"."patient_bills"("bill_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."bill_audit_trail" ADD CONSTRAINT "bill_audit_trail_performed_by_users_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."bill_items" ADD CONSTRAINT "bill_items_bill_id_patient_bills_bill_id_fk" FOREIGN KEY ("bill_id") REFERENCES "billing"."patient_bills"("bill_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."bill_items" ADD CONSTRAINT "bill_items_service_id_department_services_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "core"."department_services"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."bill_items" ADD CONSTRAINT "bill_items_prescribed_by_users_user_id_fk" FOREIGN KEY ("prescribed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."bill_items" ADD CONSTRAINT "bill_items_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."campaigns" ADD CONSTRAINT "campaigns_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."campaigns" ADD CONSTRAINT "campaigns_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "csr"."events"("event_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."event_registrations" ADD CONSTRAINT "event_registrations_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."events" ADD CONSTRAINT "events_program_id_programs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "csr"."programs"("program_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."events" ADD CONSTRAINT "events_coordinator_id_users_user_id_fk" FOREIGN KEY ("coordinator_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."programs" ADD CONSTRAINT "programs_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."programs" ADD CONSTRAINT "programs_government_scheme_id_government_schemes_scheme_id_fk" FOREIGN KEY ("government_scheme_id") REFERENCES "billing"."government_schemes"("scheme_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."programs" ADD CONSTRAINT "programs_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "csr"."programs" ADD CONSTRAINT "programs_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."health_goals" ADD CONSTRAINT "health_goals_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."health_goals" ADD CONSTRAINT "health_goals_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."health_goals" ADD CONSTRAINT "health_goals_assigned_coach_id_users_user_id_fk" FOREIGN KEY ("assigned_coach_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."health_goals" ADD CONSTRAINT "health_goals_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."insurance_claims" ADD CONSTRAINT "insurance_claims_bill_id_patient_bills_bill_id_fk" FOREIGN KEY ("bill_id") REFERENCES "billing"."patient_bills"("bill_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."insurance_claims" ADD CONSTRAINT "insurance_claims_processed_by_users_user_id_fk" FOREIGN KEY ("processed_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."leads" ADD CONSTRAINT "leads_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."leads" ADD CONSTRAINT "leads_referring_patient_id_patients_patient_id_fk" FOREIGN KEY ("referring_patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."leads" ADD CONSTRAINT "leads_campaign_id_campaigns_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "crm"."campaigns"("campaign_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."leads" ADD CONSTRAINT "leads_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."leads" ADD CONSTRAINT "leads_first_appointment_id_appointments_appointment_id_fk" FOREIGN KEY ("first_appointment_id") REFERENCES "appointments"."appointments"("appointment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."leads" ADD CONSTRAINT "leads_assigned_to_users_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."patient_bills" ADD CONSTRAINT "patient_bills_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."patient_bills" ADD CONSTRAINT "patient_bills_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."patient_bills" ADD CONSTRAINT "patient_bills_consultation_id_consultations_consultation_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "clinical"."consultations"("consultation_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."patient_bills" ADD CONSTRAINT "patient_bills_government_scheme_id_government_schemes_scheme_id_fk" FOREIGN KEY ("government_scheme_id") REFERENCES "billing"."government_schemes"("scheme_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."patient_bills" ADD CONSTRAINT "patient_bills_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."patient_bills" ADD CONSTRAINT "patient_bills_approved_by_users_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."patient_feedback" ADD CONSTRAINT "patient_feedback_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."patient_feedback" ADD CONSTRAINT "patient_feedback_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."patient_feedback" ADD CONSTRAINT "patient_feedback_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "core"."departments"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."patient_journey" ADD CONSTRAINT "patient_journey_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."patient_journey" ADD CONSTRAINT "patient_journey_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."patient_preferences" ADD CONSTRAINT "patient_preferences_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "core"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."patient_preferences" ADD CONSTRAINT "patient_preferences_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "engagement"."patient_preferences" ADD CONSTRAINT "patient_preferences_preferred_doctor_id_users_user_id_fk" FOREIGN KEY ("preferred_doctor_id") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."segments" ADD CONSTRAINT "segments_clinic_id_clinics_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "core"."clinics"("clinic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crm"."segments" ADD CONSTRAINT "segments_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."payments" ADD CONSTRAINT "payments_bill_id_patient_bills_bill_id_fk" FOREIGN KEY ("bill_id") REFERENCES "billing"."patient_bills"("bill_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."payments" ADD CONSTRAINT "payments_collected_by_users_user_id_fk" FOREIGN KEY ("collected_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing"."payments" ADD CONSTRAINT "payments_reconciled_by_users_user_id_fk" FOREIGN KEY ("reconciled_by") REFERENCES "core"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "automation_rules_clinic_id_idx" ON "crm"."automation_rules" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "automation_rules_trigger_event_idx" ON "crm"."automation_rules" USING btree ("trigger_event");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "automation_rules_is_active_idx" ON "crm"."automation_rules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bill_audit_trail_bill_id_idx" ON "billing"."bill_audit_trail" USING btree ("bill_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bill_audit_trail_action_type_idx" ON "billing"."bill_audit_trail" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bill_audit_trail_performed_by_idx" ON "billing"."bill_audit_trail" USING btree ("performed_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bill_audit_trail_performed_at_idx" ON "billing"."bill_audit_trail" USING btree ("performed_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bill_items_bill_id_idx" ON "billing"."bill_items" USING btree ("bill_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bill_items_service_id_idx" ON "billing"."bill_items" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bill_items_category_idx" ON "billing"."bill_items" USING btree ("item_category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crm_campaigns_clinic_id_idx" ON "crm"."campaigns" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crm_campaigns_campaign_type_idx" ON "crm"."campaigns" USING btree ("campaign_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crm_campaigns_status_idx" ON "crm"."campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crm_campaigns_start_date_idx" ON "crm"."campaigns" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_event_registrations_event_id_idx" ON "csr"."event_registrations" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "csr_event_registrations_registration_number_idx" ON "csr"."event_registrations" USING btree ("registration_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_event_registrations_phone_idx" ON "csr"."event_registrations" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_events_program_id_idx" ON "csr"."events" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_events_event_date_idx" ON "csr"."events" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_events_status_idx" ON "csr"."events" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_programs_clinic_id_idx" ON "csr"."programs" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_programs_program_type_idx" ON "csr"."programs" USING btree ("program_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_programs_status_idx" ON "csr"."programs" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csr_programs_start_date_idx" ON "csr"."programs" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_goals_patient_id_idx" ON "engagement"."health_goals" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_goals_goal_type_idx" ON "engagement"."health_goals" USING btree ("goal_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_goals_status_idx" ON "engagement"."health_goals" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_claims_bill_id_idx" ON "billing"."insurance_claims" USING btree ("bill_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_claims_status_idx" ON "billing"."insurance_claims" USING btree ("claim_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_claims_provider_idx" ON "billing"."insurance_claims" USING btree ("insurance_provider");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_claims_submitted_date_idx" ON "billing"."insurance_claims" USING btree ("submitted_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_clinic_id_idx" ON "crm"."leads" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_phone_idx" ON "crm"."leads" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_source_idx" ON "crm"."leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "crm"."leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_lead_score_idx" ON "crm"."leads" USING btree ("lead_score");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_assigned_to_idx" ON "crm"."leads" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_bills_clinic_patient_idx" ON "billing"."patient_bills" USING btree ("clinic_id","patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_bills_bill_date_idx" ON "billing"."patient_bills" USING btree ("bill_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_bills_bill_status_idx" ON "billing"."patient_bills" USING btree ("bill_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_feedback_patient_id_idx" ON "engagement"."patient_feedback" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_feedback_feedback_type_idx" ON "engagement"."patient_feedback" USING btree ("feedback_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_feedback_overall_rating_idx" ON "engagement"."patient_feedback" USING btree ("overall_rating");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_feedback_submitted_at_idx" ON "engagement"."patient_feedback" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_journey_patient_id_idx" ON "crm"."patient_journey" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_journey_stage_idx" ON "crm"."patient_journey" USING btree ("stage");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_journey_engagement_score_idx" ON "crm"."patient_journey" USING btree ("engagement_score");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_preferences_patient_id_idx" ON "engagement"."patient_preferences" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_preferences_clinic_id_idx" ON "engagement"."patient_preferences" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_segments_clinic_id_idx" ON "crm"."segments" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_segments_criteria_type_idx" ON "crm"."segments" USING btree ("criteria_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_segments_is_active_idx" ON "crm"."segments" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_bill_id_idx" ON "billing"."payments" USING btree ("bill_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_payment_date_idx" ON "billing"."payments" USING btree ("payment_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_payment_method_idx" ON "billing"."payments" USING btree ("payment_method");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_payment_status_idx" ON "billing"."payments" USING btree ("payment_status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "volunteers_email_idx" ON "csr"."volunteers" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "volunteers_phone_idx" ON "csr"."volunteers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "volunteers_status_idx" ON "csr"."volunteers" USING btree ("status");