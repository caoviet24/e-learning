using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Faculties.Queries
{
    [Authorize]
    public class GetAllFacultiesQuery : IRequest<PaginatedList<FacultyDto>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public bool? isDeleted { get; set; }
    }

    public class GetAllFacultiesQueryValidator : AbstractValidator<GetAllFacultiesQuery>
    {
        public GetAllFacultiesQueryValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");
            RuleFor(x => x.pageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0");
        }
    }

    public class GetAllFacultiesQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetAllFacultiesQuery, PaginatedList<FacultyDto>>
    {
        public async Task<PaginatedList<FacultyDto>> Handle(GetAllFacultiesQuery request, CancellationToken cancellationToken)
        {
            var query = dbContext.Faculties.AsQueryable();
            
            if (!string.IsNullOrEmpty(request.search))
            {
                query = query.Where(x => x.name.Contains(request.search) || x.code.Contains(request.search));
            }

            if (request.isDeleted.HasValue)
            {
                query = query.Where(x => x.isDeleted == request.isDeleted.Value);
            }

            return await query
                .ProjectTo<FacultyDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
        }
    }
}