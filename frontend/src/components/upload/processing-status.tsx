import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface File {
  id: string;
  name: string;
  status: string;
  progress: number;
  transactionCount?: number;
}

interface ProcessingStatusProps {
  files: File[];
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ files }) => {
  const totalFiles = files.length;
  const completedFiles = files.filter(
    (file) => file.status === "completed",
  ).length;
  const failedFiles = files.filter((file) => file.status === "failed").length;
  const processingFiles = files.filter(
    (file) => file.status === "uploading" || file.status === "processing",
  ).length;

  const totalTransactions = files.reduce((total, file) => {
    return total + (file.transactionCount || 0);
  }, 0);

  const completionPercentage = Math.round((completedFiles / totalFiles) * 100);

  return (
    <div className="card bg-base-100 shadow-lg mt-8">
      <div className="card-body">
        <h3 className="card-title">Processing Summary</h3>

        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Clock size={24} />
            </div>
            <div className="stat-title">Files</div>
            <div className="stat-value">{totalFiles}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">{completedFiles}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <Clock size={24} />
            </div>
            <div className="stat-title">Processing</div>
            <div className="stat-value text-warning">{processingFiles}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-error">
              <XCircle size={24} />
            </div>
            <div className="stat-title">Failed</div>
            <div className="stat-value text-error">{failedFiles}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Processing progress</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={completionPercentage}
            max="100"
          />
        </div>

        {totalTransactions > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-success">
              Successfully processed {totalTransactions} transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatus;
