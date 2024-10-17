interface InputProps {
  label: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, onChange }: InputProps) {
  return (
    <div>
      {label &&
        <label htmlFor="fileInput">{label}</label>
      }
      <input
        type="file"
        id="fileInput"
        accept=".csv"
        onChange={onChange}
        className="border-4 border-blue-400"
      />
    </div >
  )
}