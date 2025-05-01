import FileList from "@/components/upload/file-list";
import FileUploader from "@/components/upload/file-uploader";
import ProcessingStatus from "@/components/upload/processing-status";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Upload as UploadIcon,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/_transactions/transactions/import")({
  component: ImportComponent,
});

const FILE_STATUS = {
  UPLOADING: "uploading",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: (typeof FILE_STATUS)[keyof typeof FILE_STATUS];
  progress: number;
  transactionCount?: number;
}

function ImportComponent() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const navigate = useNavigate();

  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles = uploadedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: FILE_STATUS.UPLOADING,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // TODO: Implement file upload
  };

  const removeFile = (id: string) => {
    // TODO: Remove uploaded file
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

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

          <FileUploader onFileUpload={handleFileUpload} />
          <FileList files={files} onRemoveFile={removeFile} />

          {files.some(
            (file) =>
              file.status === FILE_STATUS.PROCESSING ||
              file.status === FILE_STATUS.COMPLETED,
          ) && <ProcessingStatus files={files} />}

          {files.length > 0 &&
            files.some((file) => file.status === FILE_STATUS.COMPLETED) && (
              <div className="card bg-base-100 shadow-lg">
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

                  <div className="stats stats-vertical lg:stats-horizontal shadow">
                    <div className="stat">
                      <div className="stat-figure text-success">
                        <CheckCircle size={24} />
                      </div>
                      <div className="stat-title">Successful</div>
                      <div className="stat-value text-success">
                        {files.reduce(
                          (total, file) =>
                            total +
                            (file.status === "completed"
                              ? file.transactionCount || 0
                              : 0),
                          0,
                        )}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-figure text-error">
                        <XCircle size={24} />
                      </div>
                      <div className="stat-title">Failed</div>
                      <div className="stat-value text-error">
                        {files.filter((f) => f.status === "failed").length}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-figure text-error">
                        <AlertCircle size={24} />
                      </div>
                      <div className="stat-title">Failed</div>
                      <div className="stat-value text-error">
                        {files.filter((f) => f.status === "failed").length}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <UploadIcon size={24} />
                      </div>
                      <div className="stat-title">Success Rate</div>
                      <div className="stat-value">
                        {Math.round(
                          (files.filter((f) => f.status === "completed")
                            .length /
                            files.length) *
                            100,
                        )}
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
