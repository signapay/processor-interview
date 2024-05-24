namespace CompanyNS.TransactionProcessor.RecordParsing
{
    public interface ITransactionRecordParser
    {
        public TransactionRecord Parse(string raw);
    }
}