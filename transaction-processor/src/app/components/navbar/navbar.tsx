import Button from '../button/button';
import Form from '../form/form';

export default function Navbar() {
  return (
    <nav className="border-2 border-purple-500 flex flex-col gap-y-[16px] min-h-screen max-w-[300px] px-[16px] py-[32px]">
      <h1 className="font-bold mb-[25%] text-[26px] text-center uppercase">Transaction Processor</h1>
      <div className='flex flex-col gap-y-[16px]'>
        <Form />
        {/* // A chart of accounts that list the account name, its cards, and the amount on each card */}
        <Button label="Accounts" />
        {/* // A list of accounts that we need to give to collections (any cards with a < 000 balance) */}
        <Button label="Collections" />
        {/* // A list of "bad transactions" that someone needs to go look at (any transactions that you were unable to parse) */}
        <Button label="Bad Transactions" />
      </div>
    </nav>
  )
}