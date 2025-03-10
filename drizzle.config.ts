import type { Config } from "drizzle-kit";
import { ENV } from "./utils/env";
export default {
  schema: "./lib/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.POSTGRES_DATABASE_URL ?? "",
  },
} satisfies Config;
