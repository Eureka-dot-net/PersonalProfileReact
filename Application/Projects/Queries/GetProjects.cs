using Application.Core;
using Application.Projects.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Projects.Queries
{
    public class GetProjects
    {
        public record Query : IRequest<Result<List<ProjectDto>>>;

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<List<ProjectDto>>>
        {
            public async Task<Result<List<ProjectDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var projects = await context.Projects
                    .Include(p => p.Images)
                    .OrderBy(p => p.Id) // Optional: Show in-progress projects first
                    .ThenBy(p => p.Name)
                    .Select(p => new ProjectDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Url = p.Url,
                        GitHubRepo = p.GitHubRepo,
                        IsInProgress = p.IsInProgress,
                        Images = p.Images.Select(i => i.Url).ToList()
                    })
                    .ToListAsync(cancellationToken);

                return Result<List<ProjectDto>>.Success(projects);
            }
        }
    }
}
