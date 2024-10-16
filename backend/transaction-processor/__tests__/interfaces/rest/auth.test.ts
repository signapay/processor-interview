import request from "supertest";
import express from "express";
import Interfaces from "../../../interfaces";
import env from "../../../env";

describe("Auth Middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(Interfaces.REST.Auth);
    app.get("/test", (req, res) => res.sendStatus(200));
  });

  it("should allow requests with valid token", async () => {
    const response = await request(app)
      .get("/test")
      .set("Authorization", `Bearer ${env.AUTH_TOKEN}`);

    expect(response.status).toBe(200);
  });

  it("should reject requests without authorization header", async () => {
    const response = await request(app).get("/test");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Authorization header missing" });
  });

  it("should reject requests with invalid token", async () => {
    const response = await request(app)
      .get("/test")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid token" });
  });

  it("should reject requests with malformed authorization header", async () => {
    const response = await request(app)
      .get("/test")
      .set("Authorization", "InvalidFormat");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid authorization header" });
  });
});
