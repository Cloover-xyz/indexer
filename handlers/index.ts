import type { Event, BlockHeader } from "@apibara/starknet";
import WheelSettersEventHandlers from "./wheels/handleWheelSetters";
import WheelEventHandlers from "./wheels/handleWheel";

const eventHandlers = { ...WheelSettersEventHandlers, ...WheelEventHandlers };

export const handleEvent = async (event: Event, header: BlockHeader) => {
  const handler = eventHandlers[BigInt(event.keys[0]).toString()];
  if (!handler) {
    return;
  }
  await handler(event, header);
};
