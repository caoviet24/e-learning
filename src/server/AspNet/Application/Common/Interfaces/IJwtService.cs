using Domain.Entites;
namespace Application.Common.Interfaces
{
    public interface IJwtService
    {
        string generateAccessToken(User payload);
        string generateRefreshToken(User payload);
        Task<TokenDto> RefreshToken(string token);
    }
}