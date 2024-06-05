using Microsoft.AspNetCore.Http;

namespace signapay.FileUpload
{
    public interface IfileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file);
    }
}
