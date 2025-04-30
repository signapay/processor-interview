using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SignaPayProcessor.Data;
using SignaPayProcessor.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddDbContext<TransactionContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("TransactionContext") ?? throw new InvalidOperationException("Connection string 'TransactionContext' not found.")));
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

//Add logging services
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventSourceLogger();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
