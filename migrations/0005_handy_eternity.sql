CREATE TYPE "public"."webhook_event" AS ENUM('member.created', 'member.removed', 'member.updated', 'invitation.created', 'invitation.accepted', 'invitation.removed', 'apikey.created', 'apikey.deleted', 'team.created', 'team.updated', 'user.updated', 'organization.updated', 'sso.connection.created', 'sso.connection.updated', 'sso.connection.deleted', 'audit.log.created', 'security.event.created');--> statement-breakpoint
CREATE TYPE "public"."webhook_status" AS ENUM('active', 'inactive', 'failed', 'paused');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"webhook_endpoint_id" text NOT NULL,
	"event_type" "webhook_event" NOT NULL,
	"event_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"http_status" serial NOT NULL,
	"response_body" text,
	"response_headers" jsonb DEFAULT '{}'::jsonb,
	"duration" serial NOT NULL,
	"attempt" serial DEFAULT 1 NOT NULL,
	"status" text NOT NULL,
	"error_message" text,
	"next_retry_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_endpoints" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"status" "webhook_status" DEFAULT 'active' NOT NULL,
	"event_types" jsonb DEFAULT '[]'::jsonb,
	"headers" jsonb DEFAULT '{}'::jsonb,
	"timeout" serial DEFAULT 30 NOT NULL,
	"retry_count" serial DEFAULT 3 NOT NULL,
	"last_delivery_at" timestamp,
	"last_delivery_status" text,
	"failure_count" serial DEFAULT 0 NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_events" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"event_type" "webhook_event" NOT NULL,
	"resource_id" text,
	"resource_type" text,
	"payload" jsonb NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_deliveries_endpoint_id_idx" ON "webhook_deliveries" USING btree ("webhook_endpoint_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_deliveries_event_type_idx" ON "webhook_deliveries" USING btree ("event_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_deliveries_status_idx" ON "webhook_deliveries" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_deliveries_created_at_idx" ON "webhook_deliveries" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_deliveries_next_retry_at_idx" ON "webhook_deliveries" USING btree ("next_retry_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_endpoints_organization_id_idx" ON "webhook_endpoints" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_endpoints_url_idx" ON "webhook_endpoints" USING btree ("url");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_endpoints_status_idx" ON "webhook_endpoints" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_endpoints_created_by_idx" ON "webhook_endpoints" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_events_organization_id_idx" ON "webhook_events" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_events_event_type_idx" ON "webhook_events" USING btree ("event_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_events_processed_idx" ON "webhook_events" USING btree ("processed");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_events_created_at_idx" ON "webhook_events" USING btree ("created_at");