
using Application.Common.DTOs;
using Application.Lessons.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class LessonEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(createLesson);
        }

        public async Task<LessonDto> createLesson(ISender sender, [FromBody] CreateLessonCommand command)
        {
            return await sender.Send(command);
        }
    }
}