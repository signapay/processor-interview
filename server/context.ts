import type { UserType } from "@kinde-oss/kinde-typescript-sdk";
import type { privateRoutes, publicRoutes } from ".";
import type { CreatePrismaClient } from "./db";

export type Variables = {
  prisma: CreatePrismaClient;
  user: UserType;
};

export type Env = {
  Variables: Variables;
};

export type AppType = typeof privateRoutes | typeof publicRoutes;
