import { useTransactionContext } from "@/app/context/context";
import Button from "../button/button";
import Input from "../input/input";
import Papa from "papaparse";

export default function Form() {
  const { setTransactions, parsedData, setParsedData } = useTransactionContext();
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          setParsedData(results.data);
        },
        header: true,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransactions(parsedData);
    console.log('submit form');
  };

  const handleReset = () => {
    setTransactions([]);
    setParsedData([]);
    console.log('reset form');
  };

  return (
    <form className="flex flex-col gap-y-[16px]" onSubmit={handleSubmit}>
      <Input label="Upload Transaction Data:" helpText="Acceptable file types: .csv" onChange={handleFileUpload} />
      <Button label="Submit File" type="submit" />
      <Button label="Reset Form" onClick={handleReset} />
    </form>
  );
}
