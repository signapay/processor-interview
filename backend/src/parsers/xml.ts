import { XMLParser } from "fast-xml-parser";

export function parseXml<T>(content: string, transform?: (data: T) => T): T {
  const parser = new XMLParser();
  const parsedData = parser.parse(content);
  return transform ? transform(parsedData) : parsedData;
}
