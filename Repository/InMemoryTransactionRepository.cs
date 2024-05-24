namespace CompanyNS.TransactionProcessor.Repository
{
    public class InMemoryTransactionRepository : ITransactionRepository
    {
        Dictionary<string, List<decimal>> accountCards;
        Dictionary<decimal, decimal> cardBalances;
        List<TransactionRecord> records;
        List<TransactionRecord> badRecords;

        public InMemoryTransactionRepository()
        {
            accountCards = new Dictionary<string, List<decimal>>();
            cardBalances = new Dictionary<decimal, decimal>();
            records = new List<TransactionRecord>();
            badRecords = new List<TransactionRecord>();
        }

        public void Clear()
        {
            accountCards.Clear();
            cardBalances.Clear();
            records.Clear();
            badRecords.Clear();
        }

        public void Add(TransactionRecord record)
        {
            if (!string.IsNullOrEmpty(record.badRawData))
            {
                badRecords.Add(record);
                return;
            }

            records.Add(record);

            if (!cardBalances.ContainsKey(record.CardNumber))
                cardBalances[record.CardNumber] = 0;

            cardBalances[record.CardNumber] += record.TransactionAmount;

            if (!accountCards.ContainsKey(record.AccountName))
                accountCards[record.AccountName] = new List<decimal>();

            if (!accountCards[record.AccountName].Contains(record.CardNumber))
                accountCards[record.AccountName].Add(record.CardNumber);
        }


        public IList<string> ListAccounts()
        {
            return new List<string>(accountCards.Keys);
        }

        public IList<decimal> ListCardsByAccount(string accountName)
        {
            if (!accountCards.ContainsKey(accountName))
                return new List<decimal>();

            return accountCards[accountName];
        }

        public decimal GetBalance(decimal cardNumber)
        {
            if (!cardBalances.ContainsKey(cardNumber))
                return 0;

            return cardBalances[cardNumber];
        }

        public IList<TransactionRecord> GetBadTransactions()
        {
            return badRecords;
        }
    }
}