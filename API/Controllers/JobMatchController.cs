using Application.JobMatch.DTOs;
using Application.JobMatch.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class JobMatchController : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<JobMatchDto>> Post([FromBody] string jobDescription)
        {
            if (string.IsNullOrWhiteSpace(jobDescription))
                return BadRequest("Job description cannot be empty.");

            var result = await Mediator.Send(new GetJobMatch.Query(jobDescription));

            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok(result);
        }
    }
}
