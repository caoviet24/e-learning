using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("majors")]
    public class MajorController(ISender sender, ILogger<MajorController> logger) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll([FromQuery] GetAllMajorQuery query)
        {
            logger.LogInformation("Fetching all majors @{query}", query);
            return Ok(await sender.Send(query));
        }

        [HttpGet("get-by-id/{Id}")]
        public async Task<IActionResult> GetById(GetMajorByIdQuery query)
        {
            logger.LogInformation("Fetching major by ID: {Id}", query.Id);
            return Ok(await sender.Send(query));
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateMajorCommand command)
        {
            logger.LogInformation("Creating new major: {@command}", command);
            return Ok(await sender.Send(command));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromBody] UpdateMajorCommand command)
        {
            logger.LogInformation($"Updating major with ID: {command.id}");
            
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete/{Id}")]
        public async Task<IActionResult> Delete(DeleteMajorCommand command)
        {
            logger.LogInformation($"Deleting major with ID: {command.Id}");
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete-soft/{Id}")]
        public async Task<IActionResult> DeleteSoft(DeleteSoftMajorCommand command)
        {
            logger.LogInformation($"Soft deleting major with ID: {command.Id}");
            return Ok(await sender.Send(command));
        }

        [HttpPut("restore/{Id}")]
        public async Task<IActionResult> Restore(RestoreMajorCommand command)
        {
            logger.LogInformation($"Restoring major with ID: {command.Id}");
            return Ok(await sender.Send(command));
        }
    }
}