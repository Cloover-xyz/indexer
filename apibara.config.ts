import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "apibara/config";
import { ENV } from "./utils/env";
import { Plugin } from "apibara/rollup";

export default defineConfig({
  runtimeConfig: {
    network: "sepolia",
    cloover: {
      startingBlock: 544_220,
      streamUrl: "https://starknet-sepolia.preview.apibara.org",
      postgresConnectionString: ENV.POSTGRES_DATABASE_URL ?? "memory://cloover",
    },
  },
  rollupConfig: {
    plugins: [typescript() as Plugin],
  },
});
