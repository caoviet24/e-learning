using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Majors.Queries
{
    [Authorize]
    public class GetAllMajorQuery : IRequest<PaginatedList<MajorDtoWithFaculty>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public bool? isDeleted { get; set; }
        public string? facultyId { get; set; }
    }

    public class GetAllMajorQueryValidator : AbstractValidator<GetAllMajorQuery>
    {
        public GetAllMajorQueryValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0)
                .WithMessage("Page number must be greater than 0.");

            RuleFor(x => x.pageSize)
                .GreaterThan(0)
                .WithMessage("Page size must be greater than 0.");
        }
    }

    public class GetAllMajorQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetAllMajorQuery, PaginatedList<MajorDtoWithFaculty>>
    {
        public async Task<PaginatedList<MajorDtoWithFaculty>> Handle(GetAllMajorQuery request, CancellationToken cancellationToken)
        {
            var query = dbContext.Majors.AsQueryable()
                .Where(m => !request.isDeleted.HasValue || m.isDeleted == request.isDeleted.Value)
                .Where(m => string.IsNullOrEmpty(request.search) || m.name.Contains(request.search) || m.code.Contains(request.search))
                .Where(m => string.IsNullOrEmpty(request.facultyId) || m.facultyId == request.facultyId);
            return await query
                .ProjectTo<MajorDtoWithFaculty>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
        }
    }
}