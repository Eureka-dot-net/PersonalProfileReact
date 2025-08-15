using Application.Skills.DTOs;
using Application.Skills.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SkillsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<SkillGroupDto>>> Get()
        {
            return HandleResult(await Mediator.Send(new GetSkills.GetSkillGroupsQuery()));
        }
    }
}