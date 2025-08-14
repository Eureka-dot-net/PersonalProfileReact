using Application.Core;
using Application.JobMatch.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.JobMatch.Queries
{
    public class GetJobMatches
    {
        public record Query(JobMatchFilterDto Filter) : IRequest<Result<JobMatchListResponseDto>>;

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<JobMatchListResponseDto>>
        {
            public async Task<Result<JobMatchListResponseDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var filter = request.Filter;
                
                var query = context.JobMatches.AsQueryable();

                // Apply filters
                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    var searchTerm = filter.SearchTerm.ToLower();
                    query = query.Where(jm => 
                        jm.JobTitle.ToLower().Contains(searchTerm) ||
                        jm.Company.ToLower().Contains(searchTerm) ||
                        (jm.JobDescription != null && jm.JobDescription.ToLower().Contains(searchTerm)) ||
                        (jm.Location != null && jm.Location.ToLower().Contains(searchTerm)));
                }

                if (filter.MinMatchPercentage.HasValue)
                {
                    query = query.Where(jm => jm.MatchPercentage >= filter.MinMatchPercentage.Value);
                }

                if (!string.IsNullOrWhiteSpace(filter.Status))
                {
                    query = query.Where(jm => jm.Status == filter.Status);
                }

                if (!string.IsNullOrWhiteSpace(filter.Company))
                {
                    query = query.Where(jm => jm.Company.ToLower().Contains(filter.Company.ToLower()));
                }

                if (filter.FromDate.HasValue)
                {
                    query = query.Where(jm => jm.MatchedDate >= filter.FromDate.Value);
                }

                if (filter.ToDate.HasValue)
                {
                    query = query.Where(jm => jm.MatchedDate <= filter.ToDate.Value);
                }

                // Get total count before pagination
                var totalCount = await query.CountAsync(cancellationToken);

                // Apply pagination
                var skip = (filter.Page - 1) * filter.PageSize;
                var jobMatches = await query
                    .OrderByDescending(jm => jm.MatchedDate)
                    .Skip(skip)
                    .Take(filter.PageSize)
                    .Select(jm => new JobMatchListDto
                    {
                        Id = jm.Id,
                        JobTitle = jm.JobTitle,
                        Company = jm.Company,
                        MatchPercentage = jm.MatchPercentage,
                        Salary = jm.Salary,
                        Location = jm.Location,
                        MatchedDate = jm.MatchedDate,
                        Status = jm.Status,
                        JobUrl = jm.JobUrl,
                        CreatedAt = jm.CreatedAt
                    })
                    .ToListAsync(cancellationToken);

                var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

                var response = new JobMatchListResponseDto
                {
                    JobMatches = jobMatches,
                    TotalCount = totalCount,
                    Page = filter.Page,
                    PageSize = filter.PageSize,
                    TotalPages = totalPages
                };

                return Result<JobMatchListResponseDto>.Success(response);
            }
        }
    }
}