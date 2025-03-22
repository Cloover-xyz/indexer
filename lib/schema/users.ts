import {
  pgTable,
  text,
  uniqueIndex,
  index,
  integer,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { wheelRoundParticipantTable, wheelRoundTable } from "./wheels";

// Note: RLS policies should be added in Supabase dashboard
// Example: CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
export const userTable = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    address: text("address").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("user_idx").on(table.id),
    index("user_address_idx").on(table.address),
  ]
);

export const wheelMetricsTable = pgTable(
  "wheel_metrics",
  {
    id: text("id").primaryKey().notNull(),
    biggestWin: numeric("biggest_win", { precision: 256, scale: 0 })
      .default("0")
      .notNull(),
    biggestWinMultiplier: integer("biggest_win_multiplier")
      .default(0)
      .notNull(),
    totalRoundsWon: integer("total_rounds_won").default(0).notNull(),
    totalRoundsPlayed: integer("total_rounds_played").default(1).notNull(),
    totalDepositAmount: numeric("total_deposit_amount", {
      precision: 256,
      scale: 0,
    }).default("0"),
    totalAmountWon: numeric("total_amount_won", {
      precision: 256,
      scale: 0,
    }).default("0"),
    userId: text("user_id").references(() => userTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("wheel_metrics_id_idx").on(table.id),
    index("wheel_metrics_user_id_idx").on(table.userId),
  ]
);

export const userRelations = relations(userTable, ({ one, many }) => ({
  metrics: one(wheelMetricsTable, {
    fields: [userTable.id],
    references: [wheelMetricsTable.userId],
  }),
  wheelParticipations: many(wheelRoundParticipantTable),
  wonRounds: many(wheelRoundTable),
}));

export const wheelMetricsRelations = relations(
  wheelMetricsTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [wheelMetricsTable.userId],
      references: [userTable.id],
    }),
  })
);
