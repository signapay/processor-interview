import { BadTransaction } from "types/types";

type BadTransactionsProps = {
  badTransactions: BadTransaction[];
};

export const BadTransactions: React.FC<BadTransactionsProps> = ({ badTransactions }) => {
  return (
    <div>
      <h3>Bad Transactions</h3>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {badTransactions.map((transaction: BadTransaction, index: number) => (
          <div className="col d-flex" key={index}>
            <div className="card flex-fill mb-3 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {index + 1}. {transaction.accountName}
                </h5>
                <p className="card-text">
                  <strong>Error:</strong> {transaction.error || "Unknown error"}
                </p>
                <p className="card-text">
                  <strong>Description:</strong> {transaction.description || "No description available"}
                </p>
                <p className="card-text">
                  <strong>Transaction Amount:</strong> ${transaction.transactionAmount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
