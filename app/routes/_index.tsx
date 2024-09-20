import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useFetcher } from "@remix-run/react";
import { Accounts } from "../components/Accounts";
import { Collections } from "../components/Collections";
import { BadTransactions } from "../components/Void";
import { Tabs } from "../components/Tabs";
import { Tab, ReportData } from "../../types/types";

export const loader = async () => {
  const response = await fetch("http://localhost:4000/report");
  const reportData = await response.json();
  return json(reportData);
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  const uploadResponse = await fetch("http://localhost:4000/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("File upload failed.");
  }

  const reportResponse = await fetch("http://localhost:4000/report");
  const updatedReportData = await reportResponse.json();

  return updatedReportData;
};

export default function UploadPage() {
  let report = useLoaderData<ReportData | null>();
  const updatedReport = useActionData<ReportData | null>();

  const reportData = updatedReport || report;
  const [activeTab, setActiveTab] = useState<Tab>("accounts");
  const [loading, setLoading] = useState(false);

  const fetcher = useFetcher(); // For handling reset without reloading the page

  useEffect(() => {
    if (updatedReport && updatedReport !== null) {
      setLoading(false);
    }
  }, [updatedReport]);

  const handleReset = async () => {
    fetcher.submit(null, { method: "post", action: "/reset" }); // Trigger reset
    report = null;
  };

  const handleFileChange = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
  };

  const tabContentMap: { [key in Tab]: JSX.Element } = {
    accounts: <Accounts accounts={reportData?.accounts || []} />,
    collections: <Collections collections={reportData?.collections || []} />,
    badTransactions: <BadTransactions badTransactions={reportData?.badTransactions || []} />,
  };

  return (
    <div className="container-fluid process-container">
      <div className="row">
        <div className="col-md-3 col-lg-2 bg-light">
          <h4 className="p-3">Navigation</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "accounts" ? "active" : ""}`} onClick={() => setActiveTab("accounts")}>
                Accounts
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "collections" ? "active" : ""}`} onClick={() => setActiveTab("collections")}>
                Collections
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "badTransactions" ? "active" : ""}`} onClick={() => setActiveTab("badTransactions")}>
                Bad Transactions
              </button>
            </li>
            <li className="nav-item mt-5">
              <button onClick={handleReset} className="btn btn-danger mt-3" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "Resetting..." : "Reset System"}
              </button>
            </li>
          </ul>
        </div>

        <div className="col-md-9 col-lg-10 righ-window">
          <h1 className="mt-3">Upload Transactions</h1>

          <Form method="post" encType="multipart/form-data" onSubmit={handleFileChange}>
            <div className="form-group mb-3">
              <input type="file" name="file" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">
              {loading ? "Processing..." : "Upload"}
            </button>
          </Form>

          {loading && <p>Uploading and processing file...</p>}

          {reportData && (
            <div className="mt-4 mb-5 px-4">
              {/* <Tabs activeTab={activeTab} onTabChange={setActiveTab} /> */}
              <div className="tab-content mt-3">{tabContentMap[activeTab]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
