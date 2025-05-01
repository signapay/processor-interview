import { hc } from "hono/client";
import type { AppType } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

const client = hc<AppType>("/");
export const api = client.api;

async function getCurrentUser() {
  const res = await api.v1.auth.me.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }
  const { data } = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});
