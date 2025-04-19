using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Majors.Queries.GetById
{
    [Authorize]
    public class GetMajorByIdQuery : IRequest<MajorDto>
    {
        public string Id { get; set; } = null!;
    }

    public class GetMajorByIdQueryValidator : AbstractValidator<GetMajorByIdQuery>
    {
        public GetMajorByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");
        }
    }

    public class GetMajorByIdQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetMajorByIdQuery, MajorDto>
    {
        public async Task<MajorDto> Handle(GetMajorByIdQuery request, CancellationToken cancellationToken)
        {
            var query = await dbContext.Majors.FindAsync(request.Id);

            if (query == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.Id}");
            }

            return mapper.Map<MajorDto>(query);
        }
    }
}