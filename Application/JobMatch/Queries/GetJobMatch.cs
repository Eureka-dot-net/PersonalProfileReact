using Application.Experience.Queriess;
using Application.Interfaces;
using Application.JobMatch.Commands;
using Application.JobMatch.DTOs;
using Application.Projects.Queries;
using Application.PromptTemplate.Queries;
using Application.Skills.Queries;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.JobMatch.Queries
{
    public class GetJobMatch
    {
        public record Query(string JobDescription) : IRequest<JobMatchResponseDto> { }

        public class Handler(IGeminiService geminiService, IMediator mediator, ICvFileBuilder builder) : IRequestHandler<Query, JobMatchResponseDto>
        {
            public async Task<JobMatchResponseDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var experienceResult = await mediator.Send(new GetExperience.Query(), cancellationToken);
                if (!experienceResult.IsSuccess)
                    return new JobMatchResponseDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Could not load experience: " +(experienceResult.Error ?? "Unknown error")
                    };

                var experiences = experienceResult.Value!;

                var skillsResult = await mediator.Send(new GetSkills.GetSkillGroupsQuery(), cancellationToken);

                if (!skillsResult.IsSuccess)
                    return new JobMatchResponseDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Could not load skills: " + (skillsResult.Error ?? "Unknown error")
                    };

                var skills = skillsResult.Value!;

                var projectsResult = await mediator.Send(new GetProjects.Query(), cancellationToken);

                if (!projectsResult.IsSuccess)
                    return new JobMatchResponseDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Could not load projects: " + (projectsResult.Error ?? "Unknown error")
                    };
                var projects = projectsResult.Value!;

                var promptResult = await mediator.Send(new GetLatestPromptTemplate.Query(), cancellationToken);

                if (!promptResult.IsSuccess )
                    return new JobMatchResponseDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Could not load prompt template: " + (promptResult.Error ?? "Unknown error")
                    };

                var prompt = promptResult.Value!.Template!;

                var jobMatchResult = await geminiService.GetJobMatchScoreAsync(request.JobDescription, experiences, skills, projects, prompt, cancellationToken);

                if (!jobMatchResult.IsSuccess) return new JobMatchResponseDto
                {
                    IsSuccess = false,
                    IsQuotaExceeded = jobMatchResult.IsQuotaExceeded,
                    RetryAfter = jobMatchResult.RetryAfter,
                    ErrorMessage = "Could not get prompt result: " + (jobMatchResult.ErrorMessage ?? "Unknown error")
                };

                jobMatchResult.TailoredCv.Name = "Narike Avenant";
                jobMatchResult.TailoredCv.Email = "narike@gmail.com";
                jobMatchResult.TailoredCv.Phone = "0512278249";
                jobMatchResult.TailoredCv.LinkedIn = "https://www.linkedin.com/in/narike-avenant-65008037/";
                jobMatchResult.TailoredCv.GitHub = "https://github.com/Eureka-dot-net";
                jobMatchResult.TailoredCv.PersonalWebsite = "https://narike-personalprofile.azurewebsites.net/";

                var tailoredCvBytes = await builder.GenerateDoc(jobMatchResult.TailoredCv, cancellationToken);

                var fileDto = new FileDto
                {
                    FileName = "TailoredCV.docx",
                    ContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    Content = tailoredCvBytes
                };

                var result = new JobMatchResponseDto
                {
                    IsSuccess = true,
                    JobInformation = jobMatchResult.JobInformation,
                    MatchEvaluation = jobMatchResult.MatchEvaluation,
                    TailoredCv = fileDto
                };

                // Save the job match to the database
                try
                {
                    var saveCommand = new SaveJobMatch.Command(
                        JobTitle: jobMatchResult.JobInformation.JobTitle,
                        Company: jobMatchResult.JobInformation.Company,
                        MatchPercentage: (decimal)jobMatchResult.MatchEvaluation.MatchPercentage,
                        JobDescription: request.JobDescription,
                        Requirements: jobMatchResult.JobInformation.Requirements,
                        Salary: jobMatchResult.JobInformation.Salary,
                        Location: jobMatchResult.JobInformation.Location
                    );

                    await mediator.Send(saveCommand, cancellationToken);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request - user still gets their analysis
                    Console.WriteLine($"Warning: Failed to save job match to database: {ex.Message}");
                }

                return result;

            }
        }
    }
}
