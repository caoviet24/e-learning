

using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Courses.Queries
{
    [Authorize]
    public class GetAllCoursesBasicQuery : IRequest<PaginatedList<CourseDto>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public string? facultyId { get; set; }
        public string? majorId { get; set; }
        public string? lecturerId { get; set; }
        public string? status { get; set; }
        public bool? isActive { get; set; }
        public bool? isDeleted { get; set; }
    }

    public class GetAllCoursesBasicQueryValidator : AbstractValidator<GetAllCoursesBasicQuery>
    {
        public GetAllCoursesBasicQueryValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");
            RuleFor(x => x.pageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0");
        }
    }

    public class GetAllCoursesBasicQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetAllCoursesBasicQuery, PaginatedList<CourseDto>>
    {

        public async Task<PaginatedList<CourseDto>> Handle(GetAllCoursesBasicQuery request, CancellationToken cancellationToken)
        {
            var query = dbContext.Courses.AsNoTracking()
                .Where(x => x.title.Contains(request.search ?? "") || string.IsNullOrEmpty(request.search))
                .Where(x => x.facultyId == request.facultyId || string.IsNullOrEmpty(request.facultyId))
                .Where(x => x.majorId == request.majorId || string.IsNullOrEmpty(request.majorId))
                .Where(x => x.createdBy == request.lecturerId || string.IsNullOrEmpty(request.lecturerId))
                .Where(x => x.status == request.status || string.IsNullOrEmpty(request.status))
                .Where(x => x.isActive == request.isActive || request.isActive == null)
                .Where(x => x.isDeleted == request.isDeleted || request.isDeleted == null);

            var result = await query
                .ProjectTo<CourseDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
            return result;
        }
    }
}