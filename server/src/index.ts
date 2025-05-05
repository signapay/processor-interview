import { Elysia } from "elysia";

export const app = new Elysia().get("/health", () => "OK");

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
