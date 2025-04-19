using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Common.DTOs;
using Application.Common.Interfaces;
using Domain.Entites;
using Domain.Exceptions;
using Infrastructure.Configurations;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services
{
    public class JwtService(
        IMemoryCache _memoryCache,
        IApplicationDbContext dbContext,
        IOptions<JwtConfiguration> jwtConfiguration
    ) : IJwtService
    {
        public string generateAccessToken(User payload)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtConfiguration.Value.AccessKey));
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, payload.Id.ToString()),
                new Claim(ClaimTypes.Role, payload.role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(jwtConfiguration.Value.AccessExpirationMinutes),
                Issuer = jwtConfiguration.Value.Issuer,
                Audience = jwtConfiguration.Value.Audience,
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.CreateToken(token);
            return tokenHandler.WriteToken(tokenString);
        }
        public string generateRefreshToken(User payload)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtConfiguration.Value.RefreshKey));
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, payload.Id.ToString()),
                new Claim(ClaimTypes.Role, payload.role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(jwtConfiguration.Value.RefreshExpirationMinutes),
                Issuer = jwtConfiguration.Value.Issuer,
                Audience = jwtConfiguration.Value.Audience,
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.CreateToken(token);
            return tokenHandler.WriteToken(tokenString);
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

            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            var newAccessToken = generateAccessToken(user);
            var newRefreshToken = generateRefreshToken(user);

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