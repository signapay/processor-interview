interface ButtonProps {
  label?: string;
  type?: "submit" | "reset" | "button"
  onClick?: () => void;
}

export default function Button({ label, type, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="bg-indigo-600 min-h-[40px] rounded-full w-full hover:bg-indigo-900 hover:border-2 hover:border-white" type={type}>
      <p className="font-semibold text-white text-[16px]">
        {label}
      </p>
    </button>
  )
}