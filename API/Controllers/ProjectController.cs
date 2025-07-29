using Application.Projects.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProjectsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetProjects()
        {
            return HandleResult(await Mediator.Send(new GetProjects.Query()));
        }
    }
}
