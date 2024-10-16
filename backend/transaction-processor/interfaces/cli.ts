import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import Processor from "../features";
import Helpers from "../helpers";
import { ZodError } from "zod";
import { Transaction } from "../types/transaction";

const readTransactions = async (filePath: string): Promise<Transaction[] | undefined> => {
  try {
    return await Processor.readTransactionsFromCsvFile(filePath);
  } catch (error) {
    Helpers.ErrorHelper.handle(error);
    return undefined;
  }
};

const validateTransactions = (transactions: Transaction[]): Transaction[] => {
  const validTransactions: Transaction[] = [];
  transactions.forEach((transaction, index) => {
    try {
      const validatedTransaction = Helpers.ValidationHelper.transactionsSchema([transaction])[0];
      validTransactions.push(validatedTransaction);
    } catch (error) {
      if (error instanceof ZodError) {
        Helpers.ErrorHelper.handle(error, [transaction]);
      }
    }
  });
  return validTransactions;
};

const processValidTransactions = (validatedTransactions: Transaction[]): string | undefined => {
  try {
    const processedTransactions = Processor.processTransactions(validatedTransactions);
    return Processor.generateReport(processedTransactions);
  } catch (error) {
    Helpers.ErrorHelper.handle(error);
    return undefined;
  }
};

const handleProcessCommand = async (filePath: string): Promise<string | undefined> => {
  if (!(await Helpers.FileHelper.checkFileExist(filePath))) {
    console.error(`Error: File not found: ${filePath}`);
    return;
  }

  const transactions = await readTransactions(filePath);
  if (!transactions) return;

  const validatedTransactions = validateTransactions(transactions);
  if (validatedTransactions.length === 0) {
    console.error("No valid transactions found. Exiting.");
    return;
  }

  console.log(`Processing ${validatedTransactions.length} out of ${transactions.length} transactions.`);
  return processValidTransactions(validatedTransactions);
};

const runCLI = async (): Promise<void> => {
  await yargs(hideBin(process.argv))
    .command(
      "process <file>",
      "Process transactions from a file",
      (yargs) => {
        return yargs.positional("file", {
          describe: "Path to the transaction file",
          type: "string",
        });
      },
      async (argv) => {
        const report = await handleProcessCommand(`${argv.file}`);
        if (!report) {
          console.error("No report generated. Exiting.");
          process.exit(1);
        }
        console.log(report);
      }
    )
    .parseAsync();
};

export default {
  run: runCLI,
}
