export const statusCode = Object.freeze({
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  gone: 410,
  lostUpdate: 428,
  badCredentials: 457,
  serverError: 500,
});

export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
    cause?: unknown
  ) {
    super(message, { cause });

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    /*
     * This clips the constructor invocation from the stack trace.
     * It's not absolutely essential, but it does make the stack trace a little nicer.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AppNotFoundError extends AppError {
  constructor(message: string) {
    super(message, statusCode.notFound);
  }
}

export class AppBadRequestError extends AppError {
  constructor(message: string) {
    super(message, statusCode.badRequest);
  }
}

export type AppResponseError = { error: string; status: number };
