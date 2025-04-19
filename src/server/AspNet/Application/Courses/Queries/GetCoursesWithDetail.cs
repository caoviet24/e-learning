using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Courses.Queries
{
    public class GetCoursesWithDetailQuery : IRequest<PaginatedList<CourseDetailDto>>
    {
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string? status { get; set; } = null!;
        public string? facultyId { get; set; } = null!;
        public string? majorId { get; set; } = null!;
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
    }

    public class GetCoursesWithDetailValidator : AbstractValidator<GetCoursesWithDetailQuery>
    {
        public GetCoursesWithDetailValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");
            RuleFor(x => x.pageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0");
        }
    }

    internal class GetCoursesWithDetailQueryHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<GetCoursesWithDetailQuery, PaginatedList<CourseDetailDto>>
    {
        public async Task<PaginatedList<CourseDetailDto>> Handle(GetCoursesWithDetailQuery request, CancellationToken cancellationToken)
        {
            var query = dbContext.Courses.AsQueryable()
                .Where(x => x.title.Contains(request.title) || string.IsNullOrEmpty(request.title))
                .Where(x => x.description.Contains(request.description) || string.IsNullOrEmpty(request.description))
                .Where(x => x.thumbNail.Contains(request.thumbNail) || string.IsNullOrEmpty(request.thumbNail))
                .Where(x => x.status == request.status || string.IsNullOrEmpty(request.status))
                .Where(x => x.facultyId == request.facultyId || string.IsNullOrEmpty(request.facultyId))
                .Where(x => x.majorId == request.majorId || string.IsNullOrEmpty(request.majorId));

            return await query
                .ProjectTo<CourseDetailDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
        }
    }
}