

using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Courses.Commands
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class DeleteCourseCommand : IRequest<CourseDto>
    {
        public string id { get; set; } = null!;
    }

    public class DeleteCourseCommandValidator : AbstractValidator<DeleteCourseCommand>
    {
        public DeleteCourseCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }

    public class DeleteCourseCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<DeleteCourseCommand, CourseDto>
    {

        public async Task<CourseDto> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
        {
            var transaction = await dbContext.Database.BeginTransactionAsync();
            var course = await dbContext.Courses.FindAsync(request.id);

            if (course == null)
            {
                throw new NotFoundException("Khóa học không tồn tại");
            }

            dbContext.Courses.Remove(course);
            await transaction.CommitAsync(cancellationToken);

            return mapper.Map<CourseDto>(course);
        }
    }
}