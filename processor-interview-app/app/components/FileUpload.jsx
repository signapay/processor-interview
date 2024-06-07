'use client';

export default function FileUpload({ handleFileUpload }) {
  return (
    <input
      type="file"
      onChange={handleFileUpload}
      className="mb-4 p-2 border-2 rounded-md"
    />
  );
}
