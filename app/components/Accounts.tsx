import { useState, useMemo, useCallback } from "react";
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

  // Pagination logic
  const itemsPerPage = 10; // Number of accounts to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(accounts.length / itemsPerPage); // Total number of pages

  // Get the accounts for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstItem, indexOfLastItem);

  // Memoize the accounts list for the current page to avoid unnecessary re-renders
  const accountList = useMemo(
    () =>
      currentAccounts.map((account: Account, index: number) => (
        <div className="col-sm-6 col-md-4" key={account.accountId}>
          <div className="card h-100 clickable-card" onClick={() => handleCardClick(account)} style={{ cursor: "pointer" }}>
            <div className="card-body">
              <h5 className="card-title">
                {index + 1 + (currentPage - 1) * itemsPerPage}. {account.accountName}
              </h5>
              <p className="card-text">Total Balance: ${parseFloat(account.balance).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )),
    [currentAccounts, currentPage]
  );

  const handleCardClick = useCallback(async (account: Account) => {
    setLoading(true);
    setSelectedAccount(account);
    setTransactions([]);
    try {
      const response = await fetch(`http://localhost:4000/accounts/${encodeURIComponent(account.accountId)}/transactions`);
      const data = await response.json();
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedAccount(null);
    setTransactions([]);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h3>Accounts</h3>

      {loading ? (
        <p>Loading...</p>
      ) : !selectedAccount ? (
        <>
          <div className="row row-cols-1 row-cols-md-1 g-4">
            {accountList} {/* memoized list of accounts for the current page */}
          </div>

          {/* Pagination Controls */}
          <div className="pagination mt-4">
            <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span className="mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        <CSSTransition in={!!selectedAccount} timeout={300} classNames="slide" unmountOnExit>
          <div className="col">
            <button onClick={handleBackClick} className="btn btn-secondary mb-3">
              Back to Accounts
            </button>
            <div className="card">
              <div className="card-body">{loading ? <p>Loading transactions...</p> : <PersonalAccount account={selectedAccount} transactions={transactions} />}</div>
            </div>
          </div>
        </CSSTransition>
      )}
    </div>
  );
};

export default Accounts;
