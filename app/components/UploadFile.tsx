// import { useState } from "react";
// import { Accounts } from "./Accounts";
// import { Collections } from "./Collections";
// import { BadTransactions } from "./Void";
// import { Tabs } from "./Tabs";
// import { json } from "@remix-run/node";
// import { LoaderFunction, ActionFunction } from "@remix-run/node";
// import { useLoaderData, Form, useActionData, useFetcher } from "@remix-run/react";
// import { Tab, ReportData, TabsProps } from "types/types";

// // Loader function to fetch the report data when the page loads
// export const loader: LoaderFunction = async () => {
//   const response = await fetch("http://localhost:4000/report");
//   const reportData = await response.json();
//   return json(reportData);
// };

// // Action function to handle the file upload and data processing
// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const file = formData.get("file") as File;

//   const uploadResponse = await fetch("http://localhost:4000/upload", {
//     method: "POST",
//     body: file,
//   });

//   if (!uploadResponse.ok) {
//     throw new Error("File upload failed.");
//   }

//   const reportResponse = await fetch("http://localhost:4000/report");
//   const updatedReportData = await reportResponse.json();

//   return json(updatedReportData);
// };

// export default function UploadPage() {
//   const report = useLoaderData<ReportData>(); // Properly type the loader data
//   const updatedReport = useActionData<ReportData>(); // Properly type the action data

//   const fetcher = useFetcher();

//   const handleReset = async () => {
//     fetcher.submit(null, { method: "post", action: "/reset" }); // Trigger reset
//   };

//   const reportData = updatedReport || report; // Use updated report if available, otherwise use loader data
//   const [activeTab, setActiveTab] = useState<Tab>("accounts"); // Properly typed as `Tab`

//   // Define the tab content map with type-safe keys
// //   const tabContentMap: { [key in Tab]: JSX.Element } = {
// //     accounts: <Accounts accounts={reportData.accounts || []} />, // Access accounts safely
// //     collections: <Collections collections={reportData.collections || []} />, // Access collections safely
// //     badTransactions: <BadTransactions badTransactions={reportData.badTransactions || []} />, // Access badTransactions safely
// //   };

//   return (
//     <div>
//       <h1>Upload Transactions</h1>
//       <Form method="post" encType="multipart/form-data">
//         <input type="file" name="file" />
//         <button type="submit">Upload</button>
//         <button onClick={handleReset}>Reset System</button>
//       </Form>

//       {reportData && (
//         <div>
//           <Tabs activeTab={activeTab} onTabChange={setActiveTab as TabsProps["onTabChange"]} />
//           <div className="tab-content">
//             {tabContentMap[activeTab]} {/* Dynamically render content based on activeTab */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
