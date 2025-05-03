import { describe, expect, it } from 'bun:test'
import { parseXml } from "../xml";

describe("parseXml", () => {
  it("should parse valid XML content", () => {
    const xmlContent = `<root><item>value</item></root>`;
    const result = parseXml(xmlContent);
    expect(result).toEqual({ root: { item: "value" } });
  });

  it("should apply a transform function if provided", () => {
    const xmlContent = `<root><item>value</item></root>`;
    const transform = (data: any) => ({ ...data, transformed: true });
    const result = parseXml(xmlContent, transform);
    expect(result).toEqual({ root: { item: "value" }, transformed: true });
  });
});