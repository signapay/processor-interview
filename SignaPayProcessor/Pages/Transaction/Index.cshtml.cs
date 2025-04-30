using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SignaPayProcessor.Data;
using SignaPayProcessor.Models;

namespace SignaPayProcessor.Pages_Transaction
{
    public class IndexModel : PageModel
    {
        private readonly SignaPayProcessor.Data.TransactionContext _context;

        public IndexModel(SignaPayProcessor.Data.TransactionContext context)
        {
            _context = context;
        }

        public IList<Transaction> Transaction { get;set; } = default!;
        
        [BindProperty(SupportsGet = true)]
        public string? SearchString { get; set; }

        [BindProperty(SupportsGet = true)]
        public string? CardType { get; set; }
        
        [BindProperty(SupportsGet = true)]
        public DateTime? TransactionDate { get; set; }

        public async Task OnGetAsync()
        {
            Transaction = await _context.Transaction.ToListAsync();
             if(!string.IsNullOrEmpty(SearchString))
            {
                Transaction = Transaction
                    .Where(s => s.CardNumber.ToString().Contains(SearchString)).ToList();
            }
            if(!string.IsNullOrEmpty(CardType))
            {
                Transaction = Transaction
                    .Where(s => s.CardType != null && CardType != null && s.CardType.ToString()
                    .Contains(CardType))
                    .ToList();
            }
            if(TransactionDate != null)
            {
                Transaction = Transaction
                    .Where(s => s.TimeStamp.Date == TransactionDate?.Date).ToList();
            }
        }
    }
}
