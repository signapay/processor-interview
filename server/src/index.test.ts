import { describe, expect, it } from "bun:test";
import { app } from "../src";

describe("Elysia Server", () => {
  it("healthcheck", async () => {
    const response = await app
      .handle(new Request("http://localhost:3000/health"))
      .then((res) => res.text());
    expect(response).toBe("OK");
  });
});
