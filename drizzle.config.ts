import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env["POSTGRES_DATABASE_URL"] ?? "",
  },
} satisfies Config;
