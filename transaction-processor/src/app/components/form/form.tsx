import { useTransactionContext } from "@/app/context/context";
import Button from "../button/button";
import Input from "../input/input";
import { SetStateAction } from "react";
import Papa from "papaparse";

export default function Form() {
  const { setTransactions } = useTransactionContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results: { data: SetStateAction<any[]>; }) => {
          setTransactions(results.data);
        },
        header: true,
      });
    }
  };

  const handleSubmit = () => {
    setTransactions(['bleep', 'bloop']);
    console.log('submit form');
  }

  const handleReset = () => {
    console.log('reset form');
  }

  return (
    <form className="border-4 border-red-500 flex flex-col gap-y-[8px]">
      <Input label="Upload Transaction Data:" />
      <div className="flex flex-row gap-x-[8px] justify-between">
        <Button label="Submit Form" onClick={handleSubmit} />
        <Button label="Reset Form" onClick={handleReset} />
      </div>
    </form>
  )
}