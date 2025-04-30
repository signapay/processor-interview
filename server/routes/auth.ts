import { Hono } from "hono";

const authRoute = new Hono();

authRoute
  .post("/register", (c) => {
    return c.json({ message: "Register" });
  })
  .post("/login", (c) => {
    return c.json({ message: "Login" });
  });

export default authRoute;
