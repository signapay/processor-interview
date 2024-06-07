using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using signapay.FileUpload;
using System.Diagnostics;

namespace signapay.Pages
{
    public class ClearCacheModel : PageModel
    {
        private readonly IMemoryCache _cache;

        public ClearCacheModel(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void OnGet()
        {
            Debug.WriteLine("Cleared Cache");
            _cache.Remove("AccountCacheKey");
            _cache.Remove("AccountInfoCacheKey");
            _cache.Remove("SavedTransactionsCacheKey");
            _cache.Remove("BadTransactions");

            Response.Redirect("Index");
        }
    }
}
