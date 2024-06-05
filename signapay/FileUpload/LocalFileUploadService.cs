
namespace signapay.FileUpload
{
    public class LocalFileUploadService : IfileUploadService
    {
        private readonly IHostEnvironment environment;

        public LocalFileUploadService(IHostEnvironment environment)
        {
            this.environment = environment;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var filePath = Path.Combine(environment.ContentRootPath, @"wwwroot\images", file.FileName);
            using var fileStream = new FileStream(filePath, FileMode.Create);

            await file.CopyToAsync(fileStream);
            return filePath;
        }
    }
}
