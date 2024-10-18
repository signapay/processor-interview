interface InputProps {
  label?: string;
  helpText?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, helpText, onChange }: InputProps) {
  return (
    <div className="flex flex-col">
      {label &&
        <label htmlFor="fileInput">{label}</label>
      }
      <input
        type="file"
        id="fileInput"
        accept=".csv"
        onChange={onChange}
        className="border border-blue-400"
      />
      {
        helpText &&
        <div className='flex flex-row'>
          <h2 className="text-[12px]">{helpText}</h2>
        </div>
      }
    </div >
  )
}