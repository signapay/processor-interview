import { useTransactionContext } from "@/app/context/context";
import Button from "../button/button";
import Input from "../input/input";
import Papa from "papaparse";

export default function Form() {
  const { setTransactions } = useTransactionContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          setTransactions(results.data);  // This will update the context state with parsed CSV data
        },
        header: true,
      });
    }
  };

  const handleSubmit = () => {
    // Remove the dummy data to prevent overriding actual parsed data
    console.log('submit form');
  };

  const handleReset = () => {
    setTransactions([]); // Reset the transactions on form reset
    console.log('reset form');
  };

  return (
    <form className="border-4 border-red-500 flex flex-col">
      <Input label="Upload Transaction Data:" onChange={handleFileUpload} />
      <div className="flex flex-row gap-x-[8px] justify-between">
        <Button label="Submit Form" onClick={handleSubmit} />
        <Button label="Reset Form" onClick={handleReset} />
      </div>
    </form>
  );
}
