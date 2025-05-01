import { Hono } from "hono";
import {
  register,
  login,
  callbackHandler,
  logout,
  getMe,
} from "./auth.controller";
import { authMiddleware } from "@/kinde";
import type { Env } from "@/context";

const authRoutes = new Hono<Env>()
  .get("/register", register)
  .get("/login", login)
  .get("/callback", callbackHandler)
  .get("/logout", logout)
  .get("/me", authMiddleware, getMe);

export default authRoutes;
