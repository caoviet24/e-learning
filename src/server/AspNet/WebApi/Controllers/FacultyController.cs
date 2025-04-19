using Application.Faculties.Queries.GetAllFaculties;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("faculties")]
    public class FacultyController(ISender sender, ILogger<FacultyController> logger) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll([FromQuery] GetAllFacultiesQuery query)
        {
            logger.LogInformation("Fetching all faculties");
            return Ok(await sender.Send(query));
        }

        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            return Ok(await sender.Send(id));
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateFacultyCommand command)
        {
            return Ok(await sender.Send(command));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateFacultyCommand command)
        {
            command.Id = id;
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete/{Id}")]
        public async Task<IActionResult> Delete(DeleteFacultyCommand command)
        {
            logger.LogInformation($"Deleting faculty with ID: {command.Id}");
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete-soft/{Id}")]
        public async Task<IActionResult> DeleteSoft(DeleteSoftFacultyCommand command)
        {
            return Ok(await sender.Send(command));
        }

        [HttpPut("restore/{Id}")]
        public async Task<IActionResult> Restore(RestoreFacultyCommand command)
        {
            return Ok(await sender.Send(command));
        }
    }
}