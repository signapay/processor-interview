using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SignaPayProcessor.Data;
using SignaPayProcessor.Models;
using SignaPayProcessor.Services;

namespace SignaPayProcessor.Pages_Transaction
{
    public class EditModel : PageModel
    {
        private readonly TransactionContext _context;
        private readonly ITransactionService _transactionService;

        public EditModel(TransactionContext context, ITransactionService transactionService)        
        {
             _context = context;
             _transactionService = transactionService;
        }

        [BindProperty]
        public Transaction Transaction { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(DateTime? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var transaction =  await _context.Transaction.FirstOrDefaultAsync(m => m.TimeStamp == id);
            if (transaction == null)
            {
                return NotFound();
            }
            Transaction = transaction;            
            return Page();
        }

        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more information, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(Transaction).State = EntityState.Modified;
            Transaction.CardType = _transactionService.GetCardType(Transaction);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(Transaction.TimeStamp))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool TransactionExists(DateTime id)
        {
            return _context.Transaction.Any(e => e.TimeStamp == id);
        }
    }
}
