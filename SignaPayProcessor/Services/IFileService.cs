using System.Threading.Tasks;
using SignaPayProcessor.Models;
using System.Collections.Generic;

namespace SignaPayProcessor.Services
{
    public interface IFileService
    {
        Task<bool> ProcessFileAsync(string filePath);
        Task<string> UploadFileAsync(IFormFile file);
        bool DeleteFile(string filePath);
        Dictionary<string,string> GetListFiles();        
    }
}