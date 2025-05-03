import { Elysia, t } from "elysia";

const transactionsRoute = new Elysia({ prefix: "/transactions" })
  .get("/by-card", () => {
    return 'by-card';
  })
  .get("/by-card-type", () => {
    return 'by-card-type';
  })
  .get("/by-day", () => {
    return 'by-day';
  })
  .get("/rejected", () => {
    return 'rejected';
  })
  .post(
    "/",
    async ({ body }) => {
      const files = body.files;

      if (!files || !Array.isArray(files)) {
        return { error: "No files uploaded" };
      }

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
    return { message: "All transactions will be deleted" };
  });

export { transactionsRoute };
