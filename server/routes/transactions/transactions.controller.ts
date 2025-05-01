import type { Context } from "hono";

import type { Env } from "@/context";

import type { SuccessResponse, Transaction } from "@/shared/types";

export const getTransactions = async (c: Context<Env>) => {
  try {
    const transactions = await c.var.prisma.transaction.findMany({
      orderBy: {
        processedAt: "desc",
      },
    });

    // Map Prisma model to API response type
    const mappedTransactions = transactions.map((t) => {
      // Format the card number with the appropriate mask based on card type
      let maskedCardNumber: string;

      if (t.cardType === "Amex") {
        // Amex format: XXXX-XXXXXX-X1234
        maskedCardNumber = `XXXX-XXXXXX-X${t.cardLastFour}`;
      } else {
        // Default format: XXXX-XXXX-XXXX-1234
        maskedCardNumber = `XXXX-XXXX-XXXX-${t.cardLastFour}`;
      }

      return {
        id: t.id,
        cardNumber: maskedCardNumber,
        cardType: t.cardType,
        timestamp: t.timestamp.toISOString(),
        amount: t.amount,
        processedAt: t.processedAt.toISOString(),
        fileSource: t.fileSource,
      };
    });

    const response: SuccessResponse<Transaction[]> = {
      success: true,
      message: "Transactions fetched",
      data: mappedTransactions,
    };
    return c.json(response);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch transactions",
      },
      500,
    );
  }
};

export const importTransactions = async (c: Context<Env>) => {
  try {
    // Parse the multipart form data
    const body = await c.req.parseBody();
    const file = body["file"];

    // Check if a file was uploaded
    if (!file || !(file instanceof File)) {
      return c.json(
        {
          success: false,
          error: "No file uploaded",
        },
        400,
      );
    }

    // Import the ImportService
    const { ImportService } = await import("@/services/import/import-service");
    const importService = new ImportService(c.var.prisma);

    // Create an import job
    const jobId = await importService.createImportJob(
      file.name,
      file.size,
      file.type,
    );

    // Create a readable stream from the file
    const fileBuffer = await file.arrayBuffer();
    const fileStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(fileBuffer));
        controller.close();
      },
    });

    // Convert Web Stream to Node.js Readable Stream
    const { Readable } = await import("stream");
    const nodeReadable = Readable.fromWeb(fileStream);

    // Process the file stream asynchronously
    // We don't await this to return a response quickly
    importService
      .processFileStream(nodeReadable, jobId, file.type)
      .catch((error) => {
        console.error("Error processing file:", error);
      });

    // Return the job ID to the client
    return c.json({
      success: true,
      message: "File upload started",
      data: {
        jobId,
      },
    });
  } catch (error) {
    console.error("Error importing transactions:", error);
    return c.json(
      {
        success: false,
        error: "Failed to import transactions",
      },
      500,
    );
  }
};

export const getTransactionsSummary = async (c: Context<Env>) => {
  try {
    const prisma = c.var.prisma;

    // Get count of transactions
    const transactionCount = await prisma.transaction.count();

    // Get count of rejected transactions
    const rejectedCount = await prisma.rejectedTransaction.count();

    // Get sum of all transaction amounts
    const amountSum = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
    });

    return c.json({
      success: true,
      message: "Summary fetched",
      data: {
        transactionCount,
        rejectedCount,
        totalAmount: amountSum._sum.amount ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch summary",
      },
      500,
    );
  }
};

// Get the status of an import job
export const getImportJobStatus = async (c: Context<Env>) => {
  try {
    const jobId = c.req.param("jobId");

    if (!jobId) {
      return c.json(
        {
          success: false,
          error: "Job ID is required",
        },
        400,
      );
    }

    // Import the ImportService
    const { ImportService } = await import("@/services/import/import-service");
    const importService = new ImportService(c.var.prisma);

    // Get the job status
    const job = await importService.getImportJobStatus(jobId);

    if (!job) {
      return c.json(
        {
          success: false,
          error: "Import job not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Import job status fetched",
      data: {
        id: job.id,
        fileName: job.fileName,
        fileSize: job.fileSize,
        fileType: job.fileType,
        status: job.status,
        progress: job.progress,
        totalRecords: job.totalRecords,
        processedRecords: job.processedRecords,
        successfulRecords: job.successfulRecords,
        failedRecords: job.failedRecords,
        startedAt: job.startedAt.toISOString(),
        completedAt: job.completedAt ? job.completedAt.toISOString() : null,
        error: job.error,
      },
    });
  } catch (error) {
    console.error("Error fetching import job status:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch import job status",
      },
      500,
    );
  }
};

// Get all import jobs
export const getAllImportJobs = async (c: Context<Env>) => {
  try {
    // Import the ImportService
    const { ImportService } = await import("@/services/import/import-service");
    const importService = new ImportService(c.var.prisma);

    // Get all jobs
    const jobs = await importService.getAllImportJobs();

    return c.json({
      success: true,
      message: "Import jobs fetched",
      data: jobs.map((job) => ({
        id: job.id,
        fileName: job.fileName,
        fileSize: job.fileSize,
        fileType: job.fileType,
        status: job.status,
        progress: job.progress,
        totalRecords: job.totalRecords,
        processedRecords: job.processedRecords,
        successfulRecords: job.successfulRecords,
        failedRecords: job.failedRecords,
        startedAt: job.startedAt.toISOString(),
        completedAt: job.completedAt ? job.completedAt.toISOString() : null,
        error: job.error,
      })),
    });
  } catch (error) {
    console.error("Error fetching import jobs:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch import jobs",
      },
      500,
    );
  }
};

// Get rejected transactions for a job
export const getRejectedTransactions = async (c: Context<Env>) => {
  try {
    const jobId = c.req.param("jobId");

    if (!jobId) {
      return c.json(
        {
          success: false,
          error: "Job ID is required",
        },
        400,
      );
    }

    // Import the ImportService
    const { ImportService } = await import("@/services/import/import-service");
    const importService = new ImportService(c.var.prisma);

    // Get rejected transactions
    const rejectedTransactions =
      await importService.getRejectedTransactions(jobId);

    // Return only the metadata, not the encrypted data
    return c.json({
      success: true,
      message: "Rejected transactions fetched",
      data: rejectedTransactions.map((transaction) => ({
        id: transaction.id,
        rejectionReason: transaction.rejectionReason,
        processedAt: transaction.processedAt.toISOString(),
        // Note: We're not returning the encrypted data, iv, or authTag
        // to prevent accidental exposure of sensitive data
      })),
    });
  } catch (error) {
    console.error("Error fetching rejected transactions:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch rejected transactions",
      },
      500,
    );
  }
};
