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
                .MapGet(GetAllMajors, "/get-all")
                .MapGet(GetMajorById, "/get-by-id/{id}")
                .MapPost(CreateMajor)
                .MapPut(UpdateMajor, "{id}")
                .MapDelete(DeleteMajor, "{id}");
        }

        public async Task<PaginatedList<MajorDtoWithFaculty>> GetAllMajors(ISender sender, [AsParameters] GetAllMajorQuery query)
        {
            return await sender.Send(query);
        }

        public async Task<MajorDto> GetMajorById(ISender sender, [FromRoute] string id)
        {
            var query = new GetMajorByIdQuery { Id = id };
            return await sender.Send(query);
        }

        public async Task<MajorDtoWithFaculty> CreateMajor(ISender sender, [FromBody] CreateMajorCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<MajorDtoWithFaculty> UpdateMajor(ISender sender, [FromBody] UpdateMajorCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<MajorDtoWithFaculty> DeleteMajor(ISender sender, [FromRoute] string id)
        {
            return await sender.Send(new DeleteMajorCommand { Id = id });
        }
    }
}