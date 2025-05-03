import { apiUrl, apiToken } from "@/utils/env";

export const fetchApi = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${apiToken}`,
  };

  return fetch(`${apiUrl}${url}`, { ...options, headers });
};
