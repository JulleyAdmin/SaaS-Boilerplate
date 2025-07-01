CREATE TABLE IF NOT EXISTS "jackson_index" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"store_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jackson_store" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"iv" text,
	"tag" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp,
	"namespace" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jackson_ttl" (
	"key" text PRIMARY KEY NOT NULL,
	"expires_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "jackson_index_key_idx" ON "jackson_index" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "jackson_index_key_store_idx" ON "jackson_index" USING btree ("key","store_key");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "jackson_store_namespace_idx" ON "jackson_store" USING btree ("namespace");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "jackson_ttl_expires_at_idx" ON "jackson_ttl" USING btree ("expires_at");