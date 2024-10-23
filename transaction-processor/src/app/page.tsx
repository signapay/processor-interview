'use client'

// TO DO
// write readme
// write tests
// allow csvs and other file formats

// FINAL QA
// check file naming conventions align with next js standards
// make sure numbers don't float
// format all instances of USD
// remove comments and console logs

// NICE TO HAVE
// paginate table OR at least lazy load data
// fix overlap of collapsed table cells
// favicon
// highlight button of selected section
// conditionally render button text based on if file has been uploaded or not

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
