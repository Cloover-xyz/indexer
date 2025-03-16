import {
  pgTable,
  text,
  uniqueIndex,
  index,
  bigint,
  integer,
  timestamp,
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
    biggestWin: bigint("biggest_win", { mode: "bigint" })
      .default(0 as unknown as bigint)
      .notNull(),
    biggestWinMultiplier: integer("biggest_win_multiplier")
      .default(0)
      .notNull(),
    totalRoundsWon: integer("total_rounds_won").default(0).notNull(),
    totalRoundsPlayed: integer("total_rounds_played").default(1).notNull(),
    totalDepositAmount: bigint("total_deposit_amount", {
      mode: "bigint",
    }).notNull(),
    totalAmountWon: bigint("total_amount_won", { mode: "bigint" })
      .default(0 as unknown as bigint)
      .notNull(),
    userId: text("user_id").references(() => userTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("wheel_metrics_idx").on(table.id),
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
