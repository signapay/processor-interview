using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SignaPayProcessor.Services;

namespace SignaPayProcessor.Pages;

public class IndexModel(ILogger<IndexModel> logger, IFileService fileService) : PageModel
{
    private readonly ILogger<IndexModel> _logger = logger;
    private readonly IFileService _fileService = fileService;
    public Dictionary<string,string> files = new Dictionary<string,string>();    

    public void OnGet()
    {
       files = _fileService.GetListFiles();
    }

    public async Task<IActionResult> OnPostAsync(string filepath)
    {
        try
        {   
            if (string.IsNullOrEmpty(filepath))
            {
                _logger.LogWarning("No filepath or filepath is empty.");
                return RedirectToPage("./Index");
            }

            // Process the file (e.g., read and save transactions to the database)
            bool isProcessed = await _fileService.ProcessFileAsync(filepath);
            if (isProcessed)
            {
                _logger.LogInformation("File processed successfully: {filepath}", filepath);
            }
            else
            {
                _logger.LogError("File processing failed: {filepath}", filepath);
            }
        }
        catch (Exception ex)
        {
            // Handle file upload failure
            _logger.LogError("File upload and or processing ({filepath}) failed: {Error}", filepath, ex.Message);
        }

        return RedirectToPage("./Transactions/Index");
    }
    
    public IActionResult OnPostDelete(string id)
    {
        string filepath = id;
        try
        {   if((filepath == null) || (filepath.Length == 0) )
            {
                _logger.LogWarning("No filepath or filepath is empty.");
                return RedirectToPage("./Index");
            }
            
            // Process the file (e.g., read and save transactions to the database)
            bool isDeleted = _fileService.DeleteFile(filepath);
            if (isDeleted)
            {
                _logger.LogInformation("File deleted successfully: {filepath}", filepath);
            }
            else
            {
                _logger.LogError("File delete failed: {filepath}", filepath);
            }

            return RedirectToPage("./Index");
        }
        catch (Exception ex)
        {
            // Handle file upload failure
            _logger.LogError("File delete ({filepath}) failed: {Error}", filepath, ex.Message);
        }
        return RedirectToPage("./Index");
    }
}
