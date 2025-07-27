using Application.Experience.Queries;
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
            return HandleResult(await Mediator.Send(new GetExperience.GetExperienceListQuery()));
        }
    }
}
