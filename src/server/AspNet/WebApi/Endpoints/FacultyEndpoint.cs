

using Application.Common.DTOs;
using Application.Common.Models;
using Application.Faculties.Commands;
using Application.Faculties.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class FacultyEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetAllFaculties, "/get-all")
            .MapGet(GetFacultyById, "{id}")
            .MapPost(CreateFaculty)
            .MapPut(UpdateFaculty, "{id}")
            .MapDelete(DeleteFaculty, "{id}");
        }

        public async Task<PaginatedList<FacultyDto>> GetAllFaculties(ISender sender, [AsParameters] GetAllFacultiesQuery query)
        {
            return await sender.Send(query);
        }
        public async Task<FacultyDto> GetFacultyById(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new GetFacultyByIdQuery { id = id });
        }

        public async Task<FacultyDto> CreateFaculty(ISender sender, [FromBody] CreateFacultyCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<FacultyDto> UpdateFaculty(ISender sender, [FromRoute] string id, [FromBody] UpdateFacultyCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<FacultyDto> DeleteFaculty(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new DeleteFacultyCommand { id = id });
        }
    }
}