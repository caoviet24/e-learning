
using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Courses.Commands
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class CreateCourseCommand : IRequest<CourseDto>
    {
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string status { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
    }

    public class CreateCourseCommandValidator : AbstractValidator<CreateCourseCommand>
    {
        public CreateCourseCommandValidator()
        {
            RuleFor(x => x.title)
                .NotEmpty()
                .WithMessage("Title is required.")
                .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters.");

            RuleFor(x => x.description)
                .NotEmpty()
                .WithMessage("Description is required.")
                .MaximumLength(500)
                .WithMessage("Description must not exceed 500 characters.");

            RuleFor(x => x.thumbNail)
                .NotEmpty()
                .WithMessage("Thumbnail is required.");

            RuleFor(x => x.status)
                .NotEmpty()
                .WithMessage("Status is required.");
        }
    }

    public class CreateCourseCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IUser user) : IRequestHandler<CreateCourseCommand, CourseDto>
    {
        public async Task<CourseDto> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
        {
            var transaction = await dbContext.Database.BeginTransactionAsync();

            var newCourse = mapper.Map<Course>(request);

            var faculty = await dbContext.Faculties.FindAsync(request.facultyId);
            if (faculty == null)
            {
                throw new BadRequestException("Khoa không tồn tại");
            }

            var major = await dbContext.Majors.FindAsync(request.majorId);
            if (major == null)
            {
                throw new BadRequestException("Chuyên ngành không tồn tại");
            }

            var exitCourseByUser = await dbContext.Courses.FirstOrDefaultAsync(x=>x.title == request.title,cancellationToken);
            if (exitCourseByUser?.title == request.title && exitCourseByUser.createdBy == user.getCurrentUser())
            {
                throw new BadRequestException("Khóa học đã tồn tại");
            }

            var result = await dbContext.Courses.AddAsync(newCourse);

            if (result == null)
            {
                throw new BadRequestException("Tạo khóa học thất bại");
            }
            var courseDto = mapper.Map<CourseDto>(result);
            await transaction.CommitAsync();


            return courseDto;
        }
    }
}