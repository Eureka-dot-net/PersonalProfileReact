using Application.Experience.Queriess;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ExperienceController: BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Experience>>> Get()
        {
            return HandleResult(await Mediator.Send(new GetExperience.Query()));
        }
    }
}
