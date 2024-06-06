using DataReader.Models;

namespace DataReader.Services
{
    public interface IInMemoryCache
    {
            List<Account> Accounts { get; set; }
            List<Account> Collections { get; set; }
            List<BadTransaction> BadTransactions { get; set; }
    }
}
