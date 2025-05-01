import type { ErrorResponse } from "@/shared/types";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

type ErrorHandler =
  | Error
  | {
      getResponse: () => Response;
      name: string;
      message: string;
      stack?: string;
      cause: unknown;
    };

export const onErrorMiddleware = async (err: ErrorHandler, c: Context) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause == "object" && "form" in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status,
      );

    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : (err.stack ?? err.message),
    },
    500,
  );
};
