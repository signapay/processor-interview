import { describe, expect, it } from 'bun:test'
import { parseJson } from "../json";

describe("parseJson", () => {
  it("should parse valid JSON content", () => {
    const jsonContent = '{"key": "value"}';
    const result = parseJson(jsonContent);
    expect(result).toEqual({ key: "value" });
  });

  it("should throw an error for invalid JSON content", () => {
    const invalidJsonContent = '{key: value}';
    expect(() => parseJson(invalidJsonContent)).toThrow(SyntaxError);
  });
});