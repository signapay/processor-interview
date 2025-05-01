import React, { useEffect } from "react";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  File,
  Loader2,
  X,
} from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: "uploading" | "processing" | "completed" | "failed";
  progress: number;
  transactionCount?: number;
  rejectedCount?: number;
  totalRecords?: number;
  jobId?: string; // Import job ID from the server
}

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
  onUpdateFile?: (id: string, updates: Partial<UploadedFile>) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onRemoveFile,
  onUpdateFile,
}) => {
  // Poll for job status updates
  useEffect(() => {
    // Only poll for files that have a jobId and are in uploading or processing status
    const filesToPoll = files.filter(
      (file) =>
        file.jobId &&
        (file.status === "uploading" || file.status === "processing"),
    );

    if (filesToPoll.length === 0) return;

    // Set up polling interval
    const intervalId = setInterval(async () => {
      for (const file of filesToPoll) {
        if (!file.jobId) continue;

        try {
          // Fetch job status from the server
          const response = await fetch(
            `/api/v1/transactions/import/jobs/${file.jobId}`,
          );
          const result = await response.json();

          if (result.success && result.data) {
            const jobData = result.data;

            // Map server status to our status
            let status: "uploading" | "processing" | "completed" | "failed";
            switch (jobData.status) {
              case "pending":
              case "uploading":
                status = "uploading";
                break;
              case "processing":
                status = "processing";
                break;
              case "completed":
                status = "completed";
                break;
              case "failed":
                status = "failed";
                break;
              default:
                status = "uploading";
            }

            // Always update file status to ensure we have the latest data
            onUpdateFile?.(file.id, {
              status,
              progress: jobData.progress,
              transactionCount: jobData.successfulRecords,
              rejectedCount: jobData.failedRecords,
              totalRecords: jobData.totalRecords,
            });
          }
        } catch (error) {
          console.error("Error polling job status:", error);
        }
      }
    }, 2000); // Poll every 2 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [files, onUpdateFile]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="text-primary w-4 h-4 animate-spin" />;
      case "processing":
        return <Clock className="text-warning w-4 h-4" />;
      case "completed":
        return <CheckCircle className="text-success w-4 h-4" />;
      case "failed":
        return <AlertCircle className="text-error w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "uploading":
        return "text-primary";
      case "processing":
        return "text-warning";
      case "completed":
        return "text-success";
      case "failed":
        return "text-error";
      default:
        return "";
    }
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>

      <ul className="list bg-base-100 rounded-box shadow-md">
        {files.map((file) => (
          <li key={file.id} className="list-row">
            <File size={24} className="text-primary" />
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <span className="font-medium">{file.name}</span>
                    {getStatusIcon(file.status)}
                    <span
                      className={`text-xs font-medium italic ${getStatusClass(file.status)}`}
                    >
                      {file.status.charAt(0).toUpperCase() +
                        file.status.slice(1)}
                    </span>
                    {file.transactionCount !== undefined && (
                      <span className="text-sm text-base-content/60">
                        • {file.transactionCount} successful
                        {file.rejectedCount !== undefined &&
                          file.rejectedCount > 0 && (
                            <span className="text-error">
                              {" "}
                              • {file.rejectedCount} rejected
                            </span>
                          )}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-base-content/60">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>

                {file.status === "uploading" && (
                  <progress
                    className="progress progress-primary w-full mt-2"
                    value={file.progress}
                    max="100"
                  />
                )}
              </div>
            </div>
            <button
              onClick={() => onRemoveFile(file.id)}
              className="btn btn-ghost btn-sm text-error"
            >
              <X size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
