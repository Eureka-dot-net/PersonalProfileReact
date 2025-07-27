using Application.Skills.DTOs;
using Application.Skills.Queries;
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
            return HandleResult(await Mediator.Send(new GetSkills.GetSkillGroupsQuery()));
        }
    }
}