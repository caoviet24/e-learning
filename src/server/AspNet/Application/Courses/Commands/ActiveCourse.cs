

using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Courses.Commands
{
    [Authorize(Role = "ADMIN")]
    public class ActiveCourseCommand : IRequest<CourseDto>
    {
        public string id { get; set; } = null!;
    }

    public class ActiveCourseCommandValidator : AbstractValidator<ActiveCourseCommand>
    {
        public ActiveCourseCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }

    public class ActiveCourseCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<ActiveCourseCommand, CourseDto>
    {

        public async Task<CourseDto> Handle(ActiveCourseCommand request, CancellationToken cancellationToken)
        {
            var transaction =  await dbContext.Database.BeginTransactionAsync();
            var course = await dbContext.Courses.FindAsync(request.id);

            if (course == null)
            {
                throw new NotFoundException("Khóa học không tồn tại");

            }
            course.isActive = !course.isActive;
            var updatedCourse = dbContext.Courses.Update(course);
            await transaction.CommitAsync(cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);

            return mapper.Map<CourseDto>(updatedCourse.Entity);
        }
    }
}