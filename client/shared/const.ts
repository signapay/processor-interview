import type { Transaction } from './entity.js';

export * from '../../server/shared/const.js';

export type ResourceFileBody = Transaction & {
  readonly file?: File;
};

export const intervalUpdateUiMillis = 30;

export const intervalSaveSeconds = 15;

export const autocompleteMillis = 700;

export const unexpectedErrorMessage =
  'An unexpected error occurred. Please try again later. If the problem persists, contact support.';
