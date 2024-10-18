'use client'

// TO DO
// reducer to set state of current content displayed based on navbard button clicked
// A chart of accounts that list the account name, its cards, and the amount on each card
// A list of accounts that we need to give to collections (any cards with a < 0.00 balance)
// A list of "bad transactions" that someone needs to go look at (any transactions that you were unable to parse)
// Each file submitted should continue "in continuation of" previous submissions
// validation for file type
// favicon
// paginate table

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
