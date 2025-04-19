

using Application.Common.DTOs;
using Application.Courses.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class CourseEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapPost(CreateCourse)
                .MapPost(UpdateCourse,"{id}")
                .MapDelete(DeleteCourse,"{id}");
        }

        public async Task<CourseDto> CreateCourse(ISender sender,[FromBody] CreateCourseCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<CourseDto> UpdateCourse(ISender sender ,[FromBody] UpdateCourseCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<CourseDto> DeleteCourse(ISender sender,[FromRoute] string id)
        {
            return await sender.Send(new DeleteCourseCommand { id = id });
        }

        public async Task<CourseDto> ActiveCourse(ISender sender,[FromQuery] ActiveCourseCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<CourseDto> ChangeCourseStatus(ISender sender ,[FromQuery] ChangeStatusCourseCommand command)
        {
            return await sender.Send(command);
        }
    }
}