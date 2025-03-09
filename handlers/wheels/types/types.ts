import { z } from "zod";

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
  ProtocolFeeTransferredEventSchema,
  RoundCutoffTimeSetEventSchema,
  RoundDurationUpdatedEventSchema,
  RoundsCancelledEventSchema,
  RoundStatusUpdatedEventSchema,
  VRFUpdatedEventSchema,
  WheelContractDeployedEventSchema,
  WinnerDrawnEventSchema,
} from "./eventsSchema";

export type WheelContractDeployedEvent = z.infer<
  typeof WheelContractDeployedEventSchema
>;

export type DepositsWithdrawnEvent = z.infer<
  typeof DepositsWithdrawnEventSchema
>;

export type PricePerTicketUpdatedEvent = z.infer<
  typeof PricePerTicketUpdatedEventSchema
>;

export type MaximumNumberOfParticipantsPerRoundUpdatedEvent = z.infer<
  typeof MaximumNumberOfParticipantsPerRoundUpdatedEventSchema
>;

export type MaximumParticipantTicketsPerRoundUpdatedEvent = z.infer<
  typeof MaximumParticipantTicketsPerRoundUpdatedEventSchema
>;

export type MaximumNumberOfDepositsPerRoundUpdatedEvent = z.infer<
  typeof MaximumNumberOfDepositsPerRoundUpdatedEventSchema
>;

export type ProtocolFeeBpUpdatedEvent = z.infer<
  typeof ProtocolFeeBpUpdatedEventSchema
>;

export type ProtocolFeeRecipientUpdatedEvent = z.infer<
  typeof ProtocolFeeRecipientUpdatedEventSchema
>;

export type RoundDurationUpdatedEvent = z.infer<
  typeof RoundDurationUpdatedEventSchema
>;

export type OutflowAllowedToggledEvent = z.infer<
  typeof OutflowAllowedToggledEventSchema
>;

export type VRFUpdatedEvent = z.infer<typeof VRFUpdatedEventSchema>;

export type RoundStatusUpdatedEvent = z.infer<
  typeof RoundStatusUpdatedEventSchema
>;

export type RoundCutoffTimeSetEvent = z.infer<
  typeof RoundCutoffTimeSetEventSchema
>;

export type DepositedEvent = z.infer<typeof DepositedEventSchema>;

export type WinnerDrawnEvent = z.infer<typeof WinnerDrawnEventSchema>;

export type ProtocolFeeTransferredEvent = z.infer<
  typeof ProtocolFeeTransferredEventSchema
>;

export type PrizeClaimedEvent = z.infer<typeof PrizeClaimedEventSchema>;

export type RoundsCancelledEvent = z.infer<typeof RoundsCancelledEventSchema>;
