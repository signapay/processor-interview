import { Elysia, t } from "elysia";
import { TransactionsService } from "@/src/services/transactions";

const transactionsRoute = new Elysia({ prefix: "/transactions" })
  .get("/by-card", () => {
    return TransactionsService.getTransactionsByCard();
  })
  .get("/by-card-type", () => {
    return TransactionsService.getTransactionsByCardType();
  })
  .get("/by-day", () => {
    return TransactionsService.getTransactionsByDay();
  })
  .get("/rejected", () => {
    return TransactionsService.getRejectedTransactions();
  })
  .post(
    "/",
    async ({ body }) => {
      const files = body.files;

      if (!files || !Array.isArray(files)) {
        return { error: "No files uploaded" };
      }

      TransactionsService.handleFileProcessing(files);

      return { status: "Transactions are being processed" };
    },
    {
      body: t.Object({
        files: t.Files({
          format: ["csv", "xml", "json"],
          multiple: true,
        }),
      }),
    },
  )
  .delete("/", () => {
    TransactionsService.handleTransactionDeletion();
    return { message: "All transactions will be deleted" };
  });

export { transactionsRoute };
