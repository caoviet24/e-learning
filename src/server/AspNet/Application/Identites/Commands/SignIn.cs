
using Application.Common.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Identites.Commands
{
    public class SignInCommand : IRequest<TokenDto>
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
    }

    public class SignInCommandValidator : AbstractValidator<SignInCommand>
    {
        public SignInCommandValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .WithMessage("Tên đăng nhập là bắt buộc.");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Mật khẩu là bắt buộc.");

            RuleFor(x => x.Role)
                .NotEmpty()
                .WithMessage("Vai trò là bắt buộc.");
        }
    }

    public class SignInCommandHandler(IApplicationDbContext dbContext, IJwtService jwtService, IMemoryCache memoryCache) : IRequestHandler<SignInCommand, TokenDto>
    {
        public async Task<TokenDto> Handle(SignInCommand request, CancellationToken cancellationToken)
        {
            var exitUser = await dbContext.Users.FirstOrDefaultAsync(x => x.username == request.Username, cancellationToken: cancellationToken);
            if (exitUser == null)
            {
                throw new NotFoundException("Tài khoản không tồn tại");
            }

            var isMathPassword = BCrypt.Net.BCrypt.Verify(request.Password, exitUser.password);
            if (!isMathPassword)
            {
                throw new BadRequestException("Mật khẩu không đúng");
            }
            if (exitUser.isDeleted == true)
            {
                throw new BadRequestException("Tài khoản đã bị xóa");
            }

            if (request.Role != exitUser.role)
            {
                throw new BadRequestException("Thông tin tài khoản không đúng");
            }



            var accessToken = jwtService.generateAccessToken(exitUser);
            var refreshToken = jwtService.generateRefreshToken(exitUser);

            var expiry = TimeSpan.FromDays(30);
            memoryCache.Set<string>($"refresh_token:{exitUser.Id}", refreshToken, expiry);
            memoryCache.Set<string>($"refresh_token_lookup:{refreshToken}", exitUser.Id, expiry);

            return new TokenDto
            {
                accessToken = accessToken,
                refreshToken = refreshToken
            };

        }
    }
}