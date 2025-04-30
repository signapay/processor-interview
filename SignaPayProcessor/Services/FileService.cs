using SignaPayProcessor.Data;
using SignaPayProcessor.Models;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Xml;

namespace SignaPayProcessor.Services
{      
    public class FileService : IFileService
    {
        private readonly string _storagePath;
        private readonly ILogger<FileService> _logger;
        private readonly TransactionContext _context;
        private readonly ITransactionService _transactionService;

        public FileService(IWebHostEnvironment webHostEnvironment, ILogger<FileService> logger, TransactionContext context, ITransactionService transactionService)
        {
            _transactionService = transactionService;
            _storagePath = Path.Combine(webHostEnvironment.ContentRootPath, "UploadedFiles");
            _logger = logger;
            _context = context;

            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                _logger.LogError("Uploaded File is null or empty: {FileName}", file?.FileName);
                throw new ArgumentException("File is null or empty", nameof(file));
            }

            var filePath = Path.Combine(_storagePath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }

        public async Task<bool> ProcessFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                _logger.LogError("File path is null or empty.");
                return false;                
            }
            if (!File.Exists(filePath))
            {
                _logger.LogError("File does not exist: {FilePath}", filePath);
                return false;                
            }

            var fileExtension = Path.GetExtension(filePath).ToLower();
            List<Transaction> transactions = fileExtension switch
            {
                ".csv" => ReadCsvFile(filePath),
                ".json" => ReadJsonFile(filePath),
                ".xml" => ReadXmlFile(filePath),
                _ => throw new NotSupportedException($"File type {fileExtension} is not supported.")
            };
            if (transactions == null || transactions.Count == 0)
            {
                _logger.LogError("No transactions found in the file: {FilePath}", filePath);
                return false;
            }

            // SaveTransactionsToDatabase(transactions);            
            foreach (var transaction in transactions)
            {
                transaction.CardType = _transactionService.GetCardType(transaction);                
                // Check for duplicate Timestamp
                if (_context.Transaction.Any(t => t.TimeStamp == transaction.TimeStamp))
                {
                    _logger.LogWarning("Duplicate transaction detected with Timestamp: {TimeStamp}", transaction.TimeStamp);
                    continue; // Skip this transaction
                }

                _context.Transaction.Add(transaction);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private static List<Transaction> ReadCsvFile(string filePath)
        {
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                HeaderValidated = null,
                MissingFieldFound = null             
            });
            csv.Context.RegisterClassMap<TransactionMap>();
            List<Transaction> transactions = csv.GetRecords<Transaction>().ToList();
            return transactions;
        }

        private List<Transaction> ReadJsonFile(string filePath)
        {
            var jsonContent = File.ReadAllText(filePath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            options.Converters.Add(new StringToLongConverter());
            List<Transaction> transactions = JsonSerializer.Deserialize<List<Transaction>>(jsonContent, options) ?? [];
            return transactions;
        }

        private List<Transaction> ReadXmlFile(string filePath)
        {
            List<Transaction> final = [];
            XmlDocument xmlDoc = new();
            xmlDoc.Load(filePath);
            XmlNodeList transactionNodes = xmlDoc.GetElementsByTagName("transaction");
            if(transactionNodes !=null)
            {
                foreach(XmlNode transaction in transactionNodes)
                {       
                    var timeStampNode = transaction.SelectSingleNode("timestamp");
                    if (timeStampNode == null || !DateTime.TryParse(timeStampNode.InnerText, out var timeStamp))
                    {
                        throw new InvalidOperationException("Invalid or missing TimeStamp in XML transaction.");
                    } 
                    var amountNode = transaction.SelectSingleNode("amount");
                    if (amountNode == null || !decimal.TryParse(amountNode.InnerText, out var amount))
                    {
                        throw new InvalidOperationException("Invalid or missing Amount in XML transaction.");
                    }
                    var cardNumberNode = transaction.SelectSingleNode("cardNumber");
                    if (cardNumberNode == null || !long.TryParse(cardNumberNode.InnerText, out var cardNumber))
                    {
                        throw new InvalidOperationException("Invalid or missing CardNumber in XML transaction.");
                    }                 
                    var t = new Transaction
                    {                       
                        TimeStamp = timeStamp,
                        Amount = amount,
                        CardNumber = cardNumber,
                        CardType = string.Empty
                    };
                    final.Add(t);                         
                } 
            }           
            else
            {
                _logger.LogError("No transaction found in XML file: {FilePath}", filePath);
                throw new InvalidOperationException("No transaction found in XML file.");
            }
            return final;
        }

        public Dictionary<string,string> GetListFiles()
        {
            var files = Directory.GetFiles(_storagePath);
            var fileList = new Dictionary<string, string>();
            foreach (var file in files)
            {
                var fileName = Path.GetFileName(file);
                fileList.Add(fileName, file);
            }
            return fileList;
        } 

        public bool DeleteFile(string filepath)
        {
           
            if (File.Exists(filepath))
            {
                File.Delete(filepath);
                return true;
            }
            return false; 
        }    
    }    
    
    public sealed class TransactionMap : ClassMap<Transaction>
    {
        public TransactionMap()
        {
            Map(m => m.TimeStamp).Name("timestamp");
            Map(m => m.Amount).Name("amount");
            Map(m => m.CardNumber).Name("cardNumber");
            Map(m => m.CardType).Ignore();            
        }
    }

    public class StringToLongConverter : JsonConverter<long>
    {
        public override long Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String && long.TryParse(reader.GetString(), out var value))
            {
                return value;
            }
            else if (reader.TokenType == JsonTokenType.Number)
            {
                return reader.GetInt64();
            }
            throw new JsonException("Invalid value for long type.");
        }

        public override void Write(Utf8JsonWriter writer, long value, JsonSerializerOptions options)
        {
            writer.WriteNumberValue(value);
        }
    }  
}