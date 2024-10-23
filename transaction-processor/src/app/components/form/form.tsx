import { useTransactionContext } from "@/app/context/context";
import Button from "../button/button";
import Input from "../input/input";
import Papa from "papaparse";
import { useRef, useState } from "react";
import { headerKeyMap, headers } from "@/app/constants";
import { Transaction } from "@/app/types/types";

export default function Form() {
  const { dispatch, state } = useTransactionContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTransactions, setNewTransactions] = useState<Transaction[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const parsedRows = results.data as string[][];

          const [validTransactions, brokenRows] = parsedRows.reduce<[Transaction[], string[][]]>(
            ([valid, broken], row) => {
              if (row.length === headers.length) {
                const transaction = headers.reduce((acc, header, index) => {
                  const key = headerKeyMap[header] as keyof Transaction;
                  if (key === "transactionAmount") {
                    acc[key] = parseFloat(row[index]);
                  } else {
                    acc[key] = row[index];
                  }
                  return acc;
                }, {} as Transaction);

                const isBroken =
                  !transaction.accountName ||
                  !transaction.cardNumber ||
                  transaction.transactionAmount === undefined ||
                  !transaction.transactionType ||
                  !transaction.description;

                if (isBroken) {
                  broken.push(row);
                } else {
                  valid.push(transaction);
                }
              } else {
                broken.push(row);
              }
              return [valid, broken];
            },
            [[], []]
          );

          setNewTransactions(validTransactions);
        },
        error: (error) => {
          console.error("Parsing error", error);
        },
        header: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTransactions = [...state.transactions, ...newTransactions];

    dispatch({ type: "SET_TRANSACTIONS", payload: updatedTransactions });
    dispatch({ type: "SET_PAGE", payload: "All Transactions" });

    setNewTransactions([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET_APP" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form className="flex flex-col gap-y-[16px]" onSubmit={handleSubmit}>
      <Input
        ref={fileInputRef}
        label="Upload Transaction Data:"
        helpText="Acceptable file types: .csv"
        onChange={handleFileUpload}
      />
      <Button label="Submit File" type="submit" />
      <Button label="Reset Form" onClick={handleReset} />
    </form>
  );
}
