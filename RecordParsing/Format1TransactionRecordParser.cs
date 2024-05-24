namespace CompanyNS.TransactionProcessor.RecordParsing
{
    /**
        Format 1:
              
        string AccountName;
        decimal CardNumber;
        decimal TransactionAmount;
        TransactionType TransactionType;
        string Description;
        decimal TargetCardNumber;  [Optional]
    */
    public class Format1TransactionRecordParser : ITransactionRecordParser
    {
        public TransactionRecord Parse(string raw)
        {
            TransactionRecord record = new TransactionRecord();

            var fields = raw.Split(',');

            // Rely on short-circuit evaluation to prevent 'index out of bounds' issues here
            if (fields.Length < 5 ||
                !parseCardNumber(fields[1], record) ||
                !parseTransactionAmount(fields[2], record) ||
                !parseTransactionType(fields[3], record) ||
                !parseTargetCardNumber(fields, record))
                record.badRawData = raw;


            record.AccountName = fields[0];
            record.Description = fields.Length > 4 ? fields[4] : "";

            return record;
        }

        bool parseCardNumber(string raw, TransactionRecord record)
        {
            return decimal.TryParse(raw, out record.CardNumber);
        }

        bool parseTransactionAmount(string raw, TransactionRecord record)
        {
            return decimal.TryParse(raw, out record.TransactionAmount);
        }

        bool parseTransactionType(string raw, TransactionRecord record)
        {
            switch (raw.ToLower())
            {
                case "credit":
                    record.TransactionType = TransactionType.Credit;
                    break;

                case "debit":
                    record.TransactionType = TransactionType.Debit;
                    break;

                case "transfer":
                    record.TransactionType = TransactionType.Transfer;
                    break;

                default:
                    return false;
            }

            return true;
        }

        bool parseTargetCardNumber(string[] fields, TransactionRecord record)
        {
            if (fields.Length > 5 && record.TransactionType == TransactionType.Transfer)
                return decimal.TryParse(fields[5], out record.TargetCardNumber);

            // If it's a transfer type, but the fields length is less than or equal to 5, then
            // the target card number field is missing.  Otherwise, we don't need that field.
            return record.TransactionType != TransactionType.Transfer;
        }
    }
}