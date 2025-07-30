using Application.Experience.Queriess;
using Application.Interfaces;
using Application.JobMatch.DTOs;
using Application.Skills.Queries;
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
        public record Query(string JobDescription) : IRequest<JobMatchDto> { }

        public class Handler(IGeminiService geminiService, IMediator mediator) : IRequestHandler<Query, JobMatchDto>
        {
            public async Task<JobMatchDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var experienceResult = await mediator.Send(new GetExperience.Query(), cancellationToken);
                if (!experienceResult.IsSuccess)
                    return new JobMatchDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Could not load experience: " +(experienceResult.Error ?? "Unknown error")
                    };

                var experiences = experienceResult.Value!;

                var skillsResult = await mediator.Send(new GetSkills.GetSkillGroupsQuery(), cancellationToken);

                if (!skillsResult.IsSuccess)
                    return new JobMatchDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "Could not load skills: " + (skillsResult.Error ?? "Unknown error")
                    };

                var skills = skillsResult.Value!;

                var jobMatchResult = await geminiService.GetJobMatchScoreAsync(request.JobDescription, experiences, skills, cancellationToken);

                return jobMatchResult;

            }
        }
    }
}
