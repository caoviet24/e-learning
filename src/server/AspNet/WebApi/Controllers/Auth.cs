using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Identites.Commands.SignIn;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Domain.Exceptions;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("auth")]
    public class Auth : ControllerBase
    {
        private readonly ISender _sender;
        private readonly ILogger<Auth> _logger;

        public Auth(ISender sender, ILogger<Auth> logger)
        {
            _sender = sender;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] SignInCommand command)
        {
            var result = await _sender.Send(command);
            return Ok(new { 
                message = "Đăng nhập thành công",
                success = true,
                access_token = result.accessToken,
                refresh_token = result.refreshToken
            });
        }
        
        // [HttpPost("register")]
        // public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        // {
        //     await _sender.Send(command);
        //     return StatusCode(201, new { 
        //         message = "Đăng ký thành công",
        //         success = true
        //     });
        // }
        
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = HttpContext.Request.Headers["refresh_token"].ToString();
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "No refresh token provided", success = false });
            }
            
            try
            {
                var authService = HttpContext.RequestServices.GetRequiredService<IIdentitiesService>();
                var result = await authService.RefreshToken(refreshToken);
                
                return Ok(new {
                    accessToken = result.accessToken,
                    refreshToken = result.refreshToken
                });
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message, success = false });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while refreshing token", success = false });
            }
        }
        
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var authService = HttpContext.RequestServices.GetRequiredService<IIdentitiesService>();
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var user = await authService.AuthMe(token);
            return Ok(user);
        }
    }
}