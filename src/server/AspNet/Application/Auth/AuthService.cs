using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Application.Auth
{
    public class AuthService : IIdentitiesService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUser _user;
        private readonly IMapper _mapper;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthService> _logger;
        private readonly IMemoryCache _memoryCache;

        public AuthService(IUnitOfWork unitOfWork, IUser user, IMapper mapper, IJwtService jwtService, IMemoryCache memoryCache , ILogger<AuthService> logger)
        {
            _unitOfWork = unitOfWork;
            _user = user;
            _mapper = mapper;
            _jwtService = jwtService;
            _logger = logger;
            _memoryCache = memoryCache;
        }

        public async Task<UserDto> AuthMe(string token)
        {
            string Id = _user.getCurrentUser();
            _logger.LogInformation($"Id: {Id}");
            if (Id == null)
            {
                throw new BadRequestException("Token is invalid");
            }

            var currentUser = await _unitOfWork.Users.GetByIdAsync(Id);
            _logger.LogInformation($"currentUser: {currentUser}");
            if (currentUser == null)
            {
                throw new NotFoundException("User not found");
            }

            return _mapper.Map<UserDto>(currentUser);

        }

        public async Task<TokenDto> RefreshToken(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new BadRequestException("Refresh token is invalid or missing");
            }

            var userId = _memoryCache.Get<string>($"refresh_token_lookup:{refreshToken}");
            if (userId == null)
            {
                throw new BadRequestException("Invalid or expired refresh token");
            }

            if (string.IsNullOrEmpty(userId))
            {
                throw new BadRequestException("Invalid refresh token mapping");
            }


            var storedToken = _memoryCache.Get<string>($"refresh_token:{userId}");

            if (string.IsNullOrEmpty(storedToken) || storedToken != refreshToken)
            {
                _memoryCache.Remove($"refresh_token_lookup:{refreshToken}");
                throw new BadRequestException("Invalid or expired refresh token");
            }

            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            var newAccessToken = _jwtService.generateAccessToken(user);
            var newRefreshToken = _jwtService.generateRefreshToken(user);

            _memoryCache.Remove($"refresh_token_lookup:{refreshToken}");
            _memoryCache.Set<string>($"refresh_token:{userId}", newRefreshToken,TimeSpan.FromDays(30));
            _memoryCache.Set<string>($"refresh_token_lookup:{newRefreshToken}", userId, TimeSpan.FromDays(30));

            return new TokenDto
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            };
        }
    }
}