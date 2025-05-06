export type Primitive = boolean | string | number | bigint;

export type EnvMode = 'development' | 'production';

export const apiCodes = Object.freeze({
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  gone: 410,
  lostUpdate: 428,
  badCredentials: 457,
  internal: 500,
});

export const defaultHome = '/transactions';

export const appName = 'Signapay';
