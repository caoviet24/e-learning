using Application.Common.Interfaces;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Courses.Queries
{
    public class GetCourseByIdQuery : IRequest<CourseDto>
    {
        public string id { get; set; } = null!;

    }

    public class GetCourseByIdValidator : AbstractValidator<GetCourseByIdQuery>
    {
        public GetCourseByIdValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }

    public class GetCourseByIdQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetCourseByIdQuery, CourseDto>
    {
        public async Task<CourseDto> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
        {
            var course = await dbContext.Courses.FindAsync(request.id);

            if (course == null)
            {
                throw new NotFoundException($"Không tìm thấy khóa học với ID: {request.id}");
            }

            return mapper.Map<CourseDto>(course);

        }
    }
}