import { Readable } from "stream";

import { PrismaClient } from "@prisma/client";

import { ImportJobStatus, type RawTransaction } from "@/shared/import-types";

import { CryptoService } from "../crypto/crypto-service";
import { ParserFactory } from "../parsers/parser-factory";
import { TransactionValidator } from "../validation/transaction-validator";

export class ImportService {
  private readonly prisma: PrismaClient;
  private readonly parserFactory: ParserFactory;
  private readonly validator: TransactionValidator;
  private readonly cryptoService: CryptoService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.validator = new TransactionValidator();
    this.cryptoService = new CryptoService();

    // Initialize parser factory with progress callback
    this.parserFactory = new ParserFactory({
      onProgress: (progress) => {
        // This will be used to update the import job progress
        console.log(`Parsing progress: ${progress}%`);
      },
      onError: (error) => {
        console.error("Parsing error:", error);
      },
    });
  }

  // Create a new import job
  async createImportJob(
    fileName: string,
    fileSize: number,
    fileType: string,
  ): Promise<string> {
    const importJob = await this.prisma.importJob.create({
      data: {
        fileName,
        fileSize,
        fileType,
        status: ImportJobStatus.PENDING,
      },
    });

    return importJob.id;
  }

  // Process a file stream
  async processFileStream(
    stream: Readable,
    jobId: string,
    fileType: string,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    try {
      // Update job status to processing
      await this.updateJobStatus(jobId, ImportJobStatus.PROCESSING);

      // Get the appropriate parser
      const parser = this.parserFactory.getParser(fileType);
      if (!parser) {
        throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Parse the file
      const transactions = await parser.parse(stream);

      // Update job with total records
      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          totalRecords: transactions.length,
        },
      });

      console.log(
        `Processing ${transactions.length} transactions for job ${jobId}`,
      );

      // Process each transaction
      let processedCount = 0;
      let successCount = 0;
      let failedCount = 0;

      for (const transaction of transactions) {
        try {
          // Validate the transaction
          const validationResult = this.validator.validate(transaction);

          if (validationResult.isValid) {
            // Transaction is valid, encrypt and store it
            await this.storeValidTransaction(transaction, jobId);
            successCount++;
          } else {
            // Transaction is invalid, store the rejection reason
            await this.storeRejectedTransaction(
              transaction,
              validationResult.reason ?? "Unknown validation error",
              jobId,
            );
            failedCount++;
          }

          // Update progress
          processedCount++;
          const progress = (processedCount / transactions.length) * 100;

          // Log progress periodically
          if (
            processedCount % 10 === 0 ||
            processedCount === transactions.length
          ) {
            console.log(
              `Job ${jobId}: Processed ${processedCount}/${transactions.length} transactions. Success: ${successCount}, Failed: ${failedCount}`,
            );
          }

          // Update job progress
          await this.updateJobProgress(
            jobId,
            progress,
            processedCount,
            successCount,
            failedCount,
          );

          // Report progress to caller
          if (onProgress) {
            onProgress(progress);
          }
        } catch (error) {
          console.error("Error processing transaction:", error);
          failedCount++;

          // Store as rejected transaction
          await this.storeRejectedTransaction(
            transaction,
            `Processing error: ${(error as Error).message}`,
            jobId,
          );
        }
      }

      // Update job status to completed
      await this.updateJobCompleted(jobId);
    } catch (error) {
      console.error("Import processing error:", error);

      // Update job status to failed
      await this.updateJobFailed(jobId, (error as Error).message);

      // Re-throw the error
      throw error;
    }
  }

  // Store a valid transaction
  private async storeValidTransaction(
    transaction: RawTransaction,
    jobId: string,
  ): Promise<void> {
    // Determine card type based on first digit
    const cardType = this.validator.getCardType(transaction.cardNumber);

    // Get the last 4 digits of the card number
    const cardLastFour = this.validator.getCardLastFour(transaction.cardNumber);

    // Parse the timestamp
    const timestamp = new Date(transaction.timestamp);

    // Store the transaction
    await this.prisma.transaction.create({
      data: {
        cardLastFour,
        cardType,
        timestamp,
        amount: transaction.amount,
        fileSource: jobId, // Using jobId as fileSource for simplicity
        importJobId: jobId,
      },
    });
  }

  // Store a rejected transaction
  private async storeRejectedTransaction(
    transaction: RawTransaction,
    reason: string,
    jobId: string,
  ): Promise<void> {
    // Encrypt the transaction data
    const rawData = JSON.stringify(transaction);
    const { encryptedData, iv, authTag } = this.cryptoService.encrypt(rawData);

    await this.prisma.rejectedTransaction.create({
      data: {
        fileSource: jobId, // Using jobId as fileSource for simplicity
        encryptedData,
        iv,
        authTag,
        rejectionReason: reason,
        importJobId: jobId,
      },
    });
  }

  // Update job status
  private async updateJobStatus(
    jobId: string,
    status: ImportJobStatus,
  ): Promise<void> {
    await this.prisma.importJob.update({
      where: { id: jobId },
      data: { status },
    });
  }

  // Update job progress
  private async updateJobProgress(
    jobId: string,
    progress: number,
    processedRecords: number,
    successfulRecords: number,
    failedRecords: number,
  ): Promise<void> {
    await this.prisma.importJob.update({
      where: { id: jobId },
      data: {
        progress,
        processedRecords,
        successfulRecords,
        failedRecords,
      },
    });
  }

  // Update job as completed
  private async updateJobCompleted(jobId: string): Promise<void> {
    await this.prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: ImportJobStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Log job completion with stats
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId },
    });

    if (job) {
      console.log(
        `Job ${jobId} completed. Stats: Total: ${job.totalRecords}, Processed: ${job.processedRecords}, Success: ${job.successfulRecords}, Failed: ${job.failedRecords}`,
      );
    }
  }

  // Update job as failed
  private async updateJobFailed(jobId: string, error: string): Promise<void> {
    await this.prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: ImportJobStatus.FAILED,
        error,
        completedAt: new Date(),
      },
    });
  }

  // Get import job status
  async getImportJobStatus(jobId: string) {
    return this.prisma.importJob.findUnique({
      where: { id: jobId },
    });
  }

  // Get all import jobs
  async getAllImportJobs() {
    return this.prisma.importJob.findMany({
      orderBy: { startedAt: "desc" },
    });
  }

  // Get rejected transactions for a job
  async getRejectedTransactions(jobId: string) {
    const rejectedTransactions = await this.prisma.rejectedTransaction.findMany(
      {
        where: { importJobId: jobId },
      },
    );

    // Return the transactions without decrypting them
    return rejectedTransactions;
  }

  // Decrypt a rejected transaction's data (only when needed)
  decryptRejectedTransactionData(
    encryptedData: string,
    iv: string,
    authTag: string,
  ): RawTransaction {
    try {
      const decryptedData = this.cryptoService.decrypt(
        encryptedData,
        iv,
        authTag,
      );
      return JSON.parse(decryptedData) as RawTransaction;
    } catch (error) {
      console.error("Error decrypting rejected transaction data:", error);
      throw new Error("Failed to decrypt transaction data");
    }
  }
}
