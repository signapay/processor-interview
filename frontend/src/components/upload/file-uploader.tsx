import React, { useCallback, useRef, useState } from "react";

import { File, Upload } from "lucide-react";

import { useUploadTransactionFile } from "@/lib/api";

interface FileUploaderProps {
  onFileUpload: (files: File[], jobIds: string[]) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isUploading) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled, isUploading],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isUploading) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    [disabled, isUploading],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isUploading) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    },
    [disabled, isUploading],
  );

  // Initialize the file upload mutation
  const uploadFileMutation = useUploadTransactionFile();

  // Function to upload files to the server
  const uploadFiles = async (files: File[]) => {
    if (disabled || isUploading || files.length === 0) return;

    setIsUploading(true);
    const jobIds: string[] = [];

    try {
      // Upload each file using the mutation
      for (const file of files) {
        const result = await uploadFileMutation.mutateAsync(file);

        if (result?.jobId) {
          jobIds.push(result.jobId);
        }
      }

      // Call the onFileUpload callback with the files and job IDs
      onFileUpload(files, jobIds);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isUploading) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        uploadFiles(files);
        e.dataTransfer.clearData();
      }
    },
    [disabled, isUploading],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || isUploading) return;
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        uploadFiles(files);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [disabled, isUploading],
  );

  const handleButtonClick = useCallback(() => {
    if (disabled || isUploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isUploading]);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleButtonClick();
        }
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`card bg-base-100 shadow-xl ${
        isDragging
          ? "border-primary border-opacity-50 bg-primary bg-opacity-5"
          : "border-base-300"
      } border-2 border-dashed p-8 text-center transition-all duration-200 ${
        disabled || isUploading
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }`}
    >
      <input
        type="file"
        className="hidden"
        onChange={handleFileInput}
        ref={fileInputRef}
        multiple
        accept=".csv,.xml,.json"
        disabled={disabled || isUploading}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`rounded-full p-4 ${
            isDragging
              ? "bg-primary bg-opacity-10 text-primary"
              : isUploading
                ? "bg-info bg-opacity-10 text-info"
                : "bg-base-200 text-base-content"
          }`}
        >
          <Upload size={32} />
        </div>
        <div>
          <p className="text-lg font-medium">
            {isUploading
              ? "Uploading files..."
              : isDragging
                ? "Drop files here"
                : "Drag and drop files here"}
          </p>
          <p className="text-sm text-base-content text-opacity-60 mt-1">or</p>
          <button
            type="button"
            onClick={handleButtonClick}
            className="btn btn-primary btn-outline mt-4"
            disabled={disabled || isUploading}
          >
            <File size={16} className="mr-2" />
            {isUploading ? "Uploading..." : "Browse Files"}
          </button>
          <p className="text-xs text-base-content text-opacity-60 mt-2">
            Supported formats: CSV, XML, JSON
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
