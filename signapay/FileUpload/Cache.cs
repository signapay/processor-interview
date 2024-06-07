using System.Transactions;

namespace signapay.FileUpload
{
    public interface Cache
    {
        public Dictionary<string, Dictionary<string, double>> accountInfo { get; set; }

        public List<Transaction> Transactions { get; set; }
        public List<Transaction> BadTransactions { get; set; }

        public List<string> accounts { get; set; }
    }
}
