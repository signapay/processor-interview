import Papa from 'papaparse';
import { Transaction, TransactionData, TransactionType } from '@/app/lib/Transactions/Transaction';

const CSV_COLUMNS = {
  AccountName: 0,
  CardNumber: 1,
  TransactionAmount: 2,
  TransactionType: 3,
  Description: 4,
  TargetCardNumber: 5
};

export interface ParseError {
  row: number;
  message: string;
  input: string;
}

interface PapaParseResult {
  data: string[][];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

export function parseCSVString(csvString: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(csvString, {
      header: false,
      dynamicTyping: false, // Let's treat as strings so no surprises 
      skipEmptyLines: true,
      complete: (results: PapaParseResult) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

// Test for parsed amount string to be a valid number with or without a decimal
function isValidAmount(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value);
}

interface CSVValidationResult {
  isValid: boolean;
  message?: string;
}

function validateCSVInput(row: string[]): CSVValidationResult {

  // We shouldn't have less than 5 columns in the CSV row
  if (row.length < 5) {
    return { isValid: false, message: "Insufficient columns in the CSV row" };
  }

  // Validate Amount
  if (!isValidAmount(row[CSV_COLUMNS.TransactionAmount])) {
    return { isValid: false, message: "Invalid Transaction Amount" };
  }

  // Validate Transaction Type
  const validTypes: TransactionType[] = ['Credit', 'Debit', 'Transfer'];
  if (!validTypes.includes(row[CSV_COLUMNS.TransactionType] as TransactionType)) {
    return { isValid: false, message: "Invalid Transaction Type" };
  }

  // Transfer transactions must include a valid Target Card Number as the very last column
  if (row[CSV_COLUMNS.TransactionType] === 'Transfer' && (row.length < 6 || isNaN(parseInt(row[CSV_COLUMNS.TargetCardNumber])))) {
    return { isValid: false, message: "Transfer Target Card Number missing or invalid" };
  }

  return { isValid: true };
}

interface ParseResult {
  data: Transaction[];
  errors: { lineNumber: number; input: string; message: string }[];
}


// Function to parse out Transaction types from CSV input.
export async function processTransactionsFromCSV(csvString: string): Promise<ParseResult> {
  const result: ParseResult = { data: [], errors: [] };

  try {
    const parsedData = await parseCSVString(csvString);

    parsedData.forEach((row: string[], index) => {
      const validation = validateCSVInput(row);

      // If the row is invalid, log it so we can report on it and carry on
      if (!validation.isValid) {
        result.errors.push({
          lineNumber: index + 1,
          input: row.join(','),
          message: validation.message!
        });
        return;
      }

      const transactionType = row[CSV_COLUMNS.TransactionType] as TransactionType;

      const baseTransactionData = {
        name: row[CSV_COLUMNS.AccountName],
        cardNumber: parseInt(row[CSV_COLUMNS.CardNumber]),
        amount: parseFloat(row[CSV_COLUMNS.TransactionAmount]),
        description: row[CSV_COLUMNS.Description],
      };

      // Deal with different shapes due to the different transaction types

      let transactionData: TransactionData;

      if (transactionType === 'Transfer') {
        transactionData = {
          ...baseTransactionData,
          type: 'Transfer',
          targetCardNumber: parseInt(row[CSV_COLUMNS.TargetCardNumber])
        };
      } else {
        transactionData = {
          ...baseTransactionData,
          type: transactionType,
        };
      }

      result.data.push(new Transaction(transactionData));
    });
  } catch (error) {
    // TODO: Better output here.
    console.error('Error processing CSV:', error);
    throw error;
  }

  return result;
}