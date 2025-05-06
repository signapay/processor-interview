import { Elysia } from "elysia";
import { db, transactions } from "../db";

export const reportsRoutes = new Elysia().get("/reports", async () => {
  try {
    const result = await db.select().from(transactions);
    return result;
  } catch (error) {
    throw new Error(`Falha ao buscar relatórios: ${error}`);
  }
});
