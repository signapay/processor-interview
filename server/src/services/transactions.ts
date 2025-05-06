import { XMLParser } from "fast-xml-parser";
import {
  NewRejectedTransaction,
  NewTransaction,
  cardTypeEnum,
  db,
  rejectedTransactions,
  transactions,
} from "../db";

function getCardTypeFromNumber(
  cardNumber: string,
): (typeof cardTypeEnum.enumValues)[number] | null {
  const firstDigit = cardNumber.charAt(0);
  switch (firstDigit) {
    case "4":
      return "Visa";
    case "5":
      return "Mastercard";
    case "3":
      return "Amex";
    case "6":
      return "Discover";
    default:
      return null;
  }
}

function isValid(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\D/g, "");
  if (!sanitized || sanitized.length < 10 || sanitized.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (isNaN(digit)) return false;

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function createTransaction(
  rawCardNumber: string,
  rawTimestamp: string,
  rawAmount: string,
): NewTransaction | null {
  const cardType = getCardTypeFromNumber(rawCardNumber);

  if (!cardType || !isValid(rawCardNumber)) {
    return null;
  }

  const timestamp = new Date(rawTimestamp);
  const amountValue = parseFloat(rawAmount);
  const amount = amountValue.toFixed(2);

  return {
    cardNumber: rawCardNumber,
    cardType: cardType,
    timestamp,
    amount,
  };
}

async function saveTransactionBatch(
  transactionBatch: NewTransaction[],
): Promise<void> {
  try {
    await db
      .insert(transactions)
      .values(transactionBatch)
      .onConflictDoNothing({
        target: [
          transactions.cardNumber,
          transactions.timestamp,
          transactions.amount,
        ],
      });
  } catch (error) {
    console.error(`Error trying to persist batch of transactions: ${error}`);
  }
}

async function saveRejectedTransactionsBatch(
  rejectedTransactionBatch: NewRejectedTransaction[],
): Promise<void> {
  try {
    await db
      .insert(rejectedTransactions)
      .values(rejectedTransactionBatch)
      .onConflictDoNothing({
        target: [
          transactions.cardNumber,
          transactions.timestamp,
          transactions.amount,
        ],
      });
  } catch (error) {
    console.error(
      `Error trying to persist batch of rejected transactions: ${error}`,
    );
  }
}

async function processCsvStream(
  stream: ReadableStream<Uint8Array<ArrayBufferLike>>,
): Promise<void> {
  let isFirstLine = true;
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      const transactions = [];
      const rejectedTransactions = [];
      if (done) {
        const decodedValue = decoder.decode(value, { stream: true });
        if (decodedValue) console.log(`Last chunk: ${decodedValue}`);
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });

      const lines = decodedChunk.split("\n");

      for (const line of lines) {
        if (!line.trim() || isFirstLine) {
          isFirstLine = false;
          continue;
        }

        const [rawCardNumber, rawTimestamp, rawAmount] = line.split(",");
        const transactionData = createTransaction(
          rawCardNumber,
          rawTimestamp,
          rawAmount,
        );

        if (transactionData) transactions.push(transactionData);
        else
          rejectedTransactions.push({
            cardNumber: rawCardNumber,
            timestamp: rawTimestamp,
            amount: rawAmount,
          });
      }

      if (transactions.length > 0) await saveTransactionBatch(transactions);

      if (rejectedTransactions.length > 0)
        await saveRejectedTransactionsBatch(rejectedTransactions);
    }
  } catch (error) {
    throw new Error(`Error trying to parse the csv file: ${error}`);
  }
}

async function processJsonContent(content: string): Promise<void> {
  try {
    const parsedData = JSON.parse(content);

    if (!Array.isArray(parsedData)) {
      throw new Error("JSON content is not an array");
    }

    const transactions = [];
    const rejectedTransactions = [];

    for (const item of parsedData) {
      const { cardNumber, timestamp, amount } = item;
      const transactionData = createTransaction(cardNumber, timestamp, amount);
      if (transactionData) transactions.push(transactionData);
      else
        rejectedTransactions.push({
          cardNumber,
          timestamp,
          amount,
        });
    }

    if (transactions.length > 0) await saveTransactionBatch(transactions);
    if (rejectedTransactions.length > 0)
      await saveRejectedTransactionsBatch(rejectedTransactions);
  } catch (error) {
    throw new Error(`Error trying to parse the json file: ${error}`);
  }
}

async function processXmlContent(content: string): Promise<void> {
  const xmlParser = new XMLParser();
  try {
    const parsed = xmlParser.parse(content);

    const transactions = [];
    const rejectedTransactions = [];

    for (const item of parsed.transactions.transaction) {
      const { cardNumber, timestamp, amount } = item;
      const transactionData = createTransaction(
        cardNumber.toString(),
        timestamp,
        amount,
      );
      if (transactionData) transactions.push(transactionData);
      else
        rejectedTransactions.push({
          cardNumber: cardNumber.toString(),
          timestamp: timestamp.toString(),
          amount: amount.toString(),
        });
    }

    if (transactions.length > 0) await saveTransactionBatch(transactions);
    if (rejectedTransactions.length > 0)
      await saveRejectedTransactionsBatch(rejectedTransactions);
  } catch (error) {
    throw new Error(`Error trying to parse the XML file: ${error}`);
  }
}

export async function processTransactionFile(
  file: File,
): Promise<{ message: string }> {
  const startTime = Date.now();
  try {
    switch (file.type) {
      case "text/csv":
        await processCsvStream(file.stream());
        break;
      case "application/json":
      case "application/json;charset=utf-8":
        await processJsonContent(await file.text());
        break;
      case "application/xml":
      case "text/xml":
        await processXmlContent(await file.text());
        break;
      default:
        throw new Error(`File type not supported: ${file.type}`);
    }

    console.info(
      `File ${file.name} processed with success in ${Date.now() - startTime}ms.`,
    );
    return { message: `File ${file.name} processed with success.` };
  } catch (error) {
    throw new Error(`${file.name}: ${error}`);
  }
}
