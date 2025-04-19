

using System.Net;
using Application.Common.DTOs;
using Application.Common.Models;
using Application.Lecturers.Commands;
using Application.Lecturers.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class LecturerEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(getAll)
            .MapPost(create);
        }

        public async Task<PaginatedList<LecturerDto>> getAll(ISender sender,[FromQuery] GetAllLecturersQuery query)
        {
            return await sender.Send(query);
        }

        public async Task<LecturerDto> create(ISender sender,[FromBody] CreateLecturerCommand command)
        {
            return await sender.Send(command);
        }
    }
}