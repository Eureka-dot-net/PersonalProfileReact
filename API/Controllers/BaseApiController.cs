using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator;

        protected IMediator Mediator =>
            _mediator ??= HttpContext.RequestServices.GetService<IMediator>()
                ?? throw new InvalidOperationException("IMediator service is unavailable");

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    404 => NotFound(result.Error),
                    401 => Unauthorized(result.Error),
                    403 => Forbid(),
                    400 => BadRequest(result.Error),
                    500 => StatusCode(500, result.Error),
                    _ => BadRequest(result.Error)
                };
            }

            // If success but no value, maybe return NoContent
            return NoContent();
        }
    }
}
