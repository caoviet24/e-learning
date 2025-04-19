
using Application.Common.DTOs;
using Application.Identites.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class AuthEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .AllowAnonymous()
                .MapPost(Login,"/login")
                .MapPost(RefreshToken,"/refresh");
        }

        public async Task<TokenDto> Login(ISender sender ,[FromBody] SignInCommand command)
        {
            return await sender.Send(command);
        }

        public async Task<TokenDto> RefreshToken(ISender sender, [FromBody] RefreshTokenCommand command)
        {
            return await sender.Send(command);
        }
    }
}