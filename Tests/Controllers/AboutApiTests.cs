using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Tests.Controllers
{
    public class AboutApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public AboutApiTests(WebApplicationFactory<Program> factory)
        {
            var customFactory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove the existing DbContext registration
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Add an in-memory database for testing
                    var connection = new SqliteConnection("DataSource=:memory:");
                    connection.Open();
                    
                    services.AddDbContext<AppDbContext>(options =>
                        options.UseSqlite(connection));
                });
            });
            
            _client = customFactory.CreateClient();
        }

        [Fact]
        public async Task GetAbout_ReturnsSuccessAndContainsName()
        {
            var response = await _client.GetAsync("/api/aboutme");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();

            content.Should().Contain("Narike Avenant");
        }
    }
}