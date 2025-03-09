import {
  pgTable,
  integer,
  text,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";

export const tokenTable = pgTable(
  "tokens",
  {
    id: text("id").primaryKey().notNull(),
    address: text("address").notNull(),
    name: text("name").notNull(),
    symbol: text("symbol").notNull(),
    decimals: integer("decimals").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("token_id_idx").on(table.id),
    uniqueIndex("token_address_idx").on(table.address),
  ]
);
