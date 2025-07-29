using Application.Core;
using Application.Projects.DTOs;
using AutoMapper;
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

        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<List<ProjectDto>>>
        {
            public async Task<Result<List<ProjectDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var projects = await context.Projects
                    .Include(p => p.Images)
                    .OrderBy(p => p.Id) // Optional: Show in-progress projects first
                    .ThenBy(p => p.Name)
                    .ToListAsync(cancellationToken);

                var result = mapper.Map<List<ProjectDto>>(projects);

                return Result<List<ProjectDto>>.Success(result);
            }
        }
    }
}
