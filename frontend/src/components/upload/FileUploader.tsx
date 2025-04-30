import React, { useCallback, useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        onFileUpload(files);
        e.dataTransfer.clearData();
      }
    },
    [onFileUpload],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        onFileUpload(files);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [onFileUpload],
  );

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`card bg-base-100 shadow-xl ${
        isDragging
          ? "border-primary border-opacity-50 bg-primary bg-opacity-5"
          : "border-base-300"
      } border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer`}
    >
      <input
        type="file"
        className="hidden"
        onChange={handleFileInput}
        ref={fileInputRef}
        multiple
        accept=".csv,.xml,.json"
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`rounded-full p-4 ${
            isDragging
              ? "bg-primary bg-opacity-10 text-primary"
              : "bg-base-200 text-base-content"
          }`}
        >
          <Upload size={32} />
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragging ? "Drop files here" : "Drag and drop files here"}
          </p>
          <p className="text-sm text-base-content text-opacity-60 mt-1">or</p>
          <button
            type="button"
            onClick={handleButtonClick}
            className="btn btn-primary btn-outline mt-4"
          >
            <File size={16} className="mr-2" />
            Browse Files
          </button>
          <p className="text-xs text-base-content text-opacity-60 mt-2">
            Supported formats: CSV, XLS, XLSX, JSON
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
