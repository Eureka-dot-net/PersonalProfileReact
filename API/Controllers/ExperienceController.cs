using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ExperienceController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Experience>>> Get()
        {
            var experiences = await context.Experiences
                .OrderByDescending(e => e.EndDate ?? DateTime.MaxValue)
                .ThenByDescending(e => e.StartDate)
                .ToListAsync();
            if (experiences == null || experiences.Count == 0)
            {
                return NotFound();
            }

            return Ok(experiences);
        }
    }
}
