interface ButtonProps {
  label: string | undefined;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="border-4 min-h-[40px] rounded-full w-full">
      <p className="text-blue-200 text-[16px]">
        {label}
      </p>
    </button>
  )
}