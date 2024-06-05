using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using signapay.FileUpload;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Transactions;
using static System.Formats.Asn1.AsnWriter;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace signapay.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IfileUploadService ifileUploadService;

        public string FilePath;

        public Dictionary<string, Dictionary<string, double>> accountInfo = new Dictionary<string, Dictionary<string, double>>();

        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
        public List<Transaction> BadTransactions { get; set; } = new List<Transaction>();

        public List<string> accounts = new List<string>();


        public IndexModel(ILogger<IndexModel> logger, IfileUploadService ifileUploadService)
        {
            _logger = logger;
            this.ifileUploadService = ifileUploadService;
        }

        public void OnGet()
        {

        }

        public async void OnPost(IFormFile file)
        {
            if (file != null)
            {
                FilePath = await ifileUploadService.UploadFileAsync(file);

                int x = 0;
                using (var reader = new StreamReader(FilePath))
                {
                    while (reader.EndOfStream == false)
                    {
                        var content = reader.ReadLine();
                        var cells = content.Split(',').ToList();
                        if (RowHasData(cells))
                        {
                            if (string.IsNullOrEmpty(cells[0]) || string.IsNullOrEmpty(cells[1]) || string.IsNullOrEmpty(cells[3]) || string.IsNullOrEmpty(cells[4]))
                            {
                                Debug.WriteLine("Bad!");
                                Debug.WriteLine(cells[0]);
                                BadTransactions.Add(new Transaction { AccountName = cells[0], CardNumber = cells[1], TransactionAmount = cells[2], TransactionType = cells[3], Description = cells[4], TargetCardNumber = cells[5] });

                            }
                            else
                            {
                                Debug.WriteLine("Good!");
                                Debug.WriteLine(cells[0]);
                                Transactions.Add(new Transaction { AccountName = cells[0], CardNumber = cells[1], TransactionAmount = cells[2], TransactionType = cells[3], Description = cells[4], TargetCardNumber = cells[5] });

                                if (!accounts.Contains(cells[0]))
                                {
                                    accounts.Add(cells[0]);
                                }
                            }
                            
                        }

                    }

                    foreach (var item in Transactions)
                    {
                        Dictionary<string, double> cardInfo = new Dictionary<string, double>();
                        if (!accountInfo.ContainsKey(item.AccountName))
                        {
                            double transactionAmount = 0;
                            if (double.TryParse(item.TransactionAmount, out transactionAmount))
                            {
                                cardInfo.Add(item.CardNumber, transactionAmount);
                            }
                            accountInfo.Add(item.AccountName, cardInfo);
                        }
                        else
                        {
                            if (!accountInfo[item.AccountName].ContainsKey(item.CardNumber))
                            {
                                double transactionAmount = 0;
                                if (double.TryParse(item.TransactionAmount, out transactionAmount))
                                {
                                    foreach (var moreInfo in accountInfo[item.AccountName])
                                    {
                                        cardInfo.Add(moreInfo.Key, moreInfo.Value);
                                    }
                                    cardInfo.Add(item.CardNumber, transactionAmount);

                                    accountInfo[item.AccountName] = cardInfo;

                                }
                            }
                            else
                            {
                                double val;
                                if (accountInfo[item.AccountName].TryGetValue(item.CardNumber, out val))
                                {
                                    double transactionAmount = 0;
                                    if (double.TryParse(item.TransactionAmount, out transactionAmount))
                                    {
                                        accountInfo[item.AccountName][item.CardNumber] = val + transactionAmount;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        static bool RowHasData(List<string> cells)
        {
            return cells.Any(x => x.Length > 0);
        }
    }
    public class Transaction
    {
        public string AccountName { get; set; }
        public string CardNumber { get; set; }
        public string TransactionAmount { get; set; }
        public string TransactionType { get; set; }
        public string Description { get; set; }
        public string TargetCardNumber { get; set; }
    }
}