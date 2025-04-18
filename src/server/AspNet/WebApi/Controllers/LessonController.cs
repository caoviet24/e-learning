

using Application.Lessons.Commands.Create;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class LessonController(
        ISender sender,
        ILogger<LessonController> logger
    ) : ControllerBase
    {
        [HttpPost("create")]
        public async Task<IActionResult> create([FromBody] CreateLessonCommand command)
        {
            logger.LogInformation("Create course, payload: {@command}", command);
            return Ok(await sender.Send(command));
        }
    }
}