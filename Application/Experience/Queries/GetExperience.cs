using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Experience.Queriess
{
    public class GetExperience
    {
        public record Query : IRequest<Result<List<Domain.Experience>>>;

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<List<Domain.Experience>>>
        {
            public async Task<Result<List<Domain.Experience>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var experiences = await context.Experiences
                    .OrderByDescending(e => e.EndDate ?? DateTime.MaxValue)
                    .ThenByDescending(e => e.StartDate)
                    .ToListAsync(cancellationToken);

                if (experiences == null || experiences.Count == 0)
                    return Result<List<Domain.Experience>>.Failure("No experiences found", 404);

                return Result<List<Domain.Experience>>.Success(experiences);
            }
        }
    }
}
