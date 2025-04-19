using Application.Common.DTOs;
using Application.Common.Interfaces;

namespace Infrastructure.Services
{
    public class IdentityService : IIdentitiesService
    {
        public Task<UserDto> AuthMe(string token)
        {
            throw new NotImplementedException();
        }

        public Task<TokenDto> RefreshToken(string token)
        {
            throw new NotImplementedException();
        }
    }
}