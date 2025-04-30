using SignaPayProcessor.Models;

namespace SignaPayProcessor.Services
{
    public interface ITransactionService
    {
        string GetCardType(Transaction transaction);
    }
}