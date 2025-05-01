import { useCallback, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  AlertCircle,
  CheckCircle,
  Upload as UploadIcon,
  XCircle,
} from "lucide-react";

import FileList, { UploadedFile } from "@/components/upload/file-list";
import FileUploader from "@/components/upload/file-uploader";
import ProcessingStatus from "@/components/upload/processing-status";

export const Route = createFileRoute(
  "/_authenticated/_transactions/transactions/import",
)({
  component: ImportComponent,
});

const FILE_STATUS = {
  UPLOADING: "uploading",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

function ImportComponent() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const navigate = useNavigate();

  // Handle file upload and track job IDs
  const handleFileUpload = useCallback(
    (uploadedFiles: File[], jobIds: string[]) => {
      const newFiles = uploadedFiles.map((file, index) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: FILE_STATUS.UPLOADING,
        progress: 0,
        jobId: jobIds[index], // Store the job ID for status polling
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [],
  );

  // Update file status and progress
  const updateFile = useCallback(
    (id: string, updates: Partial<UploadedFile>) => {
      setFiles((prev) =>
        prev.map((file) => (file.id === id ? { ...file, ...updates } : file)),
      );
    },
    [],
  );

  // Remove a file from the list
  const removeFile = useCallback((id: string) => {
    // Only allow removing files that are not being processed
    setFiles((prev) => {
      const fileToRemove = prev.find((file) => file.id === id);
      if (
        fileToRemove &&
        (fileToRemove.status === FILE_STATUS.COMPLETED ||
          fileToRemove.status === FILE_STATUS.FAILED)
      ) {
        return prev.filter((file) => file.id !== id);
      }
      return prev;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Import Transactions</h1>
      </div>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Import Files</h2>
          <p className="text-base-content text-opacity-60">
            Upload transaction files to process. Supported formats: CSV, XML,
            JSON.
          </p>

          <FileUploader
            onFileUpload={handleFileUpload}
            disabled={files.some(
              (f) =>
                f.status === FILE_STATUS.UPLOADING ||
                f.status === FILE_STATUS.PROCESSING,
            )}
          />
          <FileList
            files={files}
            onRemoveFile={removeFile}
            onUpdateFile={updateFile}
          />

          {files.some(
            (file) =>
              file.status === FILE_STATUS.PROCESSING ||
              file.status === FILE_STATUS.COMPLETED,
          ) && <ProcessingStatus files={files} />}

          {files.length > 0 &&
            files.some((file) => file.status === FILE_STATUS.COMPLETED) && (
              <div className="card bg-base-100 shadow-lg mt-6">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title">Processing Results</h2>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate({ to: "/transactions" })}
                    >
                      View Transactions
                    </button>
                  </div>

                  <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <UploadIcon size={24} />
                      </div>
                      <div className="stat-title">Files Processed</div>
                      <div className="stat-value">
                        {files.filter((f) => f.status === "completed").length}
                      </div>
                      <div className="stat-desc">
                        Out of {files.length} total files
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-warning">
                        <AlertCircle size={24} />
                      </div>
                      <div className="stat-title">Processing</div>
                      <div className="stat-value text-warning">
                        {
                          files.filter(
                            (f) =>
                              f.status === "uploading" ||
                              f.status === "processing",
                          ).length
                        }
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-error">
                        <XCircle size={24} />
                      </div>
                      <div className="stat-title">Failed Files</div>
                      <div className="stat-value text-error">
                        {files.filter((f) => f.status === "failed").length}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mb-2">
                    Transaction Summary
                  </h3>
                  <div className="stats stats-vertical lg:stats-horizontal shadow">
                    <div className="stat">
                      <div className="stat-figure text-success">
                        <CheckCircle size={24} />
                      </div>
                      <div className="stat-title">Successful Transactions</div>
                      <div className="stat-value text-success">
                        {files.reduce(
                          (total, file) =>
                            total +
                            (file.status === "completed"
                              ? (file.transactionCount ?? 0)
                              : 0),
                          0,
                        )}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-error">
                        <XCircle size={24} />
                      </div>
                      <div className="stat-title">Rejected Transactions</div>
                      <div className="stat-value text-error">
                        {files.reduce(
                          (total, file) => total + (file.rejectedCount ?? 0),
                          0,
                        )}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <UploadIcon size={24} />
                      </div>
                      <div className="stat-title">Success Rate</div>
                      <div className="stat-value">
                        {(() => {
                          // Calculate total successful transactions
                          const successfulTransactions = files.reduce(
                            (total, file) =>
                              total +
                              (file.status === "completed"
                                ? (file.transactionCount ?? 0)
                                : 0),
                            0,
                          );

                          // Calculate total rejected transactions
                          const rejectedTransactions = files.reduce(
                            (total, file) => total + (file.rejectedCount ?? 0),
                            0,
                          );

                          // Calculate success rate
                          const total =
                            successfulTransactions + rejectedTransactions;
                          return total > 0
                            ? Math.round((successfulTransactions / total) * 100)
                            : 0;
                        })()}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
