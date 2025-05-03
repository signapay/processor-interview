import { describe, expect, it } from "bun:test";
import { parseCsv } from "../csv";

describe("parseCsv", () => {
  it("should parse valid CSV content", async () => {
    const csvContent = "key,value\nkey1,value1\nkey2,value2";
    const transformRow = (row: any) => row;
    const result = await parseCsv(csvContent, transformRow);
    expect(result).toEqual([
      { key: "key1", value: "value1" },
      { key: "key2", value: "value2" },
    ]);
  });

  it("should apply a transform function to each row", async () => {
    const csvContent = "key,value\nkey1,value1\nkey2,value2";
    const transformRow = (row: any) => ({ ...row, transformed: true });
    const result = await parseCsv(csvContent, transformRow);
    expect(result).toEqual([
      { key: "key1", value: "value1", transformed: true },
      { key: "key2", value: "value2", transformed: true },
    ]);
  });
});
