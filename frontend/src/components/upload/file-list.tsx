import React from "react";
import { File, X, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: "uploading" | "processing" | "completed" | "failed";
  progress: number;
  transactionCount?: number;
}

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Clock className="text-primary w-4 h-4" />;
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
                        • {file.transactionCount} transactions
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
