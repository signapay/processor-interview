import { Readable } from "stream";

import type { RawTransaction } from "@/shared/import-types";

export interface ParserOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

export abstract class BaseParser {
  protected options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.options = options;
  }

  abstract parse(stream: Readable): Promise<RawTransaction[]>;

  // Helper method to determine if a file type is supported by this parser
  abstract canParse(fileType: string): boolean;

  // Report progress to the caller
  protected reportProgress(progress: number): void {
    if (this.options.onProgress) {
      this.options.onProgress(progress);
    }
  }

  // Report errors to the caller
  protected reportError(error: Error): void {
    if (this.options.onError) {
      this.options.onError(error);
    }
  }
}
