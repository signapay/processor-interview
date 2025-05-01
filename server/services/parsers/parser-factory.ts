import { BaseParser, type ParserOptions } from "./base-parser";
import { CsvParser } from "./csv-parser";
import { JsonParser } from "./json-parser";
import { XmlParser } from "./xml-parser";

export class ParserFactory {
  private readonly parsers: BaseParser[];

  constructor(options: ParserOptions = {}) {
    // Initialize all available parsers
    this.parsers = [
      new CsvParser(options),
      new JsonParser(options),
      new XmlParser(options),
    ];
  }

  // Get the appropriate parser for the given file type
  getParser(fileType: string): BaseParser | null {
    for (const parser of this.parsers) {
      if (parser.canParse(fileType)) {
        return parser;
      }
    }
    return null;
  }
}
