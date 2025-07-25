﻿using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class AboutMeController(AppDbContext context) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<AboutMe>> Get()
        {
            var about = await context.AboutMe.FirstOrDefaultAsync();
            if (about == null)
            {
                return NotFound();
            }
            return Ok(about);
        }

        [HttpPut]
        public async Task<IActionResult> Update(AboutMe model)
        {
            var existing = await context.AboutMe.FirstOrDefaultAsync();
            if (existing == null)
            {
                model.Id = 1;
                context.AboutMe.Add(model);
            }
            else
            {
                context.Entry(existing).CurrentValues.SetValues(model);
            }

            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}
