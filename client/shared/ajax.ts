import { AppError, type AppResponseError } from 'server/shared/exception';
import { unexpectedErrorMessage } from './const';

export function ajax<T, D = T>(input: string, params: RequestParameters<D> = {}): Promise<T> {
  const { data, ...rest } = params;

  const init = {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'get',
    ...rest,
    ...(data ? { body: JSON.stringify(data) } : {}),
  } satisfies RequestInit;

  return fetch(input, init).then(async (res) => {
    const data = await res.json();
    if (res.status >= 400) {
      const resError = data as AppResponseError;
      throw new AppError(resError.error ?? unexpectedErrorMessage, resError.status ?? res.status);
    }
    return data;
  });
}

export type RequestParameters<D> = {
  data?: D;
} & Omit<RequestInit, 'body'>;
