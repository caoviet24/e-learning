

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
            .MapGet(GetAll)
            .MapGet(GetById,"{id}")
            .MapPost(Create)
            .MapPut(Update,"{id}")
            .MapDelete(Delete,"{id}");
        }

        public async Task<PaginatedList<FacultyDto>> GetAll(ISender sender,[FromQuery] GetAllFacultiesQuery query)
        {
            return await sender.Send(query);
        }

        public async Task<FacultyDto> GetById(ISender sender ,[FromRoute]string id)
        {
            return await sender.Send(new GetFacultyByIdQuery { id = id });
        }

        public async Task<FacultyDto> Create(ISender sender,[FromBody] CreateFacultyCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<FacultyDto> Update(ISender sender,[FromRoute] string id, [FromBody] UpdateFacultyCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<FacultyDto> Delete(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new DeleteFacultyCommand { id = id });
        }
    }
}