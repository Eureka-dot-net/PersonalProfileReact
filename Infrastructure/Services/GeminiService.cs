using Application.Extensions;
using Application.Interfaces;
using Application.JobMatch.DTOs;
using Application.Projects.DTOs;
using Application.PromptTemplate.Queries;
using Application.Skills.DTOs;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    // TODO: Handle case when IsQuotaExceeded is true — display a user-friendly message and use RetryAfter to suggest when to try again

    // TODO: Surface the matchPercentage and explanation clearly in the client UI (e.g., progress bar, detailed text)

    // TODO: Save the prompt template and related config to the database to allow dynamic updates without redeployment

    // TODO: Enhance prompt wording to improve AI evaluation and explanation quality based on user feedback

    // TODO: Add proper logging and telemetry for API calls (success, failures, response times) to monitor performance and usage

    // TODO: Refactor this method into smaller functions for better readability and easier unit testing (e.g., separate prompt building, API call, response parsing)

    public class GeminiService : IGeminiService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;

        public GeminiService(IConfiguration config, HttpClient httpClient, ISender sender)
        {
            _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini API key is missing");
            _httpClient = httpClient;
        }

        private async Task<string> BuildPrompt(string jobDescription, List<Experience> experiences, List<SkillGroupDto> skills, List<ProjectDto> projects, string prompt)
        {
            string experienceSummary = GetExperienceSummary(experiences);
            string skillsSummary = GetSkillSummary(skills);
            string projectSummary = GetProjectSummary(projects);

            return prompt
                .Replace(@"{{experienceSummary}}", experienceSummary)
                .Replace(@"{{skillsSummary}}", skillsSummary)
                .Replace(@"{{jobDescription}}", jobDescription)
                .Replace(@"{{projectSummary}}", projectSummary);

        }

        private static string GetSkillSummary(List<SkillGroupDto> skills)
        {
            return string.Join("\n", skills.Select(s =>
                $"- {s.Category}: {string.Join(", ", s.Skills)}"));
        }

        private static string GetProjectSummary(List<ProjectDto> projects)
        {
            return string.Join("\n\n", projects.Select(p =>
            {
                var lines = new List<string>
                {
                    $"- **{p.Name}**",
                    $"  Description: {p.Description}"
                };

                if (!string.IsNullOrWhiteSpace(p.Url))
                    lines.Add($"  Live URL: {p.Url}");

                if (!string.IsNullOrWhiteSpace(p.GitHubRepo))
                    lines.Add($"  GitHub: {p.GitHubRepo}");

                if (p.IsInProgress)
                    lines.Add("  Status: In progress");

                return string.Join("\n", lines);
            }));
        }

        private static string GetExperienceSummary(List<Experience> experiences)
        {
            return string.Join("\n\n", experiences.Select(e =>
                $"- {e.Title} at {e.Company} ({e.StartDate:yyyy-MM} to {(e.EndDate?.ToString("yyyy-MM")
                ?? "Present")}):\n  {string.Join("\n  ", e.Highlights)}"));
        }

        // Add this private helper method to your class
        private async Task<HttpResponseMessage> SendRequestWithRetries(
            HttpRequestMessage request,
            CancellationToken cancellationToken,
            int maxRetries = 3,
            int initialDelayMilliseconds = 1000) // 1 second
        {
            int currentRetry = 0;
            while (currentRetry < maxRetries)
            {
                var response = await _httpClient.SendAsync(request, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    return response;
                }

                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                {
                    // Extract Retry-After header if present
                    int retryAfterSeconds = 0;
                    if (response.Headers.TryGetValues("Retry-After", out IEnumerable<string>? retryAfterValues))
                    {
                        if (int.TryParse(retryAfterValues.FirstOrDefault(), out int seconds))
                        {
                            retryAfterSeconds = seconds;
                        }
                    }

                    // Use Retry-After if provided, otherwise exponential backoff
                    int delay = retryAfterSeconds > 0
                        ? retryAfterSeconds * 1000 // Convert to milliseconds
                        : initialDelayMilliseconds * (int)Math.Pow(2, currentRetry);

                    Console.WriteLine($"Rate limit hit (429). Retrying in {delay / 1000} seconds. Attempt {currentRetry + 1}/{maxRetries}");
                    await Task.Delay(delay, cancellationToken);

                    currentRetry++;
                    // Important: Recreate the HttpRequestMessage for each retry
                    // The HttpRequestMessage can only be sent once.
                    request = request.Clone();
                }
                else if (response.StatusCode == HttpStatusCode.ServiceUnavailable) // 503
                {
                    // For 503, also apply exponential backoff, but don't count it as a quota exceed.
                    int delay = initialDelayMilliseconds * (int)Math.Pow(2, currentRetry);
                    Console.WriteLine($"Service Unavailable (503). Retrying in {delay / 1000} seconds. Attempt {currentRetry + 1}/{maxRetries}");
                    await Task.Delay(delay, cancellationToken);
                    currentRetry++;
                    request = request.Clone(); // Recreate request
                }
                else
                {
                    // For other non-success status codes, don't retry, just return the response
                    return response;
                }
            }

            // If all retries fail, return the last response
            return await _httpClient.SendAsync(request, cancellationToken); // Re-send one last time or return the last failed response
                                                                            // For simplicity, here we send it one last time, but you might want to return the last `response` from the loop.
        }

        public async Task<JobMatchDto> GetJobMatchScoreAsync(string jobDescription, List<Experience> experiences, List<SkillGroupDto> skills, List<ProjectDto> projects, string prompt, CancellationToken cancellationToken)
        {
            var requestprompt = await BuildPrompt(jobDescription, experiences, skills, projects, prompt);

            var requestBody = new
            {
                contents = new[]
                {
            new
            {
                parts = new[]
                {
                    new { text = requestprompt }
                }
            }
        }
            };

            var requestJson = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}"
            )
            {
                Content = content
            };

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            try
            {
                // Use the new helper method for sending the request with retries
                var response = await SendRequestWithRetries(request, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    // Handle 429 specifically
                    if (response.StatusCode == HttpStatusCode.TooManyRequests)
                    {
                        int? retryAfterSeconds = null;
                        if (response.Headers.TryGetValues("Retry-After", out IEnumerable<string>? retryAfterValues))
                        {
                            if (int.TryParse(retryAfterValues.FirstOrDefault(), out int seconds))
                            {
                                retryAfterSeconds = seconds;
                            }
                        }

                        return new JobMatchDto
                        {
                            IsSuccess = false,
                            IsQuotaExceeded = true, // Indicate that quota was exceeded
                            RetryAfter = retryAfterSeconds + " seconds",
                            ErrorMessage = "Gemini API rate limit exceeded. Please try again later."
                        };
                    }
                    else if (response.StatusCode == HttpStatusCode.ServiceUnavailable) // 503
                    {
                        // This case should be mostly handled by the retry logic in SendRequestWithRetries,
                        // but if it still fails after max retries, you'll reach here.
                        return new JobMatchDto
                        {
                            IsSuccess = false,
                            ErrorMessage = $"Gemini API service unavailable after multiple retries. ({response.StatusCode})"
                        };
                    }
                    else
                    {
                        // General error handling for other non-success status codes
                        return new JobMatchDto
                        {
                            IsSuccess = false,
                            ErrorMessage = $"Gemini API error: {response.StatusCode}"
                        };
                    }
                }

                var responseText = await response.Content.ReadAsStringAsync();

                using var json = JsonDocument.Parse(responseText);

               
                var rawText = json.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                if (string.IsNullOrWhiteSpace(rawText))
                {
                    return new JobMatchDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Empty response from Gemini"
                    };
                }

                var cleanedText = rawText?
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();

                var match = JsonSerializer.Deserialize<JobMatchDto>(cleanedText!, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (match == null)
                {
                    return new JobMatchDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Failed to deserialize Gemini response"
                    };
                }

                match.IsSuccess = true;
                return match;
            }
            catch (Exception ex)
            {
                return new JobMatchDto
                {
                    IsSuccess = false,
                    ErrorMessage = $"Exception: {ex.Message}"
                };
            }
        }

    }
}
