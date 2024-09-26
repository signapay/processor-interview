import { Account } from "types/types";

type CollectionsProps = {
  collections: Account[];
};

export const Collections: React.FC<CollectionsProps> = ({ collections }) => {
  console.log("Collections " + JSON.stringify(collections));
  return (
    <div>
      <h3>Collections</h3>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {collections.map((account: Account, index: number) => (
          <div className="col d-flex" key={index}>
            <div className="card flex-fill mb-3 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {index + 1}. {account.accountName}
                </h5>
                <p className="card-text">
                  <strong>Balance:</strong> ${account.balance}
                </p>
                <ul className="list-group list-group-flush mb-3">
                  {Object.entries(account.cards).map(([cardNumber, balance]: [string, number], cardIndex: number) => (
                    <li className="list-group-item" key={cardIndex}>
                      <strong>Card {cardIndex + 1}:</strong> **** {String(cardNumber).slice(-4)} - Balance: ${balance.toFixed(2)}
                      <p></p>
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
