import Table from "../../table/table";

interface AccountsByNameProps {
  accountName: string;
  data: any[];
}

export default function AccountsByName({ accountName, data }: AccountsByNameProps) {
  const headers = ["Card Number", "Account Balance"];

  return (
    <div className="basis-4/5 flex flex-col items-center">
      <h2 className="text-[32px]">{accountName}</h2>
      <Table headers={headers} data={data} />
    </div>
  );
}