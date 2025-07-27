using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.About.Queries
{
    public class GetAboutMe
    {
        public record Query : IRequest<Result<AboutMe>>;

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<AboutMe>>
        {
            public async Task<Result<AboutMe>> Handle(Query request, CancellationToken cancellationToken)
            {
                var about = await context.AboutMe.FirstOrDefaultAsync(cancellationToken);

                return about is null
                    ? Result<AboutMe>.Failure("AboutMe profile not found.", 404)
                    : Result<AboutMe>.Success(about);
            }
        }
    }
}
