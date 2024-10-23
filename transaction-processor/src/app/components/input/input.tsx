import React, { forwardRef, ChangeEvent } from "react";

interface InputProps {
  label: string;
  helpText: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helpText, onChange, multiple = false }, ref) => {
    return (
      <div className="flex flex-col gap-y-2">
        <label className="font-medium">{label}</label>
        <input
          type="file"
          onChange={onChange}
          ref={ref}
          multiple={multiple}
          className="border px-4 py-2 rounded"
        />
        <p className="text-sm text-gray-500">{helpText}</p>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
