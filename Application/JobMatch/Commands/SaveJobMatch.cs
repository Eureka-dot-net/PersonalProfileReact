using Application.Core;
using MediatR;
using Persistence;

namespace Application.JobMatch.Commands
{
    public class SaveJobMatch
    {
        public record Command(
            string JobTitle,
            string Company,
            decimal MatchPercentage,
            string? JobDescription = null,
            string? Requirements = null,
            string? Salary = null,
            string? Location = null,
            string? ExternalJobId = null,
            string? JobUrl = null
        ) : IRequest<Result<Guid>>;

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Guid>>
        {
            public async Task<Result<Guid>> Handle(Command request, CancellationToken cancellationToken)
            {
                var jobMatch = new Domain.JobMatch
                {
                    Id = Guid.NewGuid(),
                    UserId = Guid.Empty, // For now, we'll use a default user ID
                    JobTitle = request.JobTitle,
                    Company = request.Company,
                    MatchPercentage = request.MatchPercentage,
                    JobDescription = request.JobDescription,
                    Requirements = request.Requirements,
                    Salary = request.Salary,
                    Location = request.Location,
                    MatchedDate = DateTime.UtcNow,
                    Status = "New",
                    ExternalJobId = request.ExternalJobId,
                    JobUrl = request.JobUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                context.JobMatches.Add(jobMatch);
                await context.SaveChangesAsync(cancellationToken);

                return Result<Guid>.Success(jobMatch.Id);
            }
        }
    }
}