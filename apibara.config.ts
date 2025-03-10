import typescript from "@rollup/plugin-typescript";
import type { Plugin } from "apibara/rollup";
import { defineConfig } from "apibara/config";
import { ENV } from "./utils/env";

export default defineConfig({
  runtimeConfig: {
    network: "sepolia",
    wheel: {
      startingBlock: 544_220,
      streamUrl: "https://starknet-sepolia.preview.apibara.org",
      postgresConnectionString: ENV.POSTGRES_DATABASE_URL ?? "memory://wheel",
    },
  },
  rollupConfig: {
    plugins: [typescript() as Plugin],
  },
});
