using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Faculties.Queries
{
    public class GetFacultiesWithDetailQuery : IRequest<PaginatedList<FacultyDetailDto>>
    {
        public string? name { get; set; }
        public string? code { get; set; }
        public bool? isActive { get; set; }
        public bool? isDeleted { get; set; }
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
    }

    public class GetFacultiesWithDetailValidator : AbstractValidator<GetFacultiesWithDetailQuery>
    {
        public GetFacultiesWithDetailValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");
            RuleFor(x => x.pageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0");
        }
    }

    internal class GetFacultiesWithDetailQueryHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<GetFacultiesWithDetailQuery, PaginatedList<FacultyDetailDto>>
    {
        public async Task<PaginatedList<FacultyDetailDto>> Handle(GetFacultiesWithDetailQuery request, CancellationToken cancellationToken)
        {
            var query = dbContext.Faculties.AsQueryable();
            
            if (!string.IsNullOrEmpty(request.name))
            {
                query = query.Where(x => x.name.Contains(request.name));
            }
            
            if (!string.IsNullOrEmpty(request.code))
            {
                query = query.Where(x => x.code.Contains(request.code));
            }
            
            if (request.isActive.HasValue)
            {
                query = query.Where(x => x.isActive == request.isActive.Value);
            }
            
            if (request.isDeleted.HasValue)
            {
                query = query.Where(x => x.isDeleted == request.isDeleted.Value);
            }

            return await query
                .ProjectTo<FacultyDetailDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
        }
    }
}