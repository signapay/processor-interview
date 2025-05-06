"use client";

import { useState, FormEvent } from "react";
import * as apiClient from "@/services/apiClient";

interface FileStatus {
  status: "pending" | "uploading" | "success" | "error";
  message: string;
}

export default function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Store status for each file by its name
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>(
    {},
  );
  const [isOverallLoading, setIsOverallLoading] = useState<boolean>(false);
  // General message or error for the form itself
  const [formMessage, setFormMessage] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const MAX_FILES = 3;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (filesArray.length > MAX_FILES) {
        setFormError(`You can select a maximum of ${MAX_FILES} files.`);
        setSelectedFiles([]); // Clear selection or keep previous valid one
        event.target.value = ""; // Clear the input
      } else {
        setSelectedFiles(filesArray);
        setFormError(""); // Clear previous error
      }
      // Reset statuses and messages when file selection changes
      setFileStatuses({});
      setFormMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setFormError("");

    if (selectedFiles.length === 0) {
      setFormError("Please select at least one file to upload.");
      return;
    }
    if (selectedFiles.length > MAX_FILES) {
      setFormError(`You can upload a maximum of ${MAX_FILES} files at a time.`);
      return;
    }

    setIsOverallLoading(true);
    const initialStatuses: Record<string, FileStatus> = {};
    selectedFiles.forEach((file) => {
      initialStatuses[file.name] = {
        status: "pending",
        message: "Waiting to upload...",
      };
    });
    setFileStatuses(initialStatuses);

    const uploadPromises = selectedFiles.map(async (file) => {
      setFileStatuses((prev) => ({
        ...prev,
        [file.name]: { status: "uploading", message: "Uploading..." },
      }));

      const formData = new FormData();
      formData.append("file", file); // Backend expects 'file' key

      try {
        const result = await apiClient.uploadTransactionFiles(formData);
        setFileStatuses((prev) => ({
          ...prev,
          [file.name]: {
            status: "success",
            message: result.message || "Uploaded successfully!",
          },
        }));
      } catch (err) {
        setFileStatuses((prev) => ({
          ...prev,
          [file.name]: {
            status: "error",
            message: err instanceof Error ? err.message : "Upload failed.",
          },
        }));
      }
    });

    // Wait for all uploads to complete (or fail)
    await Promise.allSettled(uploadPromises);
    setIsOverallLoading(false);
    setFormMessage("All selected files have been processed.");
    // Optionally clear selected files after processing
    // setSelectedFiles([]);
    // if (event.currentTarget) {
    //   event.currentTarget.reset();
    // }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Upload Transaction Files
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Select up to {MAX_FILES} transaction files (e.g., .txt, .csv, .json) to
        be processed.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="transactionFiles" // Changed id for consistency
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction Files (Select 1 to {MAX_FILES})
          </label>
          <input
            type="file"
            id="transactionFiles" // Changed id
            name="transactionFiles" // Name attribute for the input field
            multiple // Allow multiple file selection
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100"
            accept=".xml,.csv,.json" // As per original requirement
          />
        </div>
        <button
          type="submit"
          disabled={isOverallLoading || selectedFiles.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md
                               disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isOverallLoading
            ? "Processing..."
            : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ""} File(s)`}
        </button>
      </form>

      {/* Display form-level messages/errors */}
      {isOverallLoading &&
        !Object.keys(fileStatuses).length && ( // Show general loading if statuses not yet set
          <div className="mt-4 text-center text-sm text-gray-500">
            Preparing uploads...
          </div>
        )}
      {formMessage && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          {formMessage}
        </div>
      )}
      {formError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {formError}
        </div>
      )}

      {/* Display individual file statuses */}
      {Object.entries(fileStatuses).length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-md font-semibold text-gray-700">
            Upload Statuses:
          </h3>
          {Object.entries(fileStatuses).map(([fileName, statusInfo]) => (
            <div
              key={fileName}
              className={`p-3 rounded-md text-sm flex justify-between items-center ${
                statusInfo.status === "success"
                  ? "bg-green-100 text-green-800"
                  : statusInfo.status === "error"
                    ? "bg-red-100 text-red-800"
                    : statusInfo.status === "uploading"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800" // pending
              }`}
            >
              <span>
                <strong>{fileName}:</strong> {statusInfo.message}
              </span>
              {statusInfo.status === "uploading" && (
                <span className="italic text-xs">Processing...</span> // Simple loading indicator
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
