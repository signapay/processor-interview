import { Account } from "types/types";

type AccountsProps = {
  accounts: Account[];
};

export const Accounts: React.FC<AccountsProps> = ({ accounts }) => {
  return (
    <div>
      <h3>Accounts</h3>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {accounts.map((account: Account, index: number) => (
          <div className="col" key={index}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  {index + 1}. {account.accountName}
                </h5>
                <p className="card-text">Total Balance: ${parseFloat(account.balance).toFixed(2)}</p>
                <ul>
                  {Object.entries(account.cards).map(([cardNumber, balance], cardIndex) => (
                    <li key={cardIndex}>
                      Card {cardIndex + 1}: **** {String(cardNumber).slice(-4)} - Balance: ${balance.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
