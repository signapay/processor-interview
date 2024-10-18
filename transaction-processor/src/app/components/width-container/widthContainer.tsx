import { ReactNode } from "react";

export default function WidthContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-[75%] mx-auto">
      {children}
    </div>
  );
}