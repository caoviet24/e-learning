

using Application.Common.DTOs;
using Application.Common.Models;
using Application.Courses.Commands;
using Application.Courses.Queries;
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
                .MapGet(GetAllBasic, "/get-all-basic")
                .MapGet(GetAllWithAuthor, "/get-all-with-author")
                .MapGet(GetAllDetail, "/get-all-detail")
                .MapGet(GetCourseById, "/get-by-id/{id}")
                .MapPost(CreateCourse)
                .MapPost(UpdateCourse, "{id}")
                .MapDelete(DeleteCourse, "{id}");
        }

        public async Task<PaginatedList<CourseDto>> GetAllBasic(ISender sender, [AsParameters] GetAllCoursesBasicQuery query)
        {
            return await sender.Send(query);
        }

        public async Task<PaginatedList<CourseWithAuthorDto>> GetAllWithAuthor(ISender sender, [AsParameters] GetCoursesWithAuthorQuery query)
        {
            return await sender.Send(query);
        }

        public async Task<PaginatedList<CourseDetailDto>> GetAllDetail(ISender sender, [AsParameters] GetCoursesWithDetailQuery query)
        {
            return await sender.Send(query);
        }


        public async Task<CourseDto> GetCourseById(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new GetCourseByIdQuery { id = id });
        }

        public async Task<CourseDto> CreateCourse(ISender sender, [FromBody] CreateCourseCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<CourseDto> UpdateCourse(ISender sender, [FromBody] UpdateCourseCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<CourseDto> DeleteCourse(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new DeleteCourseCommand { id = id });
        }

        public async Task<CourseDto> ActiveCourse(ISender sender, [FromQuery] ActiveCourseCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<CourseDto> ChangeCourseStatus(ISender sender, [FromQuery] ChangeStatusCourseCommand command)
        {
            return await sender.Send(command);
        }
    }
}