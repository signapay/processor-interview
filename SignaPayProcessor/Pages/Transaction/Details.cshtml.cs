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
    public class DetailsModel : PageModel
    {
        private readonly SignaPayProcessor.Data.TransactionContext _context;

        public DetailsModel(SignaPayProcessor.Data.TransactionContext context)
        {
            _context = context;
        }

        public Transaction Transaction { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(DateTime? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var transaction = await _context.Transaction
                                .FirstOrDefaultAsync(m => m.TimeStamp.Date == id.Value.Date 
                                    && m.TimeStamp.Hour == id.Value.Hour 
                                    && m.TimeStamp.Minute == id.Value.Minute 
                                    && m.TimeStamp.Second == id.Value.Second);
                                    
            ViewData["TimeStamp"] = transaction?.TimeStamp.ToString("yyyy-MM-dd HH:mm:ss");                                    

            if (transaction is not null)
            {
                Transaction = transaction;

                return Page();
            }

            return NotFound();
        }
    }
}
