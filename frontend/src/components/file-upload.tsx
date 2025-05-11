"use client"

import type React from "react"

import { useState } from "react"
import type { ApiResponse } from "@/lib/types"

interface FileUploadProps {
  onDataReceived: (response: ApiResponse) => void
}

export function FileUpload({ onDataReceived }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      // Check file type
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""
      if (!["csv", "json", "xml"].includes(fileExtension)) {
        throw new Error("Please upload a CSV, JSON, or XML file")
      }

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock server response
      const mockResponse: ApiResponse = {
        success: true,
        message: "File processed successfully",
        data: {
          "3336208249795480": {
            "2025-03-06": [-362.26],
            "2024-12-06": [446.85],
            "2025-03-21": [549.67],
            "2024-07-25": [36.97],
            "2024-05-23": [172.84],
            "2024-05-04": [103.64],
            "2024-06-21": [-181.27],
          },
          "3324679021275326": {
            "2024-05-21": [-36.7],
            "2024-07-13": [-219.31],
            "2024-11-25": [-607.55],
            "2024-12-02": [286.18],
            "2024-08-13": [-951.32],
            "2025-02-18": [-827.6],
            "2025-01-15": [-275.01],
            "2024-09-03": [570.35],
            "2024-10-12": [-604.15],
            "2024-06-29": [591.73],
            "2024-12-23": [13.88],
            "2025-01-08": [532.12],
          },
          // Shortened for brevity - include more data as needed
        },
      }

      onDataReceived(mockResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file")
      onDataReceived({
        success: false,
        message: err instanceof Error ? err.message : "Failed to process file",
      })
    } finally {
      setIsLoading(false)
      e.target.value = ""
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".csv,.json,.xml"
          onChange={handleFileChange}
          disabled={isLoading}
          className="text-sm"
          id="file-upload"
        />
        <button
          disabled={isLoading}
          onClick={() => document.getElementById("file-upload")?.click()}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Upload File"}
        </button>
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      <div className="mt-2 text-xs text-gray-500">
        <p>Supported formats: CSV, JSON, XML</p>
      </div>
    </div>
  )
}
