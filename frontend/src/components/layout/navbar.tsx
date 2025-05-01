import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import React from "react";
import Avatar from "../avatar";

function NavBar() {
  const { isPending, data } = useQuery(userQueryOptions);

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">
          Processor Interview
        </Link>
      </div>
      {isPending === false && !data ? (
        <div className="flex-none">
          <a href="/api/v1/auth/login" className="btn btn-primary">
            Login
          </a>
        </div>
      ) : null}
      {isPending === false && data ? (
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
      ) : null}

      {data ? (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="flex flex-col w-10 rounded-full bg-green-100 items-center content-center">
              {/* <img alt={data.given_name} src={data.picture} /> */}
              <span className="uppercase">{`${data.given_name.substr(0, 2)}`}</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow gap-2"
          >
            <li>
              <Link to="/profile" className="btn btn-soft btn-primary">
                Profile {data.given_name}
              </Link>
            </li>
            <li>
              <a href="/api/v1/auth/logout" className="btn btn-soft btn-error">
                Logout
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default NavBar;
