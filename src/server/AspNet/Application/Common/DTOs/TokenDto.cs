namespace Application.Common.DTOs
{
    public class TokenDto
    {
        public string accessToken { get; set; } = null!;
        public string refreshToken { get; set; } = null!;
    }
}