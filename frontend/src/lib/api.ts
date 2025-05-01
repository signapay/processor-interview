import { hc } from "hono/client";
import { queryOptions, useMutation } from "@tanstack/react-query";

import type {
  AppType,
  CardSummary,
  CardTypeSummary,
  DaySummary,
  RejectedTransaction,
} from "@/shared/types";

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
  formData.append("file", file, file.name);

  // Use fetch directly instead of Hono client to ensure proper multipart/form-data handling
  const response = await fetch("/api/v1/transactions/import", {
    method: "POST",
    body: formData,
    // Don't set Content-Type header, let the browser set it with the boundary
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Upload error response:", errorText);
    throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
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

// Get transaction summary by card
async function getTransactionSummaryByCard(): Promise<CardSummary[]> {
  const res = await api.v1.transactions.summary["by-card"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch transaction summary by card");
  }
  const { data } = await res.json();
  return data;
}

export const transactionSummaryByCardQueryOptions = queryOptions({
  queryKey: ["get-transaction-summary-by-card"],
  queryFn: getTransactionSummaryByCard,
});

// Get transaction summary by card type
async function getTransactionSummaryByCardType(): Promise<CardTypeSummary[]> {
  const res = await api.v1.transactions.summary["by-card-type"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch transaction summary by card type");
  }
  const { data } = await res.json();
  return data;
}

export const transactionSummaryByCardTypeQueryOptions = queryOptions({
  queryKey: ["get-transaction-summary-by-card-type"],
  queryFn: getTransactionSummaryByCardType,
});

// Get transaction summary by day
async function getTransactionSummaryByDay(): Promise<DaySummary[]> {
  const res = await api.v1.transactions.summary["by-day"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch transaction summary by day");
  }
  const { data } = await res.json();
  return data;
}

export const transactionSummaryByDayQueryOptions = queryOptions({
  queryKey: ["get-transaction-summary-by-day"],
  queryFn: getTransactionSummaryByDay,
});

// Get all rejected transactions
async function getAllRejectedTransactions(): Promise<RejectedTransaction[]> {
  const res = await api.v1.transactions.rejected.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch rejected transactions");
  }
  const { data } = await res.json();
  return data;
}

export const rejectedTransactionsQueryOptions = queryOptions({
  queryKey: ["get-all-rejected-transactions"],
  queryFn: getAllRejectedTransactions,
});
