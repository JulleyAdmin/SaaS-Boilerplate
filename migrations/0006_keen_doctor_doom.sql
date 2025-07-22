CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"stripe_invoice_id" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"amount_paid" serial NOT NULL,
	"amount_due" serial NOT NULL,
	"currency" text DEFAULT 'usd',
	"status" text,
	"paid_at" timestamp,
	"due_date" timestamp,
	"hosted_invoice_url" text,
	"invoice_pdf" text,
	"receipt_number" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoice_stripe_invoice_id_unique" UNIQUE("stripe_invoice_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"status" "subscription_status" NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"department_limit" serial DEFAULT 5 NOT NULL,
	"user_limit" serial DEFAULT 100 NOT NULL,
	"storage_limit_gb" serial DEFAULT 50 NOT NULL,
	"api_call_limit" serial DEFAULT 10000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "subscription_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usage_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"subscription_id" serial NOT NULL,
	"metric_type" text NOT NULL,
	"quantity" serial NOT NULL,
	"unit_amount" serial NOT NULL,
	"total_amount" serial NOT NULL,
	"period" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"reported_to_stripe" boolean DEFAULT false,
	"stripe_usage_record_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoice_organization_id_idx" ON "invoice" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoice_stripe_invoice_id_idx" ON "invoice" USING btree ("stripe_invoice_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoice_status_idx" ON "invoice" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoice_paid_at_idx" ON "invoice" USING btree ("paid_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_organization_id_idx" ON "subscription" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_stripe_customer_id_idx" ON "subscription" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_stripe_subscription_id_idx" ON "subscription" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_status_idx" ON "subscription" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usage_records_organization_id_idx" ON "usage_records" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usage_records_period_idx" ON "usage_records" USING btree ("period");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usage_records_metric_type_idx" ON "usage_records" USING btree ("metric_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usage_records_reported_idx" ON "usage_records" USING btree ("reported_to_stripe");