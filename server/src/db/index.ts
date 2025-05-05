import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("No connection string provided");
}

export const db = drizzle(connectionString, { schema });
export * from "./schema";
