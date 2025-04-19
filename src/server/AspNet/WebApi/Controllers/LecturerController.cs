using Application.Lecturers.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("lecturers")]
    public class LecturerController(ISender sender, ILogger<LecturerController> logger) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> getAll([FromQuery] GetAllLecturersQuery query)
        {
            logger.LogInformation("Get all lecturers query received: {Query}", query);
            var result = await sender.Send(query);
            return Ok(result);
        }
        
        [HttpPost("create")]
        public async Task<IActionResult> create([FromBody] CreateLecturerCommand command)
        {
            logger.LogInformation("Create lecturer command received: {Command}", command);
            var result = await sender.Send(command);
            return Ok(result);
        }
    }
}