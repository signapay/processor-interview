import { hc } from "hono/client";
import { queryOptions, useMutation } from "@tanstack/react-query";

import type { AppType } from "@/shared/types";

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

async function getAllTransactions() {
  const res = await api.v1.transactions.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }
  const { data } = await res.json();
  return data;
}

export const transactionsQueryOptions = queryOptions({
  queryKey: ["get-all-transactions"],
  queryFn: getAllTransactions,
});

// Function to upload a transaction file
export async function uploadTransactionFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.v1.transactions.import.$post({
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message ?? "Upload failed");
  }

  return result.data;
}

// Hook for file upload mutation
export function useUploadTransactionFile() {
  return useMutation({
    mutationFn: uploadTransactionFile,
  });
}
