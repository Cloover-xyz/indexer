import {
  pgTable,
  text,
  uniqueIndex,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const eventTable = pgTable(
  "events",
  {
    id: text("id").primaryKey().notNull(),
    eventName: text("event_name").notNull(),
    blockNumber: integer("block_number").notNull(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("event_id_idx").on(table.id),
    uniqueIndex("event_id_block_number_idx").on(table.id, table.blockNumber),
  ]
);
