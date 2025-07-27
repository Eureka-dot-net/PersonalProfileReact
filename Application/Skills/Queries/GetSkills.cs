using Application.Core;
using Application.Skills.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Skills.Queries
{
    public class GetSkills
    {
        public record GetSkillGroupsQuery : IRequest<Result<List<SkillGroupDto>>>;

        public class Handler : IRequestHandler<GetSkillGroupsQuery, Result<List<SkillGroupDto>>>
        {
            private readonly AppDbContext _context;

            public Handler(AppDbContext context)
            {
                _context = context;
            }

            public async Task<Result<List<SkillGroupDto>>> Handle(GetSkillGroupsQuery request, CancellationToken cancellationToken)
            {
                var groupedSkills = await _context.Skills
                    .Include(s => s.SkillCategory)
                    .GroupBy(s => s.SkillCategory.Title)
                    .Select(g => new SkillGroupDto
                    {
                        Category = g.Key,
                        Skills = g.Select(s => s.Name).ToList()
                    })
                    .ToListAsync(cancellationToken);

                if (groupedSkills == null || groupedSkills.Count == 0)
                    return Result<List<SkillGroupDto>>.Failure("No skills found", 404);

                return Result<List<SkillGroupDto>>.Success(groupedSkills);
            }
        }
    }
}
