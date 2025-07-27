using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Experience.Queries
{
    public class GetExperience
    {
        public record GetExperienceListQuery : IRequest<Result<List<Domain.Experience>>>;

        public class Handler : IRequestHandler<GetExperienceListQuery, Result<List<Domain.Experience>>>
        {
            private readonly AppDbContext _context;

            public Handler(AppDbContext context)
            {
                _context = context;
            }

            public async Task<Result<List<Domain.Experience>>> Handle(GetExperienceListQuery request, CancellationToken cancellationToken)
            {
                var experiences = await _context.Experiences
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
