interface InputProps {
  label: string | undefined;
}

export default function Input({ label }: InputProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('test test', event);
  }

  return (
    <div>
      {label &&
        <label htmlFor="fileInput">{label}</label>
      }
      <input
        type="file"
        id="fileInput"
        accept=".csv"
        onChange={handleFileUpload}
        className="border-4 border-blue-400"
      />
    </div >
  )
}