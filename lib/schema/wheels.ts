import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./users";
import { tokenTable } from "./tokens";

export const roundStatusEnum = pgEnum("round_status", [
  "None",
  "Open",
  "Drawn",
  "Closed",
  "Cancelled",
]);

export const wheelTable = pgTable(
  "wheels",
  {
    id: text("id").primaryKey().notNull(),
    address: text("address").notNull(),
    tokenId: text("token_id").references(() => tokenTable.id),
    pricePerTicket: numeric("price_per_ticket", {
      precision: 256,
      scale: 0,
    }).notNull(),
    roundsCount: integer("rounds_count").notNull(),
    roundDuration: integer("round_duration").notNull(),
    outflowAllowed: boolean("outflow_allowed").notNull(),
    maxNumberOfParticipantsPerRound: integer(
      "max_number_of_participants_per_round"
    ).notNull(),
    maxNumberOfDepositsPerRound: integer(
      "max_number_of_deposits_per_round"
    ).notNull(),
    maxParticipantTicketsPerRound: integer(
      "max_participant_tickets_per_round"
    ).notNull(),
    protocolFeeBp: integer("protocol_fee_bp").notNull(),
    protocolFeeRecipient: text("protocol_fee_recipient").notNull(),
    vrf: text("vrf").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("wheel_id_idx").on(table.id),
    uniqueIndex("wheel_address_idx").on(table.address),
    uniqueIndex("wheel_token_id_idx").on(table.tokenId),
  ]
);

export const wheelRoundTable = pgTable(
  "wheel_rounds",
  {
    id: text("id").primaryKey().notNull(),
    number: integer("number").notNull(),
    status: roundStatusEnum("status").notNull(),
    pricePerTicket: numeric("price_per_ticket", {
      precision: 256,
      scale: 0,
    }).notNull(),
    protocolFeeBp: integer("protocol_fee_bp").notNull(),
    cutoffTime: timestamp("cutoff_time", { withTimezone: true }),
    drawnAt: timestamp("drawn_at", { withTimezone: true }),
    participantsCount: integer("participants_count").default(0).notNull(),
    ticketsCount: integer("tickets_count").default(0).notNull(),
    depositsCount: integer("deposits_count").default(0).notNull(),
    totalDepositAmount: numeric("total_deposit_amount", {
      precision: 256,
      scale: 0,
    })
      .default("0")
      .notNull(),
    prizePoolAmount: numeric("prize_pool_amount", {
      precision: 256,
      scale: 0,
    })
      .default("0")
      .notNull(),
    feesAmount: numeric("fees_amount", { precision: 256, scale: 0 })
      .default("0")
      .notNull(),
    winningTicket: integer("winning_ticket"),
    randomValue: numeric("random_value", { precision: 256, scale: 0 }),
    winnerId: text("winner_id").references(() => userTable.id),
    wheelId: text("wheel_id").references(() => wheelTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("wheel_round_id_idx").on(table.id),
    index("wheel_round_status_idx").on(table.status),
    index("wheel_round_wheel_id_idx").on(table.wheelId),
    index("wheel_round_winner_id_idx").on(table.winnerId),
  ]
);

export const wheelRoundParticipantTable = pgTable(
  "wheel_round_participants",
  {
    id: text("id").primaryKey().notNull(),
    tickets: integer("tickets").array(),
    deposited: numeric("deposited", { precision: 256, scale: 0 }).notNull(),
    isWinner: boolean("is_winner").default(false).notNull(),
    prizeClaimed: boolean("prize_claimed").default(false).notNull(),
    userId: text("user_id").references(() => userTable.id),
    roundId: text("round_id").references(() => wheelRoundTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("wheel_round_participant_id_idx").on(table.id),
    index("wheel_round_participant_user_id_idx").on(table.userId),
    index("wheel_round_participant_round_id_idx").on(table.roundId),
    index("wheel_round_participant_is_winner_idx").on(table.isWinner),
  ]
);

export const wheelDepositTable = pgTable(
  "wheel_deposits",
  {
    id: text("id").primaryKey().notNull(),
    tokenId: text("token_id").references(() => tokenTable.id),
    amount: numeric("amount", { precision: 256, scale: 0 }).notNull(),
    ticketsCount: integer("tickets_count").notNull(),
    claimed: boolean("claimed").default(false).notNull(),
    depositIndex: integer("deposit_index").notNull(),
    participantId: text("participant_id").references(
      () => wheelRoundParticipantTable.id
    ),
    roundId: text("round_id").references(() => wheelRoundTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("wheel_deposit_id_idx").on(table.id),
    index("wheel_deposit_participant_id_idx").on(table.participantId),
    index("wheel_deposit_round_id_idx").on(table.roundId),
    index("wheel_deposit_token_id_idx").on(table.tokenId),
    index("wheel_deposit_claimed_idx").on(table.claimed),
  ]
);

// Relations
export const wheelRelations = relations(wheelTable, ({ one, many }) => ({
  token: one(tokenTable, {
    fields: [wheelTable.tokenId],
    references: [tokenTable.id],
  }),
  rounds: many(wheelRoundTable),
}));

export const wheelRoundRelations = relations(
  wheelRoundTable,
  ({ one, many }) => ({
    wheel: one(wheelTable, {
      fields: [wheelRoundTable.wheelId],
      references: [wheelTable.id],
    }),
    winner: one(userTable, {
      fields: [wheelRoundTable.winnerId],
      references: [userTable.id],
    }),
    deposits: many(wheelDepositTable),
    participants: many(wheelRoundParticipantTable),
  })
);

export const wheelRoundParticipantRelations = relations(
  wheelRoundParticipantTable,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [wheelRoundParticipantTable.userId],
      references: [userTable.id],
    }),
    round: one(wheelRoundTable, {
      fields: [wheelRoundParticipantTable.roundId],
      references: [wheelRoundTable.id],
    }),
    deposits: many(wheelDepositTable),
  })
);

export const wheelDepositRelations = relations(
  wheelDepositTable,
  ({ one }) => ({
    token: one(tokenTable, {
      fields: [wheelDepositTable.tokenId],
      references: [tokenTable.id],
    }),
    participant: one(wheelRoundParticipantTable, {
      fields: [wheelDepositTable.participantId],
      references: [wheelRoundParticipantTable.id],
    }),
    round: one(wheelRoundTable, {
      fields: [wheelDepositTable.roundId],
      references: [wheelRoundTable.id],
    }),
  })
);
