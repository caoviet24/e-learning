using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Interfaces;
using Application.Common.Sercurity;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;
using System.Text.Json;

namespace Application.Identites.Commands.SignIn
{

    public class SignInCommand : IRequest<TokenDto>
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
    }

    public class SignInCommandHandler(IUnitOfWork unitOfWork, IJwtService jwtService, IRedisService redisService) : IRequestHandler<SignInCommand, TokenDto>
    {
        public async Task<TokenDto> Handle(SignInCommand request, CancellationToken cancellationToken)
        {
            var exitUser = await unitOfWork.Users.GetByUsernameAsync(request.Username);
            if (exitUser == null)
            {
                throw new NotFoundException("Tài khoản không tồn tại");
            }

            var mathedPassword = BCrypt.Net.BCrypt.Verify(request.Password, exitUser.Password);
            var isValidRole = exitUser.Role.Equals(request.Role, StringComparison.OrdinalIgnoreCase);
            if (!mathedPassword || !isValidRole)
            {
                throw new BadRequestException("Thông tin đăng nhập không chính xác");
            }
            
            var accessToken = jwtService.generateAccessToken(exitUser);
            var refreshToken = jwtService.generateRefreshToken(exitUser);
            
            
            var expiry = TimeSpan.FromDays(30);
            await redisService.SetStringAsync($"refresh_token:{exitUser.Id}", refreshToken, expiry);
            await redisService.SetStringAsync($"refresh_token_lookup:{refreshToken}", exitUser.Id, expiry);
            
            return new TokenDto
            {
                accessToken = accessToken,
                refreshToken = refreshToken
            };

        }
    }


}