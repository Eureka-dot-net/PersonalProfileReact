using Application.Core;
using Application.Interfaces;
using Application.Skills.DTOs;
using Infrastructure.CV;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// Removed OpenAPI to work with .NET 8.0

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<SkillGroupDto>();
});

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfiles>());

builder.Services.AddHttpClient<IGeminiService, GeminiService>();

builder.Services.AddScoped<ICvFileBuilder, ClaudeDocumentService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Removed OpenAPI to work with .NET 8.0
}

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:3000", "https://localhost:3000"));

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

try
{
    // For test scenarios or when connection string suggests in-memory database, recreate database
    var connectionString = db.Database.GetConnectionString();
    if (app.Environment.IsEnvironment("Testing") || 
        connectionString?.Contains(":memory:") == true || 
        connectionString?.Contains("DataSource=:memory:") == true)
    {
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
    }
    else
    {
        // For development, use EnsureCreated for simplicity until migration issues are resolved
        if (app.Environment.IsDevelopment())
        {
            await db.Database.EnsureCreatedAsync();
        }
        else
        {
            // Use migrations in production
            await db.Database.MigrateAsync();
        }
    }

    // Wait a moment to ensure database operations are complete
    await Task.Delay(100);

    await DbInitialiser.SeedData(db);
}
catch (Exception ex)
{
    Console.WriteLine($"Error initializing database: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
    throw;
}

app.Run();

public partial class Program { }