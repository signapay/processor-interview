import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().min(3000).default(4000),
  NODE_ENV: z
    .union([
      z.literal("localhost"),
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("localhost"),
  AUTH_TOKEN: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
