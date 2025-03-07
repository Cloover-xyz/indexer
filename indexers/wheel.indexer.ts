import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";

import { getDrizzlePgDatabase } from "../lib/db";
import { handleEvent } from "handlers";

export default function (runtimeConfig: ApibaraRuntimeConfig) {
  const indexerId = "wheel";
  const { startingBlock, streamUrl, postgresConnectionString } =
    runtimeConfig[indexerId];
  const { db } = getDrizzlePgDatabase(postgresConnectionString);
  console.log({ startingBlock });
  return defineIndexer(StarknetStream)({
    streamUrl,
    finality: "accepted",
    startingBlock: BigInt(startingBlock),
    filter: {
      events: [
        {
          address:
            "0x019577ac15d64b351982d0e160bdf0d92c04e93f9cc69780e6b3a0b497023433",
        },
      ],
      header: "always",
    },
    plugins: [drizzleStorage({ db, persistState: true })],
    async transform({ block }) {
      const logger = useLogger();
      const { events, header } = block;
      logger.log(header.blockNumber, { events });

      if (events.length === 0) {
        return;
      }

      for (const event of events) {
        logger.log(
          `Found event ${event.keys[0]} in bigInt ${BigInt(event.keys[0]).toString()}`
        );
        await handleEvent(event);
      }
    },
  });
}
