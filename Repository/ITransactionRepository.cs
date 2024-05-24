namespace CompanyNS.TransactionProcessor.Repository
{
    public interface ITransactionRepository
    {
        public void Clear(); // Empties the repo
        public void Add(TransactionRecord record);

        public IList<string> ListAccounts();
        public IList<decimal> ListCardsByAccount(string accountName);
        public decimal GetBalance(decimal cardNumber);
        public IList<TransactionRecord> GetBadTransactions();
    }
}