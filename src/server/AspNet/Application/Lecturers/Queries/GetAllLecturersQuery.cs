using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Lecturers.Queries
{
    [Authorize]
    public class GetAllLecturersQuery : IRequest<PaginatedList<LecturerDto>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public string? facultyId { get; set; }
        public string? majorId { get; set; }
        public bool? isDeleted { get; set; }
    }

    public class GetAllLecturersQueryValidator : AbstractValidator<GetAllLecturersQuery>
    {
        public GetAllLecturersQueryValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0)
                .WithMessage("Page number must be greater than 0.");

            RuleFor(x => x.pageSize)
                .GreaterThan(0)
                .WithMessage("Page size must be greater than 0.");
        }
    }

    public class GetAllLecturersQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetAllLecturersQuery, PaginatedList<LecturerDto>>
    {
        public async Task<PaginatedList<LecturerDto>> Handle(GetAllLecturersQuery request, CancellationToken cancellationToken)
        {

            var query = dbContext.Lecturers.AsQueryable()
            .Where(l => l.User.isDeleted == request.isDeleted)
            .Where(l => l.User.fullName != null && l.User.fullName.Contains(request.search ?? ""))
            .Where(l => l.facultyId == request.facultyId || request.facultyId == null)
            .Where(l => l.majorId == request.majorId || request.majorId == null);

            return await query.ProjectTo<LecturerDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
        }
    }
}