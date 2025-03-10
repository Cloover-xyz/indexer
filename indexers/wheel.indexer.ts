import { defineIndexer } from "@apibara/indexer";
import { drizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";

import { handleEvent } from "handlers";
import { configManager } from "../lib/configManager";

export default function (runtimeConfig: ApibaraRuntimeConfig) {
  configManager.initialize(runtimeConfig);

  const db = configManager.getDb();

  return defineIndexer(StarknetStream)({
    streamUrl: configManager.getStreamUrl(),
    finality: "accepted",
    startingBlock: configManager.getStartingBlock(),
    filter: {
      events: [
        {
          address:
            "0x019577ac15d64b351982d0e160bdf0d92c04e93f9cc69780e6b3a0b497023433",
        },
      ],
    },
    plugins: [drizzleStorage({ db, persistState: true })],
    async transform({ block }) {
      const { events, header } = block;
      if (events.length === 0) {
        return;
      }
      for (const event of events) {
        await handleEvent(event, header);
      }
    },
  });
}
