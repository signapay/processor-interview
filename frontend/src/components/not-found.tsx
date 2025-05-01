import React from "react";
import { Link, NotFoundRouteProps } from "@tanstack/react-router";

function NotFound(_props: Readonly<NotFoundRouteProps>) {
  return (
    <div className="flex size-full items-center justify-center p-2 text-2xl">
      <div className="flex flex-col items-center gap-4">
        <p className="text-4xl font-bold">404</p>
        <p className="text-lg">Page not found</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
