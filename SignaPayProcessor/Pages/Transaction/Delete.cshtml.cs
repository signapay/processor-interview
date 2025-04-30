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
    public class DeleteModel : PageModel
    {
        private readonly SignaPayProcessor.Data.TransactionContext _context;

        public DeleteModel(SignaPayProcessor.Data.TransactionContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Transaction Transaction { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(DateTime? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var transaction = await _context.Transaction.
                                FirstOrDefaultAsync(m => EF.Functions.DateDiffMicrosecond(m.TimeStamp, id.Value) == 0);

            if (transaction is not null)
            {
                Transaction = transaction;
                ViewData["TimeStamp"] = transaction.TimeStamp.ToString("yyyy-MM-dd HH:mm:ss.ffffff");
                return Page();
            }

            return NotFound();
        }

        public async Task<IActionResult> OnPostAsync(DateTime? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var transaction = await _context.Transaction.FirstOrDefaultAsync(m => EF.Functions.DateDiffMicrosecond(m.TimeStamp, id.Value) == 0);
            if (transaction != null)
            {
                Transaction = transaction;
                _context.Transaction.Remove(Transaction);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
