export default function BadTransactionList({ badTransactions }) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Bad Transactions</h2>
        <ul>
          {badTransactions.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>
    );
  }
  