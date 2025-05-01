import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { LucideAlertTriangle } from "lucide-react";
import React, { useEffect, useState } from "react";

function ErrorComponent({ error }: any) {
  const router = useRouter();
  const queryClientErrorBoundary = useQueryErrorResetBoundary();
  const isDev = process.env.NODE_ENV !== "production";
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    queryClientErrorBoundary.reset();
  }, [queryClientErrorBoundary]);

  return (
    <div className="mt-8 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div role="alert" className="alert alert-error alert-outline">
          <LucideAlertTriangle className="size-4" />
          <div>
            <h3 className="font-bold">Oops! Something went wrong</h3>
            <div className="text-xs">
              We're sorry, but we encountered an unexpected error.
            </div>
          </div>
        </div>
        <div className="mt-4 space-x-2">
          <button
            className="btn btn-primary"
            onClick={() => router.invalidate()}
          >
            Try again
          </button>
          <Link to="/" className="btn btn-primary btn-outline">
            Return to homepage
          </Link>
        </div>
        {isDev ? (
          <div
            className={`collapse collapse-arrow bg-base-100 border border-base-300 ${collapse ? "collapse-close" : "collapse-open"}`}
          >
            <div
              className="collapse-title font-semibold"
              onClick={() => setCollapse(!collapse)}
            >
              View error details
            </div>
            <div className="collapse-content text-sm">
              <div>
                <h3 className="mb-2 font-semibold">Error Message:</h3>
                <p className="mb-4 text-sm">{error.message}</p>
                <h3 className="mb-2 font-semibold">Stack Trace:</h3>
                <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs">
                  <code>{error.stack}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ErrorComponent;
