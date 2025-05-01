import type { Context } from "hono";
import { Decimal } from "decimal.js";

import type { Env } from "@/context";

import type {
  CardSummary,
  CardTypeSummary,
  DaySummary,
  RejectedTransaction,
  SuccessResponse,
  Transaction,
} from "@/shared/types";

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
    console.log("Content-Type:", c.req.header("Content-Type"));

    // Parse the multipart form data
    const formData = await c.req.raw.formData();
    console.log("FormData entries:", [...formData.entries()].map(([key]) => key));

    const file = formData.get("file");
    console.log("File object type:", file ? file.constructor.name : "no file");

    // Check if a file was uploaded
    if (!file || !(file instanceof File)) {
      console.error("No file uploaded or file is not a File instance:", file);
      return c.json(
        {
          success: false,
          error: "No file uploaded",
        },
        400,
      );
    }

    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Import the ImportService
    const { ImportService } = await import("@/services/import/import-service");
    const importService = new ImportService(c.var.prisma);

    // Create an import job
    try {
      const jobId = await importService.createImportJob(
        file.name || "unknown.file",
        file.size,
        file.type || "application/octet-stream",
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
    } catch (jobError) {
      console.error("Error creating import job:", jobError);
      throw jobError;
    }
  } catch (error) {
    console.error("Error importing transactions:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
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

// Get all rejected transactions
export const getAllRejectedTransactions = async (c: Context<Env>) => {
  try {
    const prisma = c.var.prisma;

    // Get all rejected transactions
    const rejectedTransactions = await prisma.rejectedTransaction.findMany({
      orderBy: {
        processedAt: "desc",
      },
    });

    // Return only the metadata, not the encrypted data
    return c.json({
      success: true,
      message: "All rejected transactions fetched",
      data: rejectedTransactions.map((transaction) => ({
        id: transaction.id,
        rejectionReason: transaction.rejectionReason,
        processedAt: transaction.processedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching all rejected transactions:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch all rejected transactions",
      },
      500,
    );
  }
};

// Get transaction summary by card
export const getTransactionSummaryByCard = async (c: Context<Env>) => {
  try {
    const prisma = c.var.prisma;

    // Get transactions grouped by card (last four digits and type)
    const transactions = await prisma.transaction.findMany();

    // Use Decimal.js for precise calculations
    const cardSummaries = new Map<string, {
      cardLastFour: string;
      cardType: string;
      totalAmount: Decimal;
      transactionCount: number;
    }>();

    // Group transactions by card
    for (const transaction of transactions) {
      const key = `${transaction.cardLastFour}-${transaction.cardType}`;

      if (!cardSummaries.has(key)) {
        cardSummaries.set(key, {
          cardLastFour: transaction.cardLastFour,
          cardType: transaction.cardType,
          totalAmount: new Decimal(0),
          transactionCount: 0,
        });
      }

      const summary = cardSummaries.get(key)!;
      summary.totalAmount = summary.totalAmount.plus(new Decimal(transaction.amount));
      summary.transactionCount += 1;
    }

    // Convert to array and format for response
    const result = Array.from(cardSummaries.values()).map(summary => ({
      cardLastFour: summary.cardLastFour,
      cardType: summary.cardType,
      totalAmount: summary.totalAmount.toNumber(),
      transactionCount: summary.transactionCount,
    }));

    return c.json({
      success: true,
      message: "Transaction summary by card fetched",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching transaction summary by card:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch transaction summary by card",
      },
      500,
    );
  }
};

// Get transaction summary by card type
export const getTransactionSummaryByCardType = async (c: Context<Env>) => {
  try {
    const prisma = c.var.prisma;

    // Get transactions grouped by card type
    const transactions = await prisma.transaction.findMany();

    // Use Decimal.js for precise calculations
    const typeSummaries = new Map<string, {
      cardType: string;
      totalAmount: Decimal;
      transactionCount: number;
    }>();

    // Group transactions by card type
    for (const transaction of transactions) {
      const key = transaction.cardType;

      if (!typeSummaries.has(key)) {
        typeSummaries.set(key, {
          cardType: key,
          totalAmount: new Decimal(0),
          transactionCount: 0,
        });
      }

      const summary = typeSummaries.get(key)!;
      summary.totalAmount = summary.totalAmount.plus(new Decimal(transaction.amount));
      summary.transactionCount += 1;
    }

    // Convert to array and format for response
    const result = Array.from(typeSummaries.values()).map(summary => ({
      cardType: summary.cardType,
      totalAmount: summary.totalAmount.toNumber(),
      transactionCount: summary.transactionCount,
    }));

    return c.json({
      success: true,
      message: "Transaction summary by card type fetched",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching transaction summary by card type:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch transaction summary by card type",
      },
      500,
    );
  }
};

// Get transaction summary by day
export const getTransactionSummaryByDay = async (c: Context<Env>) => {
  try {
    const prisma = c.var.prisma;

    // Get all transactions
    const transactions = await prisma.transaction.findMany();

    // Use Decimal.js for precise calculations
    const daySummaries = new Map<string, {
      date: string;
      totalAmount: Decimal;
      transactionCount: number;
    }>();

    // Group transactions by day
    for (const transaction of transactions) {
      // Format date as YYYY-MM-DD
      const date = transaction.timestamp.toISOString().split('T')[0];

      if (!daySummaries.has(date)) {
        daySummaries.set(date, {
          date,
          totalAmount: new Decimal(0),
          transactionCount: 0,
        });
      }

      const summary = daySummaries.get(date)!;
      summary.totalAmount = summary.totalAmount.plus(new Decimal(transaction.amount));
      summary.transactionCount += 1;
    }

    // Convert to array, sort by date, and format for response
    const result = Array.from(daySummaries.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(summary => ({
        date: summary.date,
        totalAmount: summary.totalAmount.toNumber(),
        transactionCount: summary.transactionCount,
      }));

    return c.json({
      success: true,
      message: "Transaction summary by day fetched",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching transaction summary by day:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch transaction summary by day",
      },
      500,
    );
  }
};
