import { z } from "zod";

// Import job status enum
export const ImportJobStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ImportJobStatus =
  (typeof ImportJobStatus)[keyof typeof ImportJobStatus];

// Import job schema
export const importJobSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  status: z.enum([
    ImportJobStatus.PENDING,
    ImportJobStatus.PROCESSING,
    ImportJobStatus.COMPLETED,
    ImportJobStatus.FAILED,
  ]),
  progress: z.number(),
  totalRecords: z.number(),
  processedRecords: z.number(),
  successfulRecords: z.number(),
  failedRecords: z.number(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  error: z.string().nullable(),
});

export type ImportJob = z.infer<typeof importJobSchema>;

// Raw transaction data from parsed files
export const rawTransactionSchema = z.object({
  cardNumber: z.string(),
  timestamp: z.string(),
  amount: z.number(),
});

export type RawTransaction = z.infer<typeof rawTransactionSchema>;

// Response types for import endpoints
export const importResponseSchema = z.object({
  jobId: z.string(),
  status: z.enum([
    ImportJobStatus.PENDING,
    ImportJobStatus.PROCESSING,
    ImportJobStatus.COMPLETED,
    ImportJobStatus.FAILED,
  ]),
});

export type ImportResponse = z.infer<typeof importResponseSchema>;

// Import job status response
export const importJobStatusSchema = importJobSchema;

export type ImportJobStatusResponse = z.infer<typeof importJobStatusSchema>;
