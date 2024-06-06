using DataReader.Models;

namespace DataReader.Services
{
    public class InMemoryCache : IInMemoryCache
    {
        public List<Account> Accounts { get; set; } = new List<Account>();
        public List<Account> Collections { get; set; } = new List<Account>();
        public List<BadTransaction> BadTransactions { get; set; } = new List<BadTransaction>();
    }
}
