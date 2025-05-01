import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env["DATABASE_URL"]}`;
const adapter = new PrismaPg({ connectionString, connectionLimit: 20 });

const createPrismaClient = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export type CreatePrismaClient = ReturnType<typeof createPrismaClient>;

declare const globalThis: {
  prismaGlobal: CreatePrismaClient;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
