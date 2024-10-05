import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transaction Reporter",
  description: "Insight on your transaction files!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-white">
          <nav className="w-64 bg-gray-100 shadow-md">

            <div className="p-4">
              <h1 className="text-2xl font-bold">Transaction Reporter</h1>
            </div>

            <ul>
              <li className="p-2">
                {/* TODO: Icons */}
                <Link
                  href="/"
                  className="flex items-center p-2 hover:bg-blue-100 rounded"
                >Reports</Link>
              </li>
              <li className="p-2">
                <Link
                  href="/file-pool"
                  className="flex items-center p-2 hover:bg-blue-100 rounded"
                >Choose Files</Link>
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