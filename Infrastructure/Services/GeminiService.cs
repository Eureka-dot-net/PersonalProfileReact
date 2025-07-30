using Application.Interfaces;
using Application.JobMatch.DTOs;
using Application.Skills.DTOs;
using Domain;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
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
        private const string AiProfileSummary = @"
            Narike Avenant is an IT professional with 17+ years in software development and DevOps. 
            Expert in C#.NET, ASP.NET Core, Entity Framework Core and SQL; solid JavaScript/TypeScript, React, HTML/CSS front‑end skills. 
            Proven track record building and optimizing CI/CD pipelines in Azure DevOps, managing cloud infrastructure (Azure IaaS/PaaS), PowerShell scripting, ARM templates and Desired State Configuration. 
            Key achievements include a 25% faster deployments, £20k monthly Azure cost reduction, and blue/green release automation. 
            Led migrations from TFS to Git, launched first Azure‑hosted Guidewire deployments, and trained junior engineers. 
            Notable projects: personal React + .NET profile site, full‑stack Udemy course app, Stardew Valley NPC Info mod, and a gamified language‑learning mobile app.
        ";

        private readonly string _apiKey;
        private readonly HttpClient _httpClient;

        public GeminiService(IConfiguration config, HttpClient httpClient)
        {
            _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini API key is missing");
            _httpClient = httpClient;
        }

        private string BuildPrompt(string jobDescription)
        {
            var prompt = $$"""
                You are an AI assistant that evaluates how well a candidate matches a software developer job description.

                Use the candidate summary below for evaluation (no need for additional background text):
                ---
                {{AiProfileSummary}}
                ---

                The job description is:
                ---
                {{jobDescription}}
                ---

                Please respond **briefly** and **clearly** in the following JSON format with no extra text:
                {
                  "matchPercentage": number,
                  "explanation": "text"
                }

                - Keep your explanation under 250 words.
                - Use \n for line breaks between paragraphs or key points.
                - Avoid markdown formatting, bullet points, or code blocks.
                - Structure your explanation with clear paragraphs separated by \n\n.
                - Highlight key points concisely in separate sentences.

                """;
            return prompt;
        }

        public async Task<JobMatchDto> GetJobMatchScoreAsync(string jobDescription, List<Experience> experiences, List<SkillGroupDto> skills, CancellationToken cancellationToken)
        {
            var prompt = BuildPrompt(jobDescription);

            var requestBody = new
            {
                contents = new[]
                {
            new
            {
                parts = new[]
                {
                    new { text = prompt }
                }
            }
        }
            };

            var requestJson = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            try
            {
                var request = new HttpRequestMessage(
                    HttpMethod.Post,
                    $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}"
                )
                {
                    Content = content
                };

                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.SendAsync(request, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    return new JobMatchDto
                    {
                        IsSuccess = false,
                        ErrorMessage = $"Gemini API error: {response.StatusCode}"
                    };
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
