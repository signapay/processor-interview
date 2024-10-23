'use client'

import { TransactionProvider } from './context/context';
import { WidthContainer } from './components/WidthContainer';
import { Content } from './components/Content';
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