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

async function saveTransaction(
  rawCardNumber: string,
  rawTimestamp: string,
  rawAmount: string,
) {
  try {
    const cardType = getCardTypeFromNumber(rawCardNumber);

    if (!cardType || !isValid(rawCardNumber)) {
      const newRejectedTransaction: NewRejectedTransaction = {
        cardNumber: rawCardNumber,
        timestamp: rawTimestamp,
        amount: rawAmount,
      };

      await db.insert(rejectedTransactions).values(newRejectedTransaction);
      return;
    }

    const timestamp = new Date(rawTimestamp);
    const amountValue = parseFloat(rawAmount);
    const amount = amountValue.toFixed(2);

    const newTransaction: NewTransaction = {
      cardNumber: rawCardNumber,
      cardType: cardType,
      timestamp,
      amount,
    };

    await db.insert(transactions).values(newTransaction);
  } catch (error) {
    console.error(`Error trying to persist transaction: ${error}`);
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
        await saveTransaction(rawCardNumber, rawTimestamp, rawAmount);
      }
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

    for (const item of parsedData) {
      await saveTransaction(item.cardNumber, item.timestamp, item.amount);
    }
  } catch (error) {
    throw new Error(`Error trying to parse the json file: ${error}`);
  }
}

const xmlParser = new XMLParser();
async function processXmlContent(content: string): Promise<void> {
  try {
    const parsed = xmlParser.parse(content);
    for (const item of parsed.transactions.transaction) {
      await saveTransaction(
        item.cardNumber.toString(),
        item.timestamp,
        item.amount,
      );
    }
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
