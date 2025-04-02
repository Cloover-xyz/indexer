import type { ApibaraRuntimeConfig } from "apibara/types";
import { drizzle as nodePgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as pgLiteDrizzle } from "drizzle-orm/pglite";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as userSchema from "./schema/users";
import * as wheelSchema from "./schema/wheels";
import * as tokenSchema from "./schema/tokens";
import * as eventSchema from "./schema/events";
import { useDrizzleStorage } from "@apibara/plugin-drizzle";
import { getValidatedNetwork, type NetworkType } from "utils/provider";

interface GlobalConfig {
  postgresConnectionString: string;
  network: NetworkType;
  startingBlock: bigint;
  streamUrl: string;
}

const schema = {
  ...userSchema,
  ...wheelSchema,
  ...tokenSchema,
  ...eventSchema,
} as const;
type Schema = typeof schema;
type Database = NodePgDatabase<Schema>;

class ConfigManager {
  private static instance: ConfigManager;
  private config: GlobalConfig | null = null;
  private dbInstance: Database | null = null;

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public initialize(runtimeConfig: ApibaraRuntimeConfig) {
    const indexerId = "cloover";
    const { startingBlock, streamUrl, postgresConnectionString } =
      runtimeConfig[indexerId];
    this.config = {
      postgresConnectionString,
      network: getValidatedNetwork(runtimeConfig.network),
      startingBlock: BigInt(startingBlock),
      streamUrl,
    };
  }

  public getConfig(): GlobalConfig {
    if (!this.config) {
      throw new Error("ConfigManager not initialized");
    }
    return this.config;
  }

  public getPostgresConnectionString(): string {
    return this.getConfig().postgresConnectionString;
  }

  public getNetwork(): NetworkType {
    return this.getConfig().network;
  }

  public getStartingBlock(): bigint {
    return this.getConfig().startingBlock;
  }

  public getStreamUrl(): string {
    return this.getConfig().streamUrl;
  }

  public getDb() {
    if (!this.dbInstance) {
      const connectionString = this.getPostgresConnectionString();

      // Create pglite instance for memory database
      if (connectionString.includes("memory")) {
        this.dbInstance = pgLiteDrizzle({
          schema,
          connection: {
            dataDir: connectionString,
          },
        }) as unknown as Database;
      } else {
        // Create node-postgres instance for regular PostgreSQL
        const pool = new pg.Pool({
          connectionString,
        });

        this.dbInstance = nodePgDrizzle(pool, { schema });
      }
    }
    return this.dbInstance;
  }

  public useDrizzleStorageQuery() {
    return useDrizzleStorage(this.getDb());
  }
}

export const configManager = ConfigManager.getInstance();
