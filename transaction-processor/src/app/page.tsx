'use client'

// TO DO
// A chart of accounts that list the account name, its cards, and the amount on each card

// technically, I can't see the card's balance. I can only see transaction amount. need to bring this up in readme or interview.
// A list of accounts that we need to give to collections (any cards with a < 0.00 balance)

// A list of "bad transactions" that someone needs to go look at (any transactions that you were unable to parse)
// Each file submitted should continue "in continuation of" previous submissions
// validation for file type
// remove comments and console logs
// write readme
// conditionally render button text based on if fil has been uploaded or not
// clone to standalone repo
// deploy to vercel
// highlight button of selected section
// favicon
// paginate table OR at least lazy load data
// check file naming conventions align with next js standards

import { TransactionProvider } from './context/context';
import WidthContainer from './components/width-container/widthContainer';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Content from './components/content/content';

export default function Home() {
  return (
    <TransactionProvider>
      <div className='flex flex-row'>
        <Navbar />
        <WidthContainer>
          <Content />
        </WidthContainer>
      </div>
      <Footer />
    </TransactionProvider>
  );
}
