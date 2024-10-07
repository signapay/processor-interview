import "./globals.css";
import type { Metadata } from "next";
import { BarChart, FolderInput } from "lucide-react";
import NavLink from "./components/NavLink";
import TransactionCount from "./components/TransactionCount";

export const metadata: Metadata = {
  title: "Transaction Reporter",
  description: "Process and report on financial transactions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-white">
          <nav className="w-64 bg-gray-100 shadow-md">
            <div className="p-4">
              <h1 className="text-2xl font-bold">Transaction Reporter</h1>
              <TransactionCount />
            </div>
            <ul>
              <li className="p-2">
                <NavLink href="/">
                  <BarChart className="mr-2" size={20} />
                  Reports
                </NavLink>
              </li>
              <li className="p-2">
                <NavLink href="/file-pool">
                  <FolderInput className="mr-2" size={20} />
                  Choose Files
                </NavLink>
              </li>
            </ul>
          </nav>
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}