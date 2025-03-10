import type { ApibaraRuntimeConfig } from "apibara/types";
import { drizzle as nodePgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as pgLiteDrizzle } from "drizzle-orm/pglite";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as userSchema from "./schema/users";
import * as wheelSchema from "./schema/wheels";
import * as tokenSchema from "./schema/tokens";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";

interface GlobalConfig {
  postgresConnectionString: string;
  network: string;
  startingBlock: number;
  streamUrl: string;
}

const schema = { ...userSchema, ...wheelSchema, ...tokenSchema } as const;
type Schema = typeof schema;
type Database = NodePgDatabase<Schema>;

class DbManager {
  private static instance: DbManager;
  private config: GlobalConfig | null = null;
  private dbInstance: Database | null = null;

  private constructor() {}

  public static getInstance(): DbManager {
    if (!DbManager.instance) {
      DbManager.instance = new DbManager();
    }
    return DbManager.instance;
  }

  public initialize(runtimeConfig: ApibaraRuntimeConfig) {
    const indexerId = "wheel";
    const { startingBlock, streamUrl, postgresConnectionString } =
      runtimeConfig[indexerId];

    this.config = {
      postgresConnectionString,
      network: runtimeConfig.network,
      startingBlock,
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

  public getNetwork(): string {
    return this.getConfig().network;
  }

  public getStartingBlock(): number {
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

export const dbManager = DbManager.getInstance();
