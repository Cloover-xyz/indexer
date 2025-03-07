import { type Event } from "@apibara/starknet";
import { WheelSettersEventHandlers } from "./wheels/handleWheelSetters";
import { useLogger } from "@apibara/indexer/plugins";

const eventHandlers = { ...WheelSettersEventHandlers };

export const handleEvent = async (event: Event) => {
  const logger = useLogger();
  logger.log({ eventHandlers });
  const handler = eventHandlers[BigInt(event.keys[0]).toString()];
  if (!handler) {
    return;
  }
  await handler(event);
};
