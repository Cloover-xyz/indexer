import { hash, encode } from "starknet";
import { decodeEvent, Event, getBigIntSelector } from "@apibara/starknet";
import { useLogger } from "@apibara/indexer/plugins";
import { Wheel_ABI } from "abis/Wheel_ABI";

const baseEventName = "cloover::wheel::events::Events::";

const CONTRACT_DEPLOYED_EVENT_SELECTOR =
  getBigIntSelector("ContractDeployed").toString();

export const handleWheelContractDeployed = async (event: Event) => {
  const logger = useLogger();
  logger.log(`Event ContractDeployed`);
  const decodedEvent = decodeEvent({
    abi: Wheel_ABI,
    event,
    eventName: `${baseEventName}ContractDeployed`,
  });
  logger.log({ decodedEvent });
};

export const WheelSettersEventHandlers = {
  [CONTRACT_DEPLOYED_EVENT_SELECTOR]: handleWheelContractDeployed,
};
