import { useTransactionContext } from '@/app/context/context';
import Button from '../button/button';
import Form from '../form/form';

export default function Navbar() {
  const { dispatch, state } = useTransactionContext();

  const handlePageChange = (page: string) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  return (
    <nav className="border-r-4 border-pink-300 flex flex-col gap-y-[16px] min-h-screen max-w-[300px] px-[16px] py-[32px]">
      <h1 className="font-bold mb-[25%] text-[26px] text-center uppercase">Transaction Processor</h1>
      <div className='border border-pink-300' />
      <Form />
      <div className='border border-pink-300' />
      {
        state.transactions.length > 0 && (
          <div className='flex flex-col gap-y-[16px]'>
            <Button label="All Transactions" onClick={() => handlePageChange('All Transactions')} />
            <Button label="Accounts" onClick={() => handlePageChange('Accounts')} />
            <Button label="Collections" onClick={() => handlePageChange('Collections')} />
            <Button label="Bad Transactions" onClick={() => handlePageChange('Bad Transactions')} />
          </div>
        )
      }
    </nav>
  )
}