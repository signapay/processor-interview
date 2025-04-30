import { Link } from "@tanstack/react-router";
import React from "react";

function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Processor Interview</a>
      </div>
      <div role="tablist" className="tabs tabs-border">
        <Link
          role="tab"
          to="/transactions"
          className="tab"
          activeProps={{ className: "tab-active" }}
          activeOptions={{ exact: true }}
        >
          Transactions
        </Link>
        <Link
          role="tab"
          to="/transactions/import"
          className="tab"
          activeProps={{ className: "tab-active" }}
          activeOptions={{ exact: true }}
        >
          Import
        </Link>
        <Link
          role="tab"
          to="/transactions/report"
          className="tab"
          activeProps={{ className: "tab-active" }}
          activeOptions={{ exact: true }}
        >
          Report
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
