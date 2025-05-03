export function parseJson<T>(content: string): T {
  return JSON.parse(content);
}
