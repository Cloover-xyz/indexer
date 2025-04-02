import { defineConfig } from "apibara/config";
import { ENV } from "./utils/env";

export default defineConfig({
  runtimeConfig: {
    network: "sepolia",
    cloover: {
      startingBlock: 544_220,
      streamUrl: "https://starknet-sepolia.preview.apibara.org",
      postgresConnectionString: ENV.POSTGRES_DATABASE_URL ?? "memory://cloover",
    },
  },
});
