interface ButtonProps {
  label?: string;
  type?: "submit" | "reset" | "button"
  variant?: "primary" | "link";
  onClick?: () => void;
}

export default function Button({ label, type, variant, onClick }: ButtonProps) {
  if (variant === "primary" || variant === undefined) {
    return (
      <button onClick={onClick} className="bg-indigo-600 min-h-[40px] rounded-full w-full hover:bg-indigo-900 hover:border-2 hover:border-white" type={type}>
        <p className="font-semibold text-white text-[16px]">
          {label}
        </p>
      </button>
    )
  } else if (variant === "link") {
    return (
      <button onClick={onClick} className="bg-transparent min-h-[40px] w-full hover:bg-indigo-900 hover:border-2 hover:border-white" type={type}>
        <p className="font-normal px-[16px] text-[16px] text-left text-white">
          {label}
        </p>
      </button>
    )
  }
}