using System;
using System.Threading.Tasks;
using Application.Faculties.Commands.CreateFaculty;
using Application.Faculties.Commands.UpdateFaculty;
using Application.Faculties.Commands.DeleteFaculty;
using Application.Faculties.Commands.RestoreFaculty;
using Application.Faculties.Queries.GetAllFaculties;
using Application.Faculties.Queries.GetFacultyById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Application.Faculties.Commands.DeleteSoft;

namespace WebApi.Controllers
{
    [ApiController]
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
        public async Task<IActionResult> Update([FromBody] UpdateFacultyCommand command)
        {
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete/{Id}")]
        public async Task<IActionResult> Delete([FromQuery] DeleteFacultyCommand command)
        {
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete-soft/{Id}")]
        public async Task<IActionResult> DeleteSoft([FromQuery] DeleteSoftFacultyCommand command)
        {
            return Ok(await sender.Send(command));
        }

        [HttpPut("restore/{Id}")]
        public async Task<IActionResult> Restore([FromQuery] RestoreFacultyCommand command)
        {
            return Ok(await sender.Send(command));
        }
    }
}