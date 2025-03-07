import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const tokenTable = pgTable("tokens", {
  id: text("id").primaryKey().notNull(),
  address: text("address").notNull(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  decimals: integer("decimals").notNull(),
});
