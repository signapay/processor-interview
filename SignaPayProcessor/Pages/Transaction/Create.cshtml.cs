using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using SignaPayProcessor.Data;
using SignaPayProcessor.Models;
using SignaPayProcessor.Services;

namespace SignaPayProcessor.Pages_Transaction
{
    public class CreateModel : PageModel
    {
        private readonly SignaPayProcessor.Data.TransactionContext _context;
        private readonly ITransactionService _transactionService;

        public CreateModel(TransactionContext context, ITransactionService transactionService)
        {
            _context = context;
            _transactionService = transactionService;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public Transaction Transaction { get; set; } = default!;

        // For more information, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }
            Transaction.CardType = _transactionService.GetCardType(Transaction);
            _context.Transaction.Add(Transaction);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
