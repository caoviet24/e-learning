using Application.Common.DTOs;
using Application.Common.Models;
using Application.Majors.Commands;
using Application.Majors.Queries;
using Application.Majors.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class MajorEndpoint : EndpointGroupBase
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

        public async Task<PaginatedList<MajorDtoWithFaculty>> GetAll(ISender sender, [AsParameters] GetAllMajorQuery query)
        {
            return await sender.Send(query);
        }

        public async Task<MajorDto> GetById(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new GetMajorByIdQuery { Id = id });
        }

        public async Task<MajorDtoWithFaculty> Create(ISender sender, [FromBody] CreateMajorCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<MajorDtoWithFaculty> Update(ISender sender, [FromBody] UpdateMajorCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<MajorDtoWithFaculty> Delete(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new DeleteMajorCommand { Id = id });
        }
    }
}