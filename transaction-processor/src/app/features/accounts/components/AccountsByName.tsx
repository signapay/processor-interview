import { Table } from "@/app/components/Table";
import { CardBalance } from "@/app/types/types";

interface AccountsByNameProps {
  accountName: string;
  data: CardBalance[];
}

export default function AccountsByName({ accountName, data }: AccountsByNameProps) {
  const headers = ["Card Number", "Account Balance"];

  return (
    <div className="basis-4/5 flex flex-col items-center p-2">
      <h2 className="text-[32px]">{accountName}</h2>
      <Table headers={headers} data={data} keyMap={{ "Card Number": "cardNumber", "Account Balance": "accountBalance" }} />
    </div>
  );
}
