import React from 'react';
import Upload from '../components/Upload/Upload';

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="container w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Transaction Processor</h1>
        <Upload />
      </div>
    </main>
  );
};

export default Home;
