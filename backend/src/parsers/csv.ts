import { parseString } from "@fast-csv/parse";

export async function parseCsv<T>(
  content: string,
  transformRow: (row: any) => T,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const rows: T[] = [];
    parseString(content, { headers: true })
      .on("data", (row) => rows.push(transformRow(row)))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });
}
