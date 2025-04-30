using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SignaPayProcessor.Services;

namespace SignaPayProcessor.Pages;
    public class UploadFileModel(IFileService fileService): PageModel
    {        
        private readonly IFileService _fileService = fileService;
        public string FilePath = string.Empty;

        public void OnGet()
        {

        }

        public async Task<IActionResult> OnPost(IFormFile transactionsfile)
        {
            try
            {   if(transactionsfile == null || transactionsfile.Length == 0)
                {      
                    Console.WriteLine("File is null or empty");                 
                    return RedirectToPage("./UploadFile");
                }
                FilePath = await _fileService.UploadFileAsync(transactionsfile);                
               
                // Process the file (e.g., read and save transactions to the database)
                bool isProcessed = await _fileService.ProcessFileAsync(FilePath);                
            }
            catch (Exception ex)
            {
                // Handle file upload failure   
                // Log the error or display a message to the user    
                Console.WriteLine($"File upload failed: {ex.Message}");         
                return RedirectToPage("./UploadFile");
            }
            return RedirectToPage("./Transaction/Index");
        }
    }

