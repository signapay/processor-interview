import dotenv from "dotenv";
import { resolve } from "path";

// Determine the environment
const env = process.env.NODE_ENV || "development";

// Load the appropriate .env file based on the environment
switch (env) {
  case "development":
    dotenv.config({ path: resolve(process.cwd(), ".env.development") });
    break;
  case "production":
    dotenv.config({ path: resolve(process.cwd(), ".env.production") });
    break;
  case "test":
    dotenv.config({ path: resolve(process.cwd(), ".env") });
    break;
  default:
    throw new Error(`Unknown environment: ${env}`);
}

// Export the environment variables
export const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: env,
};

console.log("NODE_ENV " + env);
