import { useTransactionContext } from "@/app/context/context";
import BadTransactions from "./bad-transactions/badTransactions";
import Accounts from "./accounts/accounts";
import Collections from "./collections/collections";
import AllTransactions from "./all-transactions/allTransactions";


export default function Content() {
  const { state } = useTransactionContext()

  return (
    <div className="mt-[24px] pl-[24px]">
      {state.transactions.length === 0 && (
        <div>
          <h1 className="text-[32px]">
            Upload a file to view transactions
          </h1>
          <h2 className="text-yellow-500">1. Click &quot;Choose File&quot; to select a file from your device</h2>
          <h2 className="text-yellow-500">2. Click &quot;Submit File&quot; to upload and view the file</h2>
        </div>
      )}
      <div className='flex flex-col gap-y-[16px] h-screen'>
        {state.currentPage === 'All Transactions' && <AllTransactions />}
        {state.currentPage === 'Accounts' && <Accounts />}
        {state.currentPage === 'Collections' && <Collections />}
        {state.currentPage === 'Bad Transactions' && <BadTransactions />}
      </div >
    </div>
  );
}