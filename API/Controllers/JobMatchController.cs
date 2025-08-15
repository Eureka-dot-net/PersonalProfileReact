using Application.JobMatch.DTOs;
using Application.JobMatch.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class JobMatchController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<JobMatchListResponseDto>> GetJobMatches([FromQuery] JobMatchFilterDto filter)
        {
            var result = await Mediator.Send(new GetJobMatches.Query(filter));

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result.Value);
        }

        [HttpPost]
        public async Task<ActionResult<JobMatchResponseDto>> Post([FromBody] string jobDescription)
        {

            if (string.IsNullOrWhiteSpace(jobDescription))
                return BadRequest("Job description cannot be empty.");

            var result = await Mediator.Send(new GetJobMatch.Query(jobDescription));

            //if (!result.IsSuccess)
            //    return BadRequest(result);

            return Ok(result);
        }
    }
}
