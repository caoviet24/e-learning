using Application.Common.Interfaces;
using Application.Common.Mapping;
using Application.Common.Models;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Lessons.Queries
{
    [Authorize]
    public class GetAllLessonsQuery : IRequest<PaginatedList<LessonDto>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public string? courseId { get; set; }
    }

    public class GetAllLessonsQueryValidator : AbstractValidator<GetAllLessonsQuery>
    {
        public GetAllLessonsQueryValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0)
                .WithMessage("Page number must be greater than 0.");

            RuleFor(x => x.pageSize)
                .GreaterThan(0)
                .WithMessage("Page size must be greater than 0.");
        }
    }

    internal class GetAllLessonsQueryHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<GetAllLessonsQuery, PaginatedList<LessonDto>>
    {
        public async Task<PaginatedList<LessonDto>> Handle(GetAllLessonsQuery request, CancellationToken cancellationToken)
        {
            var query = dbContext.Lessons.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.search))
            {
                var searchLower = request.search.ToLower();
                query = query.Where(x => x.title.ToLower().Contains(searchLower) ||
                                        x.description.ToLower().Contains(searchLower));
            }

            if (!string.IsNullOrWhiteSpace(request.courseId))
            {
                query = query.Where(x => x.courseId == request.courseId);
            }

            return await query
                .ProjectTo<LessonDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.pageNumber, request.pageSize);
        }
    }
}