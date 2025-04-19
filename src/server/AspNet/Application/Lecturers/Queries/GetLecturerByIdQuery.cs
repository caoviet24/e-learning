using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Lecturers.Queries
{
    [Authorize]
    public class GetLecturerByIdQuery : IRequest<LecturerDto>
    {
        public string id { get; set; } = null!;
    }

    public class GetLecturerByIdQueryValidator : AbstractValidator<GetLecturerByIdQuery>
    {
        public GetLecturerByIdQueryValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("Lecturer ID is required.");
        }
    }

    public class GetLecturerByIdQueryHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<GetLecturerByIdQuery, LecturerDto>
    {
        public async Task<LecturerDto> Handle(GetLecturerByIdQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Lecturers
                .Where(l => l.User.Id == request.id)
                .ProjectTo<LecturerDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken) ?? throw new NotFoundException($"Không tìm thấy giảng viên với ID: {request.id}");
        }
    }
}