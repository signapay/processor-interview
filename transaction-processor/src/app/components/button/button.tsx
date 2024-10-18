interface ButtonProps {
  label?: string;
  type?: "submit" | "reset" | "button"
  onClick?: () => void;
}

export default function Button({ label, type, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="border-4 min-h-[40px] rounded-full w-full" type={type}>
      <p className="text-blue-200 text-[16px]">
        {label}
      </p>
    </button>
  )
}