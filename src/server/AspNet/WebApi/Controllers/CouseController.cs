using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Courses.Commands.Active;
using Application.Courses.Commands.ChangeStatus;
using Application.Courses.Commands.Create;
using Application.Courses.Commands.Delete;
using Application.Courses.Commands.DeleteSoft;
using Application.Courses.Commands.InActive;
using Application.Courses.Commands.Restore;
using Application.Courses.Commands.Update;
using Application.Courses.Queries.GetAllDetail;
using Application.Courses.Queries.GetAllWithAuthor;
using Application.Courses.Queries.GetBasic;
using Application.Courses.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("courses")]
    public class CouseController(ISender sender, ILogger<CouseController> logger) : ControllerBase
    {
        [HttpGet("get-all-basic")]
        public async Task<IActionResult> getAll([FromQuery] GetAllCoursesBasicQuery query)
        {
            logger.LogInformation("Fetching all courses {@query}", query);
            return Ok(await sender.Send(query));
        }

        [HttpGet("get-all-detail")]
        public async Task<IActionResult> getAllDetail([FromQuery] GetAllCoursesDetailQuery query)
        {
            logger.LogInformation("Fetching all course details {@query}", query);
            return Ok(await sender.Send(query));
        }

        [HttpGet("get-all-with-author")]
        public async Task<IActionResult> getAllWithAuthor([FromQuery] GetAllCoursesWithAuthorQuery query)
        {
            logger.LogInformation("Fetching all courses with author {@query}", query);
            return Ok(await sender.Send(query));
        }

        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> getById([FromRoute] GetCourseByIdQuery query)
        {
            logger.LogInformation("Fetching course by ID: {id}", query.id);
            return Ok(await sender.Send(query));
        }

        [HttpPost("create")]
        public async Task<IActionResult> create([FromBody] CreateCourseCommand command)
        {
            logger.LogInformation("Create course, payload: {@command}", command);
            return Ok(await sender.Send(command));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> update([FromBody] UpdateCourseCommand command)
        {
            logger.LogInformation("Update course with ID: {id}, payload: {@command}", command.id, command);
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> delete([FromQuery] DeleteCourseCommand command)
        {
            logger.LogInformation("Delete course with ID: {id}", command.id);
            return Ok(await sender.Send(command));
        }

        [HttpDelete("delete-soft")]
        public async Task<IActionResult> deleteSoft([FromQuery] DeleteSoftCourseCommand command)
        {
            logger.LogInformation("Soft delete course with ID: {id}", command.id);
            return Ok(await sender.Send(command));
        }

        [HttpPut("restore")]
        public async Task<IActionResult> restore([FromQuery] RestoreCourseCommand command)
        {
            logger.LogInformation("Restore course with ID: {id}", command.id);
            return Ok(await sender.Send(command));
        }

        [HttpPut("active")]
        public async Task<IActionResult> active([FromQuery] ActiveCourseCommand command)
        {
            logger.LogInformation("Activate course with ID: {id}", command.id);
            return Ok(await sender.Send(command));
        }

        [HttpPut("in-active")]
        public async Task<IActionResult> inActive([FromQuery] InActiveCourseCommand command)
        {
            logger.LogInformation("Deactivate course with ID: {id}", command.id);
            return Ok(await sender.Send(command));
        }

        [HttpPut("update-status")]
        public async Task<IActionResult> updateStatus([FromQuery] ChangeStatusCourseCommand command)
        {
            logger.LogInformation("Update status of course with ID: {id}", command.id);
            return Ok(await sender.Send(command));
        }

    }
}