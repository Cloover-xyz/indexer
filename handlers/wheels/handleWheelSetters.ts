import { BlockHeader, Event, getBigIntSelector } from "@apibara/starknet";
import { useLogger } from "@apibara/indexer/plugins";

import { NetworkType } from "utils/provider";
import {
  getMaximumNumberOfDepositsPerRoundUpdatedEventData,
  getMaximumNumberOfParticipantsPerRoundUpdatedEventData,
  getMaximumParticipantTicketsPerRoundUpdatedEventData,
  getOutflowAllowedToggledEventData,
  getPricePerTicketUpdatedEventData,
  getProtocolFeeBpUpdatedEventData,
  getProtocolFeeRecipientUpdatedEventData,
  getRoundDurationUpdatedEventData,
  getVrfUpdatedEventData,
  getWheelContractDeployedEventData,
} from "./helpers/eventsData";
import { insertWheel, updateWheel } from "./helpers/db-wheel";

const CONTRACT_DEPLOYED_EVENT_SELECTOR =
  getBigIntSelector("ContractDeployed").toString();

const PRICE_PER_TICKET_UPDATED_EVENT_SELECTOR = getBigIntSelector(
  "PricePerTicketUpdated"
).toString();

const PROTOCOL_FEE_BP_UPDATED_EVENT_SELECTOR = getBigIntSelector(
  "ProtocolFeeBpUpdated"
).toString();

const PROTOCOL_FEE_RECIPIENT_UPDATED_EVENT_SELECTOR = getBigIntSelector(
  "ProtocolFeeRecipientUpdated"
).toString();

const ROUND_DURATION_UPDATED_EVENT_SELECTOR = getBigIntSelector(
  "RoundDurationUpdated"
).toString();

const VRF_UPDATED_EVENT_SELECTOR = getBigIntSelector("VRFUpdated").toString();

const MAXIMUM_NUMBER_OF_DEPOSITS_PER_ROUND_UPDATED_EVENT_SELECTOR =
  getBigIntSelector("MaximumNumberOfDepositsPerRoundUpdated").toString();

const MAXIMUM_NUMBER_OF_PARTICIPANTS_PER_ROUND_UPDATED_EVENT_SELECTOR =
  getBigIntSelector("MaximumNumberOfParticipantsPerRoundUpdated").toString();

const MAXIMUM_PARTICIPANT_TICKETS_PER_ROUND_UPDATED_EVENT_SELECTOR =
  getBigIntSelector("MaximumParticipantTicketsPerRoundUpdated").toString();

const OUTFLOW_ALLOWED_TOGGLED_EVENT_SELECTOR = getBigIntSelector(
  "OutflowAllowedToggled"
).toString();

export const handleWheelContractDeployed = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getWheelContractDeployedEventData(event);
  logger.log("Event ContractDeployed", { data });
  await insertWheel(wheelAddress, data, timestamp);
};

export const handlePricePerTicketUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getPricePerTicketUpdatedEventData(event);
  logger.log("Event PricePerTicketUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleProtocolFeeBpUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getProtocolFeeBpUpdatedEventData(event);
  logger.log("Event ProtocolFeeBpUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleProtocolFeeRecipientUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getProtocolFeeRecipientUpdatedEventData(event);
  logger.log("Event ProtocolFeeRecipientUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleRoundDurationUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getRoundDurationUpdatedEventData(event);
  logger.log("Event RoundDurationUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleVrfUpdated = async (event: Event, header: BlockHeader) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getVrfUpdatedEventData(event);
  logger.log("Event VrfUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleMaximumNumberOfDepositsPerRoundUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } =
    getMaximumNumberOfDepositsPerRoundUpdatedEventData(event);
  logger.log("Event MaximumNumberOfDepositsPerRoundUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleMaximumNumberOfParticipantsPerRoundUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } =
    getMaximumNumberOfParticipantsPerRoundUpdatedEventData(event);
  logger.log("Event MaximumNumberOfParticipantsPerRoundUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleMaximumParticipantTicketsPerRoundUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } =
    getMaximumParticipantTicketsPerRoundUpdatedEventData(event);
  logger.log("Event MaximumParticipantTicketsPerRoundUpdated", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export const handleOutflowAllowedToggled = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getOutflowAllowedToggledEventData(event);
  logger.log("Event OutflowAllowedToggled", { data });
  await updateWheel(wheelAddress, { ...data, updatedAt: timestamp });
};

export default {
  [CONTRACT_DEPLOYED_EVENT_SELECTOR]: handleWheelContractDeployed,
  [PRICE_PER_TICKET_UPDATED_EVENT_SELECTOR]: handlePricePerTicketUpdated,
  [PROTOCOL_FEE_BP_UPDATED_EVENT_SELECTOR]: handleProtocolFeeBpUpdated,
  [PROTOCOL_FEE_RECIPIENT_UPDATED_EVENT_SELECTOR]:
    handleProtocolFeeRecipientUpdated,
  [ROUND_DURATION_UPDATED_EVENT_SELECTOR]: handleRoundDurationUpdated,
  [VRF_UPDATED_EVENT_SELECTOR]: handleVrfUpdated,
  [MAXIMUM_NUMBER_OF_PARTICIPANTS_PER_ROUND_UPDATED_EVENT_SELECTOR]:
    handleMaximumNumberOfParticipantsPerRoundUpdated,
  [MAXIMUM_PARTICIPANT_TICKETS_PER_ROUND_UPDATED_EVENT_SELECTOR]:
    handleMaximumParticipantTicketsPerRoundUpdated,
  [MAXIMUM_NUMBER_OF_DEPOSITS_PER_ROUND_UPDATED_EVENT_SELECTOR]:
    handleMaximumNumberOfDepositsPerRoundUpdated,
  [OUTFLOW_ALLOWED_TOGGLED_EVENT_SELECTOR]: handleOutflowAllowedToggled,
};
