import Table from "../../table/table";

interface AccountData {
  cardNumber: string;
  accountBalance: string;
}

interface AccountsByNameProps {
  accountName: string;
  data: AccountData[];
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
