interface ButtonProps {
  label: string | undefined;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}