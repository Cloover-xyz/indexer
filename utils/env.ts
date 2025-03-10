import * as envVar from "env-var";
import { config } from "dotenv";

config();

const MODE = envVar.get("MODE").required().asString();

export const ENV = {
  MODE,
  POSTGRES_DATABASE_URL: envVar
    .get("POSTGRES_DATABASE_URL")
    .required(MODE === "production")
    .asString(),
  ALCHEMY_API_KEY: envVar.get("ALCHEMY_API_KEY").required().asString(),
};
