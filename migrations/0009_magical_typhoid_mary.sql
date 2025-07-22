CREATE TYPE "public"."oauth_client_type" AS ENUM('confidential', 'public');--> statement-breakpoint
CREATE TYPE "public"."oauth_grant_type" AS ENUM('authorization_code', 'client_credentials', 'refresh_token');--> statement-breakpoint
CREATE TYPE "public"."oauth_token_type" AS ENUM('access_token', 'refresh_token', 'authorization_code');--> statement-breakpoint
ALTER TYPE "public"."audit_resource" ADD VALUE 'group';--> statement-breakpoint
ALTER TYPE "public"."audit_resource" ADD VALUE 'scim_endpoint';--> statement-breakpoint
ALTER TYPE "public"."audit_resource" ADD VALUE 'license';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_access_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"token_type" "oauth_token_type" DEFAULT 'access_token' NOT NULL,
	"client_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text,
	"scopes" jsonb DEFAULT '[]'::jsonb,
	"audience" text,
	"issuer" text DEFAULT 'hospitalos',
	"department_id" text,
	"hospital_role" "hospital_role",
	"data_access_scope" jsonb,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"last_used_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_access_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_authorization_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"client_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"scopes" jsonb DEFAULT '[]'::jsonb,
	"redirect_uri" text NOT NULL,
	"code_challenge" text,
	"code_challenge_method" text,
	"department_id" text,
	"hospital_role" "hospital_role",
	"data_access_scope" jsonb,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_authorization_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_clients" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"client_secret" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"client_type" "oauth_client_type" DEFAULT 'confidential' NOT NULL,
	"redirect_uris" jsonb DEFAULT '[]'::jsonb,
	"allowed_origins" jsonb DEFAULT '[]'::jsonb,
	"scopes" jsonb DEFAULT '["read"]'::jsonb,
	"allowed_grant_types" jsonb DEFAULT '["authorization_code"]'::jsonb,
	"allowed_departments" jsonb DEFAULT '[]'::jsonb,
	"data_access_level" text DEFAULT 'basic',
	"phi_access" boolean DEFAULT false,
	"audit_required" boolean DEFAULT true,
	"rate_limit" serial DEFAULT 1000 NOT NULL,
	"token_lifetime" serial DEFAULT 3600 NOT NULL,
	"refresh_token_lifetime" serial DEFAULT 86400 NOT NULL,
	"logo_url" text,
	"homepage_url" text,
	"privacy_policy_url" text,
	"terms_of_service_url" text,
	"is_active" boolean DEFAULT true,
	"last_used_at" timestamp,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_clients_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_client_permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"scope" text NOT NULL,
	"resource" text NOT NULL,
	"action" text NOT NULL,
	"department_restrictions" jsonb DEFAULT '[]'::jsonb,
	"data_classification" text,
	"phi_access_level" text,
	"description" text,
	"risk_level" text DEFAULT 'medium',
	"compliance_required" boolean DEFAULT true,
	"granted_by" text NOT NULL,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"access_token_id" text,
	"client_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"scopes" jsonb DEFAULT '[]'::jsonb,
	"department_id" text,
	"hospital_role" "hospital_role",
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_client_id_oauth_clients_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("client_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_authorization_codes" ADD CONSTRAINT "oauth_authorization_codes_client_id_oauth_clients_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("client_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_authorization_codes" ADD CONSTRAINT "oauth_authorization_codes_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_clients" ADD CONSTRAINT "oauth_clients_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_client_permissions" ADD CONSTRAINT "oauth_client_permissions_client_id_oauth_clients_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("client_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_client_permissions" ADD CONSTRAINT "oauth_client_permissions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_access_token_id_oauth_access_tokens_id_fk" FOREIGN KEY ("access_token_id") REFERENCES "public"."oauth_access_tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_client_id_oauth_clients_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("client_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_access_tokens_token_idx" ON "oauth_access_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_access_tokens_client_id_idx" ON "oauth_access_tokens" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_access_tokens_organization_id_idx" ON "oauth_access_tokens" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_access_tokens_user_id_idx" ON "oauth_access_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_access_tokens_expires_at_idx" ON "oauth_access_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_authorization_codes_code_idx" ON "oauth_authorization_codes" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_authorization_codes_client_id_idx" ON "oauth_authorization_codes" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_authorization_codes_organization_id_idx" ON "oauth_authorization_codes" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_authorization_codes_expires_at_idx" ON "oauth_authorization_codes" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_clients_organization_id_idx" ON "oauth_clients" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_clients_client_id_idx" ON "oauth_clients" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_clients_name_idx" ON "oauth_clients" USING btree ("organization_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_clients_is_active_idx" ON "oauth_clients" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_client_permissions_client_id_idx" ON "oauth_client_permissions" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_client_permissions_organization_id_idx" ON "oauth_client_permissions" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_client_permissions_scope_idx" ON "oauth_client_permissions" USING btree ("client_id","scope");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_client_permissions_resource_action_idx" ON "oauth_client_permissions" USING btree ("resource","action");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_refresh_tokens_token_idx" ON "oauth_refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_refresh_tokens_access_token_id_idx" ON "oauth_refresh_tokens" USING btree ("access_token_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_refresh_tokens_client_id_idx" ON "oauth_refresh_tokens" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_refresh_tokens_organization_id_idx" ON "oauth_refresh_tokens" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_refresh_tokens_user_id_idx" ON "oauth_refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_refresh_tokens_expires_at_idx" ON "oauth_refresh_tokens" USING btree ("expires_at");