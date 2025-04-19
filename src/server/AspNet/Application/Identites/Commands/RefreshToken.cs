

using Application.Common.Interfaces;

namespace Application.Identites.Commands
{
    public class RefreshTokenCommand : IRequest<TokenDto>
    {
        public string RefreshToken { get; set; } = null!;
    }
    public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
    {
        public RefreshTokenCommandValidator()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty()
                .WithMessage("Refresh token is required.");
        }
    }
    
    internal class RefreshTokenCommandHandler(
        IJwtService jwtService
    ) : IRequestHandler<RefreshTokenCommand, TokenDto>{
        public async Task<TokenDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var token = await jwtService.RefreshToken(request.RefreshToken);
            return token;
        }
    }
}