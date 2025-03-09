import { decodeEvent, Event } from "@apibara/starknet";

import { adaptAddress, zAddress } from "utils/converters";

import { Wheel_ABI } from "../abis/Wheel_ABI";
import {
  DepositedEvent,
  DepositsWithdrawnEvent,
  MaximumNumberOfDepositsPerRoundUpdatedEvent,
  MaximumNumberOfParticipantsPerRoundUpdatedEvent,
  MaximumParticipantTicketsPerRoundUpdatedEvent,
  OutflowAllowedToggledEvent,
  PricePerTicketUpdatedEvent,
  PrizeClaimedEvent,
  ProtocolFeeBpUpdatedEvent,
  ProtocolFeeRecipientUpdatedEvent,
  RoundCutoffTimeSetEvent,
  RoundDurationUpdatedEvent,
  RoundStatusUpdatedEvent,
  VRFUpdatedEvent,
  WheelContractDeployedEvent,
  WinnerDrawnEvent,
} from "../types/types";
import {
  DepositedEventSchema,
  DepositsWithdrawnEventSchema,
  MaximumNumberOfDepositsPerRoundUpdatedEventSchema,
  MaximumNumberOfParticipantsPerRoundUpdatedEventSchema,
  MaximumParticipantTicketsPerRoundUpdatedEventSchema,
  OutflowAllowedToggledEventSchema,
  PricePerTicketUpdatedEventSchema,
  PrizeClaimedEventSchema,
  ProtocolFeeBpUpdatedEventSchema,
  ProtocolFeeRecipientUpdatedEventSchema,
  RoundCutoffTimeSetEventSchema,
  RoundDurationUpdatedEventSchema,
  RoundStatusUpdatedEventSchema,
  VRFUpdatedEventSchema,
  WheelContractDeployedEventSchema,
  WinnerDrawnEventSchema,
} from "../types/eventsSchema";

import { parseAsBigInt } from "@apibara/starknet/parser";

const BASE_EVENT_NAME = "cloover::wheel::events::Events::";

type EventName =
  | "ContractDeployed"
  | "VRFUpdated"
  | "ProtocolFeeBpUpdated"
  | "ProtocolFeeRecipientUpdated"
  | "RoundCutoffTimeSet"
  | "RoundDurationUpdated"
  | "RoundStatusUpdated"
  | "Deposited"
  | "MaximumNumberOfDepositsPerRoundUpdated"
  | "MaximumNumberOfParticipantsPerRoundUpdated"
  | "MaximumParticipantTicketsPerRoundUpdated"
  | "OutflowAllowedToggled"
  | "PricePerTicketUpdated"
  | "PrizeClaimed"
  | "WinnerDrawn"
  | "DepositsWithdrawn";

const decodeWheelEvent = (event: Event, name: EventName) => {
  return decodeEvent({
    abi: Wheel_ABI,
    event,
    eventName: `${BASE_EVENT_NAME}${name}`,
  });
};

export const getWheelContractDeployedEventData = (
  event: Event
): { wheelAddress: string; data: WheelContractDeployedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "ContractDeployed"
  );
  return {
    wheelAddress: zAddress.parse(address),
    data: WheelContractDeployedEventSchema.parse({
      owner: decodedEvent.owner,
      token: decodedEvent.token,
      pricePerTicket: decodedEvent.price_per_ticket,
      roundDuration: decodedEvent.round_duration,
      protocolFeeBp: decodedEvent.protocol_fee_bp,
      protocolFeeRecipient: decodedEvent.protocol_fee_recipient,
      vrf: decodedEvent.vrf_contract,
      outflowAllowed: decodedEvent.is_outflow_allowed,
      maximumNumberOfParticipantsPerRound:
        decodedEvent.maximum_number_of_participants_per_round,
      maximumNumberOfDepositsPerRound:
        decodedEvent.maximum_number_of_deposits_per_round,
      maximumParticipantTicketsPerRound:
        decodedEvent.maximum_participant_tickets_per_round,
    }),
  };
};

export const getPricePerTicketUpdatedEventData = (
  event: Event
): { wheelAddress: string; data: PricePerTicketUpdatedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "PricePerTicketUpdated"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: PricePerTicketUpdatedEventSchema.parse({
      pricePerTicket: decodedEvent.price_per_ticket,
    }),
  };
};

export const getProtocolFeeBpUpdatedEventData = (
  event: Event
): { wheelAddress: string; data: ProtocolFeeBpUpdatedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "ProtocolFeeBpUpdated"
  );
  return {
    wheelAddress: zAddress.parse(address),
    data: ProtocolFeeBpUpdatedEventSchema.parse({
      protocolFeeBp: decodedEvent.protocol_fee_bp,
    }),
  };
};

export const getProtocolFeeRecipientUpdatedEventData = (
  event: Event
): { wheelAddress: string; data: ProtocolFeeRecipientUpdatedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "ProtocolFeeRecipientUpdated"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: ProtocolFeeRecipientUpdatedEventSchema.parse({
      protocolFeeRecipient: decodedEvent.protocol_fee_recipient,
    }),
  };
};

export const getRoundDurationUpdatedEventData = (
  event: Event
): { wheelAddress: string; data: RoundDurationUpdatedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "RoundDurationUpdated"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: RoundDurationUpdatedEventSchema.parse({
      roundDuration: decodedEvent.round_duration,
    }),
  };
};

export const getVrfUpdatedEventData = (
  event: Event
): { wheelAddress: string; data: VRFUpdatedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(event, "VRFUpdated");

  return {
    wheelAddress: zAddress.parse(address),
    data: VRFUpdatedEventSchema.parse({
      vrf: decodedEvent.vrf_contract,
    }),
  };
};

export const getMaximumNumberOfDepositsPerRoundUpdatedEventData = (
  event: Event
): {
  wheelAddress: string;
  data: MaximumNumberOfDepositsPerRoundUpdatedEvent;
} => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "MaximumNumberOfDepositsPerRoundUpdated"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: MaximumNumberOfDepositsPerRoundUpdatedEventSchema.parse({
      maximumNumberOfDepositsPerRound:
        decodedEvent.maximum_number_of_deposits_per_round,
    }),
  };
};

export const getMaximumNumberOfParticipantsPerRoundUpdatedEventData = (
  event: Event
): {
  wheelAddress: string;
  data: MaximumNumberOfParticipantsPerRoundUpdatedEvent;
} => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "MaximumNumberOfParticipantsPerRoundUpdated"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: MaximumNumberOfParticipantsPerRoundUpdatedEventSchema.parse({
      maximumNumberOfParticipantsPerRound:
        decodedEvent.maximum_number_of_participants_per_round,
    }),
  };
};

export const getMaximumParticipantTicketsPerRoundUpdatedEventData = (
  event: Event
): {
  wheelAddress: string;
  data: MaximumParticipantTicketsPerRoundUpdatedEvent;
} => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "MaximumParticipantTicketsPerRoundUpdated"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: MaximumParticipantTicketsPerRoundUpdatedEventSchema.parse({
      maximumParticipantTicketsPerRound:
        decodedEvent.maximum_participant_tickets_per_round,
    }),
  };
};

export const getOutflowAllowedToggledEventData = (
  event: Event
): { wheelAddress: string; data: OutflowAllowedToggledEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "OutflowAllowedToggled"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: OutflowAllowedToggledEventSchema.parse({
      outflowAllowed: decodedEvent.is_outflow_allowed,
    }),
  };
};

export const getRoundCutoffTimeSetEventData = (
  event: Event
): { wheelAddress: string; data: RoundCutoffTimeSetEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "RoundCutoffTimeSet"
  );
  return {
    wheelAddress: zAddress.parse(address),
    data: RoundCutoffTimeSetEventSchema.parse({
      roundId: decodedEvent.round_id,
      cutoffTime: decodedEvent.cutoff_time,
    }),
  };
};

// TODO: enum is not supported by the apirara decoder
// used custom logic to decode it
export const getRoundStatusUpdatedEventData = (
  event: Event
): { wheelAddress: string; data: RoundStatusUpdatedEvent } => {
  const address = adaptAddress(event.address);
  const roundId = parseAsBigInt([event.data[0]], 0).out;
  const status = parseAsBigInt([event.data[1]], 0).out;
  return {
    wheelAddress: zAddress.parse(address),
    data: RoundStatusUpdatedEventSchema.parse({
      roundId: roundId,
      status: status,
    }),
  };
};

export const getDepositedEventData = (
  event: Event
): { wheelAddress: string; data: DepositedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(event, "Deposited");
  return {
    wheelAddress: zAddress.parse(address),
    data: DepositedEventSchema.parse({
      roundId: decodedEvent.round_id,
      token: decodedEvent.token,
      depositor: decodedEvent.depositor,
      amount: decodedEvent.amount,
      ticketsCount: decodedEvent.tickets_count,
      startTicketIndex: decodedEvent.start_ticket_index,
    }),
  };
};

export const getDepositsWithdrawnEventData = (
  event: Event
): { wheelAddress: string; data: DepositsWithdrawnEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "DepositsWithdrawn"
  );
  return {
    wheelAddress: zAddress.parse(address),
    data: DepositsWithdrawnEventSchema.parse({
      depositor: decodedEvent.depositor,
      withdrawalCalldata: decodedEvent.withdrawal_calldata.map((calldata) => ({
        roundId: calldata.round_id,
        depositIndices: calldata.deposit_indices,
      })),
    }),
  };
};

export const getPrizeClaimedEventData = (
  event: Event
): { wheelAddress: string; data: PrizeClaimedEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "PrizeClaimed"
  );
  return {
    wheelAddress: zAddress.parse(address),
    data: PrizeClaimedEventSchema.parse({
      token: decodedEvent.token,
      winner: decodedEvent.winner,
      roundIds: decodedEvent.round_ids,
      prizes: decodedEvent.prizes,
    }),
  };
};

export const getWinnerDrawnEventData = (
  event: Event
): { wheelAddress: string; data: WinnerDrawnEvent } => {
  const { address, args: decodedEvent } = decodeWheelEvent(
    event,
    "WinnerDrawn"
  );

  return {
    wheelAddress: zAddress.parse(address),
    data: WinnerDrawnEventSchema.parse({
      roundId: decodedEvent.round_id,
      winner: decodedEvent.winner,
      randomValue: decodedEvent.random_value,
      winningTicket: decodedEvent.winning_ticket,
    }),
  };
};
