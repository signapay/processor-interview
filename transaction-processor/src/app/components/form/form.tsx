import { useTransactionContext } from "@/app/context/context";
import Button from "../button/button";
import Input from "../input/input";
import Papa from "papaparse";
import { headers } from "@/app/constants";

export default function Form() {
  const { dispatch, state } = useTransactionContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const mappedData = (results.data as string[][]).map((row: string[]) => {
            if (row.length === headers.length) {
              return headers.reduce((acc, header, index) => {
                acc[header] = row[index];
                return acc;
              }, {} as { [key: string]: string });
            }
            return null;
          }).filter(Boolean);
          dispatch({ type: 'SET_PARSED_DATA', payload: mappedData });
        },
        error: (error) => {
          console.error('Parsing error', error);
        },
        header: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_TRANSACTIONS', payload: state.parsedData });
    dispatch({ type: 'SET_PAGE', payload: 'All Transactions' });
    console.log('submit form');
  };

  const handleReset = () => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
    dispatch({ type: 'SET_PARSED_DATA', payload: [] });
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
