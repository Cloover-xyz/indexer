import * as userSchema from "./schema/users";
import * as wheelSchema from "./schema/wheels";
import * as tokenSchema from "./schema/tokens";
import { drizzle as nodePgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as pgLiteDrizzle } from "drizzle-orm/pglite";
import pg from "pg";

export function getDrizzlePgDatabase(connectionString: string) {
  // Create pglite instance
  if (connectionString.includes("memory")) {
    return {
      db: pgLiteDrizzle({
        schema: { ...userSchema, ...wheelSchema, ...tokenSchema },
        connection: {
          dataDir: connectionString,
        },
      }),
    };
  }

  // Create node-postgres instance
  const pool = new pg.Pool({
    connectionString,
  });

  return {
    db: nodePgDrizzle(pool, {
      schema: { ...userSchema, ...wheelSchema, ...tokenSchema },
    }),
  };
}
