using CsvHelper;
using CsvHelper.Configuration;
using DataReader.Models;
using DataReader.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Formats.Asn1;
using System.Globalization;

namespace DataReader.Controllers
{
    public class HomeController : Controller
    {
        private readonly IInMemoryCache _cache;

        public HomeController(IInMemoryCache cache)
        {
            _cache = cache;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

      

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult ExcelFileReader()
        { return View(); }

        [HttpPost("upload")]
        public async Task<IActionResult> CsvFileReader(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                var uploadDirectory = $"{Directory.GetCurrentDirectory()}\\wwwroot\\Uploads";

                if (!Directory.Exists(uploadDirectory))
                {
                    Directory.CreateDirectory(uploadDirectory);
                }

                var filePath = Path.Combine(uploadDirectory, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Process the CSV file
                using (var reader = new StreamReader(filePath))
                using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)))
                {
                    csv.Context.RegisterClassMap<CsvRecordMap>();
                    while (csv.Read())
                    {
                        try
                        {
                            var record = csv.GetRecord<CsvRecord>();

                            // Process record
                            var account = _cache.Accounts.FirstOrDefault(a => a.Name == record.AccountName) ??
                                          new Account { Name = record.AccountName };

                            var card = account.Cards.FirstOrDefault(c => c.Number == record.CardNumber) ??
                                       new Card { Number = record.CardNumber };

                            card.Balance += record.TransactionType.ToLower() == "credit" ? record.Amount : -record.Amount;

                            if (card.Balance < 0)
                            {
                                var existingCollectionAccount = _cache.Collections.FirstOrDefault(a => a.Name == account.Name);
                                if (existingCollectionAccount == null)
                                {
                                    _cache.Collections.Add(account);
                                }
                            }

                            if (!account.Cards.Contains(card))
                            {
                                account.Cards.Add(card);
                            }

                            if (!_cache.Accounts.Contains(account))
                            {
                                _cache.Accounts.Add(account);
                            }
                        }
                        catch (Exception ex)
                        {
                            _cache.BadTransactions.Add(new BadTransaction
                            {
                                TransactionId = Guid.NewGuid().ToString(),
                                Details = ex.Message
                            });
                        }
                    }
                }
            }

            return RedirectToAction("Report");
        }

        public IActionResult Report()
        {
            ViewBag.Accounts = _cache.Accounts;
            ViewBag.Collections = _cache.Collections;
            ViewBag.BadTransactions = _cache.BadTransactions;

            return View();
        }


        public sealed class CsvRecordMap : ClassMap<CsvRecord>
        {
            public CsvRecordMap()
            {
                Map(m => m.AccountName).Index(0);
                Map(m => m.CardNumber).Index(1);
                Map(m => m.Amount).Index(2);
                Map(m => m.TransactionType).Index(3);
                Map(m => m.TransactionDetails).Index(4);
                Map(m => m.RelatedCardNumber).Index(5).Optional();
            }
        }
    }
}