namespace Application.Common.Interfaces
{
    public interface IIdentitiesService
    {
        Task<UserDto> AuthMe(string token);
        Task<TokenDto> RefreshToken(string token);
    }
}