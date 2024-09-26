import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { Account, Transaction } from "../../types/types";
import PersonalAccount from "./PersonalAccount";
import { CSSTransition } from "react-transition-group";

type AccountsProps = {
  accounts: Account[];
};

export const Accounts: React.FC<AccountsProps> = ({ accounts }) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // memoize the accounts list to avoid unnecessary re-rendering
  const accountList = useMemo(
    () =>
      accounts.map((account: Account, index: number) => (
        <div className="col" key={account.accountId}>
          <div className="card h-100 clickable-card" onClick={() => handleCardClick(account)} style={{ cursor: "pointer" }}>
            <div className="card-body">
              <h5 className="card-title">
                {index + 1}. {account.accountName}
              </h5>
              <p className="card-text">Total Balance: ${parseFloat(account.balance).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )),
    [accounts]
  );

  const handleCardClick = useCallback(async (account: Account) => {
    setLoading(true);
    setSelectedAccount(account);
    setTransactions([]);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay for loading

      const response = await fetch(`http://localhost:4000/accounts/${encodeURIComponent(account.accountId)}/transactions`);
      const data = await response.json();
      console.log("Transaction data " + JSON.stringify(data));
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBackClick = useCallback(async () => {
    setLoading(true);
    setSelectedAccount(null);
    setTransactions([]); // clear transactions

    // simulate a delay for loading the account list
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoading(false);
  }, []);

  return (
    <div>
      <h3>Accounts</h3>

      {loading ? (
        <p>Loading...</p>
      ) : !selectedAccount ? (
        <div className="row row-cols-1 row-cols-md-1 g-4">
          {accountList} {/* memoized list of accounts */}
        </div>
      ) : (
        <CSSTransition in={!!selectedAccount} timeout={300} classNames="slide" unmountOnExit>
          <div className="col">
            <button onClick={handleBackClick} className="btn btn-secondary mb-3">
              Back to Accounts
            </button>
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <p>Loading transactions...</p>
                ) : (
                  <Suspense fallback={<p>Loading details...</p>}>
                    <PersonalAccount account={selectedAccount} transactions={transactions} />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </CSSTransition>
      )}
    </div>
  );
};
