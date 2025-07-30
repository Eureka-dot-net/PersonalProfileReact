using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.PromptTemplate.Queries
{
    public class GetLatestPromptTemplate
    {
        public record Query(string Name = "Job Match Evaluation") : IRequest<Result<Domain.PromptTemplate>>;

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<Domain.PromptTemplate>>
        {
            public async Task<Result<Domain.PromptTemplate>> Handle(Query request, CancellationToken cancellationToken)
            {
                var template = await context.PromptTemplates
                    .Where(pt => pt.Name == request.Name)
                    .OrderByDescending(pt => pt.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (template == null)
                    return Result<Domain.PromptTemplate>.Failure("Prompt template not found.", 404);
                return Result<Domain.PromptTemplate>.Success(template);
            }
        }
    }
}
