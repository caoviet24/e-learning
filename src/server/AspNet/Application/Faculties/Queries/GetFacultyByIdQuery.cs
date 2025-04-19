using Application.Common.Interfaces;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Faculties.Queries
{
    public class GetFacultyByIdQuery : IRequest<FacultyDto>
    {
        public string id { get; set; } = null!;
    }

    public class GetFacultyByIdValidator : AbstractValidator<GetFacultyByIdQuery>
    {
        public GetFacultyByIdValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }

    public class GetFacultyByIdQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetFacultyByIdQuery, FacultyDto>
    {
        public async Task<FacultyDto> Handle(GetFacultyByIdQuery request, CancellationToken cancellationToken)
        {
            var faculty = await dbContext.Faculties.FindAsync(request.id);

            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.id}");
            }

            return mapper.Map<FacultyDto>(faculty);
        }
    }
}