using SignaPayProcessor.Models;
namespace SignaPayProcessor.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ILogger<FileService> _logger; 

        public TransactionService(ILogger<FileService> logger)
        {
            _logger = logger;
        }

        public string GetCardType(Transaction transaction)
        {
            return transaction.CardNumber.ToString() switch
            {
                var card when card.StartsWith("3") => "Amex",
                var card when card.StartsWith("4") => "Visa",
                var card when card.StartsWith("5") => "MasterCard",
                var card when card.StartsWith("6") => "Discover",
                _ => "Rejected"
            };
        }
    }   
}