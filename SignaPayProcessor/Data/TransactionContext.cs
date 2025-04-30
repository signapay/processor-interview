using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SignaPayProcessor.Models;

namespace SignaPayProcessor.Data
{
    public class TransactionContext : DbContext
    {
        public TransactionContext (DbContextOptions<TransactionContext> options)
            : base(options)
        {
        }

        public DbSet<SignaPayProcessor.Models.Transaction> Transaction { get; set; } = default!;
    }
}
