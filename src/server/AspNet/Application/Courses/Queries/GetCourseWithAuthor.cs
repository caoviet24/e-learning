

using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Courses.Queries
{
    [Authorize]
    public class GetCoursesWithAuthorQuery : IRequest<PaginatedList<CourseWithAuthorDto>>
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

    public class GetCoursesWithAuthorQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetCoursesWithAuthorQuery, PaginatedList<CourseWithAuthorDto>>
    {

        public async Task<PaginatedList<CourseWithAuthorDto>> Handle(GetCoursesWithAuthorQuery request, CancellationToken cancellationToken)
        {
            var query = dbContext.Courses.AsQueryable();

            if (!string.IsNullOrEmpty(request.search))
            {
                query = query.Where(x => x.title.Contains(request.search));
            }

            if (!string.IsNullOrEmpty(request.facultyId))
            {
                query = query.Where(x => x.facultyId == request.facultyId);
            }

            if (!string.IsNullOrEmpty(request.majorId))
            {
                query = query.Where(x => x.majorId == request.majorId);
            }

            if (!string.IsNullOrEmpty(request.lecturerId))
            {
                query = query.Where(x => x.createdBy == request.lecturerId);
            }

            if (!string.IsNullOrEmpty(request.status))
            {
                query = query.Where(x => x.status == request.status);
            }

            if (request.isActive.HasValue)
            {
                query = query.Where(x => x.isActive == request.isActive.Value);
            }

            if (request.isDeleted.HasValue)
            {
                query = query.Where(x => x.isDeleted == request.isDeleted.Value);
            }

            return await query.ProjectTo<CourseWithAuthorDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
        }
    }
}