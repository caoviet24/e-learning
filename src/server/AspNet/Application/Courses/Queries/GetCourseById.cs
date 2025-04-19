using Application.Common.Interfaces;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Courses.Queries
{
    public class GetCourseByIdQuery : IRequest<Response<CourseDto>>
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

    public class GetCourseByIdQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<GetCourseByIdQuery, Response<CourseDto>>
    {
        public async Task<Response<CourseDto>> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
        {
            var course = await dbContext.Courses.FindAsync(request.id);

            if (course == null)
            {
                throw new NotFoundException($"Không tìm thấy khóa học với ID: {request.id}");
            }

            var data = mapper.Map<CourseDto>(course);
            return new Response<CourseDto>
            {
                Data = data,
                Message = "Lấy thông tin khóa học thành công",
                Ok = true,
            };
        }
    }
}