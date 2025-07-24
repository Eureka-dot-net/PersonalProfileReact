using Application.Skills.DTOs;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class SkillsController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<SkillGroupDto>>> Get()
        {
            var groupedSkills = await context.Skills
                .Include(s => s.SkillCategory)
                .GroupBy(s => s.SkillCategory.Title)
                .Select(g => new SkillGroupDto
                {
                    Category = g.Key,
                    Skills = g.Select(s => s.Name).ToList()
                })
                .ToListAsync();

            if (groupedSkills.Count == 0)
            {
                return NotFound();
            }

            return Ok(groupedSkills);
        }
    }
}