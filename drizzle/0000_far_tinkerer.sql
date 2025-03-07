CREATE TYPE "public"."round_status" AS ENUM('None', 'Open', 'Drawn', 'Closed', 'Cancelled');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"decimals" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wheel_deposits" (
	"id" text PRIMARY KEY NOT NULL,
	"token_id" text,
	"amount" bigint NOT NULL,
	"tickets_count" integer NOT NULL,
	"claimed" boolean NOT NULL,
	"deposit_index" integer NOT NULL,
	"participant_id" text,
	"round_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wheel_round_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"deposited" bigint NOT NULL,
	"is_winner" boolean NOT NULL,
	"prize_claimed" boolean NOT NULL,
	"user_id" text,
	"round_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wheel_rounds" (
	"id" text PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"status" "round_status" NOT NULL,
	"price_per_ticket" bigint NOT NULL,
	"protocol_fee_bp" integer NOT NULL,
	"cutoff_time" bigint,
	"drawn_at" bigint,
	"participants_count" integer NOT NULL,
	"tickets_count" integer NOT NULL,
	"deposits_count" integer NOT NULL,
	"total_deposit_amount" bigint NOT NULL,
	"prize_pool_amount" bigint NOT NULL,
	"fees_amount" bigint NOT NULL,
	"winning_ticket" integer,
	"random_value" text,
	"winner_id" text,
	"wheel_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wheels" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"token_id" text,
	"price_per_ticket" bigint NOT NULL,
	"rounds_count" integer NOT NULL,
	"round_duration" integer NOT NULL,
	"outflow_allowed" boolean NOT NULL,
	"max_number_of_participants_per_round" integer NOT NULL,
	"max_number_of_deposits_per_round" integer NOT NULL,
	"max_participant_tickets_per_round" integer NOT NULL,
	"protocol_fee_bp" integer NOT NULL,
	"protocol_fee_recipient" text NOT NULL,
	"vrf" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wheel_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"participant_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	CONSTRAINT "users_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wheel_metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"biggest_win" bigint,
	"biggest_win_multiplier" numeric,
	"total_rounds_won" numeric,
	"total_rounds_played" numeric,
	"total_deposit_amount" bigint,
	"total_amount_won" bigint,
	"user_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_deposits" ADD CONSTRAINT "wheel_deposits_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_deposits" ADD CONSTRAINT "wheel_deposits_participant_id_wheel_round_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."wheel_round_participants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_deposits" ADD CONSTRAINT "wheel_deposits_round_id_wheel_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."wheel_rounds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_round_participants" ADD CONSTRAINT "wheel_round_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_round_participants" ADD CONSTRAINT "wheel_round_participants_round_id_wheel_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."wheel_rounds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_rounds" ADD CONSTRAINT "wheel_rounds_winner_id_users_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_rounds" ADD CONSTRAINT "wheel_rounds_wheel_id_wheels_id_fk" FOREIGN KEY ("wheel_id") REFERENCES "public"."wheels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheels" ADD CONSTRAINT "wheels_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_tickets" ADD CONSTRAINT "wheel_tickets_participant_id_wheel_round_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."wheel_round_participants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wheel_metrics" ADD CONSTRAINT "wheel_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_deposit_participant_id_idx" ON "wheel_deposits" USING btree ("participant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_deposit_round_id_idx" ON "wheel_deposits" USING btree ("round_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_deposit_token_id_idx" ON "wheel_deposits" USING btree ("token_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_deposit_claimed_idx" ON "wheel_deposits" USING btree ("claimed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_round_participant_user_id_idx" ON "wheel_round_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_round_participant_round_id_idx" ON "wheel_round_participants" USING btree ("round_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_round_participant_is_winner_idx" ON "wheel_round_participants" USING btree ("is_winner");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_round_status_idx" ON "wheel_rounds" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_round_wheel_id_idx" ON "wheel_rounds" USING btree ("wheel_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_round_winner_id_idx" ON "wheel_rounds" USING btree ("winner_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wheel_address_idx" ON "wheels" USING btree ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wheel_token_id_idx" ON "wheels" USING btree ("token_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_ticket_participant_id_idx" ON "wheel_tickets" USING btree ("participant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_ticket_number_idx" ON "wheel_tickets" USING btree ("number");