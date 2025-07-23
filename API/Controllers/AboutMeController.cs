using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class AboutMeController : BaseApiController
    {
        private readonly AppDbContext _context;

        public AboutMeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<AboutMe>> Get()
        {
            var about = await _context.AboutMe.FirstOrDefaultAsync();
            if (about == null)
            {
                return NotFound();
            }
            return Ok(about);
        }

        [HttpPut]
        public async Task<IActionResult> Update(AboutMe model)
        {
            var existing = await _context.AboutMe.FirstOrDefaultAsync();
            if (existing == null)
            {
                model.Id = 1;
                _context.AboutMe.Add(model);
            }
            else
            {
                _context.Entry(existing).CurrentValues.SetValues(model);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
