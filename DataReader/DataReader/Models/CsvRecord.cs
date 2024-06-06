namespace DataReader.Models
{
    public class CsvRecord
    {
        public string AccountName { get; set; }
        public string CardNumber { get; set; }
        public decimal Amount { get; set; }
        public string TransactionType { get; set; }
        public string TransactionDetails { get; set; }
        public string RelatedCardNumber { get; set; }
    }
}
