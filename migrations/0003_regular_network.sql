CREATE TYPE "public"."audit_action" AS ENUM('create', 'read', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "public"."audit_resource" AS ENUM('sso_connection', 'user', 'role', 'department', 'patient_data', 'medical_record', 'audit_log', 'system_setting');--> statement-breakpoint
CREATE TYPE "public"."hospital_department" AS ENUM('emergency', 'icu', 'surgery', 'cardiology', 'pediatrics', 'radiology', 'general');--> statement-breakpoint
CREATE TYPE "public"."hospital_role" AS ENUM('administrator', 'doctor', 'nurse', 'technician', 'viewer');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"actor_name" text NOT NULL,
	"actor_email" text,
	"actor_role" "hospital_role",
	"actor_department" "hospital_department",
	"action" text NOT NULL,
	"crud" "audit_action" NOT NULL,
	"resource" "audit_resource" NOT NULL,
	"resource_id" text,
	"resource_name" text,
	"target_id" text,
	"target_name" text,
	"target_type" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"ip_address" text,
	"user_agent" text,
	"session_id" text,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"duration" serial NOT NULL,
	"compliance_flags" jsonb DEFAULT '[]'::jsonb,
	"retraced_event_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hospital_staff" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"hospital_role" "hospital_role" NOT NULL,
	"department" "hospital_department" NOT NULL,
	"employee_id" text,
	"license_number" text,
	"specializations" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"failed_login_attempts" serial DEFAULT 0 NOT NULL,
	"account_locked_at" timestamp,
	"account_locked_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security_events" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"event_type" text NOT NULL,
	"severity" text NOT NULL,
	"user_id" text,
	"user_email" text,
	"ip_address" text,
	"user_agent" text,
	"location" text,
	"description" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"resolved" boolean DEFAULT false NOT NULL,
	"resolved_by" text,
	"resolved_at" timestamp,
	"alert_sent" boolean DEFAULT false NOT NULL,
	"alert_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_logs_organization_id_idx" ON "audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_logs_retraced_event_id_idx" ON "audit_logs" USING btree ("retraced_event_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "hospital_staff_user_id_idx" ON "hospital_staff" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "hospital_staff_organization_id_idx" ON "hospital_staff" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "hospital_staff_employee_id_idx" ON "hospital_staff" USING btree ("employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "security_events_organization_id_idx" ON "security_events" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "security_events_event_type_idx" ON "security_events" USING btree ("event_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "security_events_severity_idx" ON "security_events" USING btree ("severity");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "security_events_user_id_idx" ON "security_events" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "security_events_created_at_idx" ON "security_events" USING btree ("created_at");