'use client'

// TO DO
// write readme

// FINAL QA
// remove comments and console logs

// NICE TO HAVE
// paginate table OR at least lazy load data
// fix overlap of collapsed table cells
// favicon
// highlight button of selected section
// conditionally render button text based on if file has been uploaded or not

import { TransactionProvider } from './context/context';
import { Content } from './components/Content';
import { WidthContainer } from './components/WidthContainer';
import { Navbar } from './features/navbar';

export default function Home() {
  return (
    <TransactionProvider>
      <div className='flex flex-row'>
        <Navbar />
        <WidthContainer>
          <Content />
        </WidthContainer>
      </div>
    </TransactionProvider>
  );
}