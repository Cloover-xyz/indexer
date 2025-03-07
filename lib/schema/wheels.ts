import {
  pgTable,
  text,
  bigint,
  integer,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
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
    pricePerTicket: bigint("price_per_ticket", { mode: "number" }).notNull(),
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
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
    pricePerTicket: bigint("price_per_ticket", { mode: "number" }).notNull(),
    protocolFeeBp: integer("protocol_fee_bp").notNull(),
    cutoffTime: bigint("cutoff_time", { mode: "number" }),
    drawnAt: bigint("drawn_at", { mode: "number" }),
    participantsCount: integer("participants_count").notNull(),
    ticketsCount: integer("tickets_count").notNull(),
    depositsCount: integer("deposits_count").notNull(),
    totalDepositAmount: bigint("total_deposit_amount", {
      mode: "number",
    }).notNull(),
    prizePoolAmount: bigint("prize_pool_amount", { mode: "number" }).notNull(),
    feesAmount: bigint("fees_amount", { mode: "number" }).notNull(),
    winningTicket: integer("winning_ticket"),
    randomValue: text("random_value"),
    winnerId: text("winner_id").references(() => userTable.id),
    wheelId: text("wheel_id").references(() => wheelTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("wheel_round_status_idx").on(table.status),
    index("wheel_round_wheel_id_idx").on(table.wheelId),
    index("wheel_round_winner_id_idx").on(table.winnerId),
  ]
);

export const wheelRoundParticipantTable = pgTable(
  "wheel_round_participants",
  {
    id: text("id").primaryKey().notNull(),
    deposited: bigint("deposited", { mode: "number" }).notNull(),
    isWinner: boolean("is_winner").notNull(),
    prizeClaimed: boolean("prize_claimed").notNull(),
    userId: text("user_id").references(() => userTable.id),
    roundId: text("round_id").references(() => wheelRoundTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("wheel_round_participant_user_id_idx").on(table.userId),
    index("wheel_round_participant_round_id_idx").on(table.roundId),
    index("wheel_round_participant_is_winner_idx").on(table.isWinner),
  ]
);

export const wheelTicketTable = pgTable(
  "wheel_tickets",
  {
    id: text("id").primaryKey().notNull(),
    number: integer("number").notNull(),
    participantId: text("participant_id").references(
      () => wheelRoundParticipantTable.id
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("wheel_ticket_participant_id_idx").on(table.participantId),
    index("wheel_ticket_number_idx").on(table.number),
  ]
);

export const wheelDepositTable = pgTable(
  "wheel_deposits",
  {
    id: text("id").primaryKey().notNull(),
    tokenId: text("token_id").references(() => tokenTable.id),
    amount: bigint("amount", { mode: "number" }).notNull(),
    ticketsCount: integer("tickets_count").notNull(),
    claimed: boolean("claimed").notNull(),
    depositIndex: integer("deposit_index").notNull(),
    participantId: text("participant_id").references(
      () => wheelRoundParticipantTable.id
    ),
    roundId: text("round_id").references(() => wheelRoundTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
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
    tickets: many(wheelTicketTable),
  })
);

export const wheelTicketRelations = relations(wheelTicketTable, ({ one }) => ({
  participant: one(wheelRoundParticipantTable, {
    fields: [wheelTicketTable.participantId],
    references: [wheelRoundParticipantTable.id],
  }),
}));

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
