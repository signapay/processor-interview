import type { Context } from "hono";
import { kindeClient, sessionManager } from "@/kinde";
import type { Env } from "@/context";

export const register = async (c: Context) => {
  const registerUrl = await kindeClient.register(sessionManager(c));
  return c.redirect(registerUrl.toString());
};

export const login = async (c: Context) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
};

export const logout = async (c: Context) => {
  const logoutUrl = await kindeClient.logout(sessionManager(c));
  return c.redirect(logoutUrl.toString());
};

export const callbackHandler = async (c: Context) => {
  const url = new URL(c.req.url);
  await kindeClient.handleRedirectToApp(sessionManager(c), url);
  return c.redirect("/");
};

export const getMe = async (c: Context<Env>) => {
  const user = c.var.user;
  return c.json({ success: true, data: user });
};
