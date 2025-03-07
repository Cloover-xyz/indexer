import {
  pgTable,
  text,
  uniqueIndex,
  numeric,
  bigint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { wheelRoundParticipantTable, wheelRoundTable } from "./wheels";

// Note: RLS policies should be added in Supabase dashboard
// Example: CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
export const userTable = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  address: text("address").notNull().unique(),
});

export const userRelations = relations(userTable, ({ one, many }) => ({
  metrics: one(wheelMetricsTable, {
    fields: [userTable.id],
    references: [wheelMetricsTable.userId],
  }),
  wheelParticipations: many(wheelRoundParticipantTable),
  wonRounds: many(wheelRoundTable),
}));

export const wheelMetricsTable = pgTable("wheel_metrics", {
  id: text("id").primaryKey().notNull(),
  biggestWin: bigint("biggest_win", { mode: "number" }),
  biggestWinMultiplier: numeric("biggest_win_multiplier"),
  totalRoundsWon: numeric("total_rounds_won"),
  totalRoundsPlayed: numeric("total_rounds_played"),
  totalDepositAmount: bigint("total_deposit_amount", { mode: "number" }),
  totalAmountWon: bigint("total_amount_won", { mode: "number" }),
  userId: text("user_id").references(() => userTable.id),
});

export const wheelMetricsRelations = relations(
  wheelMetricsTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [wheelMetricsTable.userId],
      references: [userTable.id],
    }),
  })
);
