namespace CompanyNS.TransactionProcessor
{
    public class TransactionRecord
    {
        public string AccountName;
        public decimal CardNumber;
        public decimal TransactionAmount;
        public TransactionType TransactionType;
        public string Description;
        public decimal TargetCardNumber;

        public string badRawData;

    }
}