CREATE TYPE "public"."scim_group_type" AS ENUM('department', 'role_group', 'security_group', 'custom');--> statement-breakpoint
CREATE TYPE "public"."scim_user_status" AS ENUM('active', 'inactive', 'suspended', 'deleted');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scim_configurations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"bearer_token" text NOT NULL,
	"base_url" text,
	"version" text DEFAULT '2.0' NOT NULL,
	"auto_provision_users" boolean DEFAULT true,
	"auto_provision_groups" boolean DEFAULT true,
	"auto_deprovision_users" boolean DEFAULT false,
	"sync_interval_minutes" serial DEFAULT 60 NOT NULL,
	"require_license_validation" boolean DEFAULT true,
	"allowed_departments" jsonb DEFAULT '[]'::jsonb,
	"restricted_roles" jsonb DEFAULT '[]'::jsonb,
	"attribute_mapping" jsonb DEFAULT '{}'::jsonb,
	"last_sync_at" timestamp,
	"last_sync_status" text,
	"last_sync_errors" jsonb DEFAULT '[]'::jsonb,
	"sync_stats" jsonb,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scim_enterprise_users" (
	"id" text PRIMARY KEY NOT NULL,
	"scim_user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"employee_number" text,
	"cost_center" text,
	"organization" text,
	"division" text,
	"department" text,
	"manager" text,
	"npi_number" text,
	"dea_number" text,
	"state_number" text,
	"board_certifications" jsonb DEFAULT '[]'::jsonb,
	"background_check_date" timestamp,
	"background_check_status" text,
	"hipaa_trained" boolean DEFAULT false,
	"hipaa_training_date" timestamp,
	"emergency_contact" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scim_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"external_id" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"group_type" "scim_group_type" DEFAULT 'department' NOT NULL,
	"department_code" text,
	"access_level" text,
	"data_access_scope" jsonb DEFAULT '{}'::jsonb,
	"meta" jsonb,
	"members" jsonb DEFAULT '[]'::jsonb,
	"custom_attributes" jsonb DEFAULT '{}'::jsonb,
	"last_synced_at" timestamp,
	"sync_errors" jsonb DEFAULT '[]'::jsonb,
	"provisioning_status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scim_users" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"external_id" text NOT NULL,
	"user_name" text NOT NULL,
	"email" text NOT NULL,
	"family_name" text,
	"given_name" text,
	"display_name" text,
	"active" boolean DEFAULT true NOT NULL,
	"status" "scim_user_status" DEFAULT 'active' NOT NULL,
	"department" text,
	"hospital_role" "hospital_role",
	"license_number" text,
	"license_type" text,
	"license_expiry" timestamp,
	"specialization" text,
	"employee_id" text,
	"supervisor_id" text,
	"meta" jsonb,
	"custom_attributes" jsonb DEFAULT '{}'::jsonb,
	"last_synced_at" timestamp,
	"sync_errors" jsonb DEFAULT '[]'::jsonb,
	"provisioning_status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scim_configurations" ADD CONSTRAINT "scim_configurations_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scim_enterprise_users" ADD CONSTRAINT "scim_enterprise_users_scim_user_id_scim_users_id_fk" FOREIGN KEY ("scim_user_id") REFERENCES "public"."scim_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scim_enterprise_users" ADD CONSTRAINT "scim_enterprise_users_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scim_groups" ADD CONSTRAINT "scim_groups_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scim_users" ADD CONSTRAINT "scim_users_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_configurations_organization_id_idx" ON "scim_configurations" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_configurations_enabled_idx" ON "scim_configurations" USING btree ("enabled");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_configurations_bearer_token_idx" ON "scim_configurations" USING btree ("bearer_token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_enterprise_users_scim_user_id_idx" ON "scim_enterprise_users" USING btree ("scim_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_enterprise_users_organization_id_idx" ON "scim_enterprise_users" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_enterprise_users_employee_number_idx" ON "scim_enterprise_users" USING btree ("organization_id","employee_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_enterprise_users_npi_number_idx" ON "scim_enterprise_users" USING btree ("npi_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_groups_organization_id_idx" ON "scim_groups" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_groups_external_id_idx" ON "scim_groups" USING btree ("organization_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_groups_display_name_idx" ON "scim_groups" USING btree ("organization_id","display_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_groups_department_code_idx" ON "scim_groups" USING btree ("organization_id","department_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_groups_group_type_idx" ON "scim_groups" USING btree ("group_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_users_organization_id_idx" ON "scim_users" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_users_external_id_idx" ON "scim_users" USING btree ("organization_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_users_user_name_idx" ON "scim_users" USING btree ("organization_id","user_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_users_email_idx" ON "scim_users" USING btree ("organization_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_users_employee_id_idx" ON "scim_users" USING btree ("organization_id","employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_users_status_idx" ON "scim_users" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scim_users_department_idx" ON "scim_users" USING btree ("department");