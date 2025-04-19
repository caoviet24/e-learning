using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Courses.Commands
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class ChangeStatusCourseCommand : IRequest<CourseDto>
    {
        public string id { get; set; } = null!;
        public string status { get; set; } = null!;
    }

    public class ChangeStatusCourseCommandValidator
    {
        public ChangeStatusCourseCommandValidator()
        {

        }
    }

    public class ChangeStatusCourseCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<ChangeStatusCourseCommand, CourseDto>
    {

        public async Task<CourseDto> Handle(ChangeStatusCourseCommand request, CancellationToken cancellationToken)
        {
            var transaction = await dbContext.Database.BeginTransactionAsync();
            var course = await dbContext.Courses.FindAsync(request.id);

            if (course == null)
            {
                throw new NotFoundException("Khóa học không tồn tại");

            }
            course.status = request.status;
            var updatedCourse = dbContext.Courses.Update(course);
            await transaction.CommitAsync(cancellationToken);

            return mapper.Map<CourseDto>(updatedCourse.Entity);
        }
    }
}