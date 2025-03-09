import { z } from "zod";
import {
  zAddress,
  zBigInt,
  zBoolean,
  zEnum,
  zNumber,
  zNumberArray,
} from "../../../utils/converters";
import { RoundStatus } from "./enums";

export const WheelContractDeployedEventSchema = z.object({
  owner: zAddress,
  token: zAddress,
  pricePerTicket: zBigInt,
  roundDuration: zNumber,
  protocolFeeRecipient: zAddress,
  protocolFeeBp: zNumber,
  maximumNumberOfParticipantsPerRound: zNumber,
  maximumNumberOfDepositsPerRound: zNumber,
  maximumParticipantTicketsPerRound: zNumber,
  vrf: zAddress,
  outflowAllowed: zBoolean,
});

export const WithdrawalCallDataSchema = z.object({
  roundId: zNumber,
  depositIndices: zNumberArray,
});

export const DepositsWithdrawnEventSchema = z.object({
  depositor: zAddress,
  withdrawalCalldata: z.array(WithdrawalCallDataSchema),
});

export const RoundCutoffTimeSetEventSchema = z.object({
  roundId: zNumber,
  cutoffTime: zNumber,
});

export const RoundStatusUpdatedEventSchema = z.object({
  roundId: zNumber,
  status: zEnum(RoundStatus),
});

export const DepositedEventSchema = z.object({
  depositor: zAddress,
  token: zAddress,
  roundId: zNumber,
  amount: zBigInt,
  startTicketIndex: zNumber,
  ticketsCount: zNumber,
});

export const WinnerDrawnEventSchema = z.object({
  roundId: zNumber,
  randomValue: zBigInt,
  winningTicket: zNumber,
  winner: zAddress,
});

export const ProtocolFeeBpUpdatedEventSchema = z.object({
  protocolFeeBp: zNumber,
});

export const ProtocolFeeRecipientUpdatedEventSchema = z.object({
  protocolFeeRecipient: zAddress,
});

export const RoundDurationUpdatedEventSchema = z.object({
  roundDuration: zNumber,
});

export const MaximumNumberOfDepositsPerRoundUpdatedEventSchema = z.object({
  maximumNumberOfDepositsPerRound: zNumber,
});

export const MaximumParticipantTicketsPerRoundUpdatedEventSchema = z.object({
  maximumParticipantTicketsPerRound: zNumber,
});

export const MaximumNumberOfParticipantsPerRoundUpdatedEventSchema = z.object({
  maximumNumberOfParticipantsPerRound: zNumber,
});

export const PricePerTicketUpdatedEventSchema = z.object({
  pricePerTicket: zBigInt,
});

export const OutflowAllowedToggledEventSchema = z.object({
  outflowAllowed: zBoolean,
});

export const VRFUpdatedEventSchema = z.object({
  vrfContract: zAddress,
});

export const PrizeClaimedEventSchema = z.object({
  token: zAddress,
  winner: zAddress,
  roundIds: z.array(zNumber),
  prizes: z.array(zBigInt),
});

export const RoundsCancelledEventSchema = z.object({
  starting_round_id: zNumber,
  number_of_rounds: zNumber,
});

export const ProtocolFeeTransferredEventSchema = z.object({
  roundId: zNumber,
  token: zAddress,
  amount: zBigInt,
  recipient: zAddress,
});
