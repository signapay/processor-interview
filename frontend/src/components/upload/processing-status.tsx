import React from "react";

import { CheckCircle, Clock, XCircle } from "lucide-react";

import { UploadedFile } from "./file-list";

interface ProcessingStatusProps {
  files: UploadedFile[];
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

  // Calculate transaction statistics
  const totalSuccessfulTransactions = files.reduce((total, file) => {
    return total + (file.transactionCount ?? 0);
  }, 0);

  const totalRejectedTransactions = files.reduce((total, file) => {
    return total + (file.rejectedCount ?? 0);
  }, 0);

  // Calculate overall progress based on individual file progress
  const overallProgress =
    files.reduce((total, file) => {
      return total + file.progress;
    }, 0) / (totalFiles || 1); // Avoid division by zero

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
            <span className="text-sm font-medium">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={overallProgress}
            max="100"
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Completion status</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <progress
            className="progress progress-success w-full"
            value={completionPercentage}
            max="100"
          />
        </div>

        {(totalSuccessfulTransactions > 0 || totalRejectedTransactions > 0) && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-md font-medium mb-2">Transaction Summary</h4>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-figure text-success">
                  <CheckCircle size={20} />
                </div>
                <div className="stat-title">Successful</div>
                <div className="stat-value text-success">
                  {totalSuccessfulTransactions}
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-error">
                  <XCircle size={20} />
                </div>
                <div className="stat-title">Rejected</div>
                <div className="stat-value text-error">
                  {totalRejectedTransactions}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Success Rate</div>
                <div className="stat-value">
                  {totalSuccessfulTransactions + totalRejectedTransactions > 0
                    ? Math.round(
                        (totalSuccessfulTransactions /
                          (totalSuccessfulTransactions +
                            totalRejectedTransactions)) *
                          100,
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatus;
