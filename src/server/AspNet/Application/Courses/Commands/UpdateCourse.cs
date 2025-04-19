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
    public class UpdateCourseCommand : IRequest<CourseDto>
    {
        public string id { get; set; } = null!;
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string status { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
    }

    public class UpdateCourseCommandValidator : AbstractValidator<UpdateCourseCommand>
    {
        public UpdateCourseCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
            RuleFor(x => x.title)
                .NotEmpty().WithMessage("Tên không được để trống");
            RuleFor(x => x.description)
                .NotEmpty().WithMessage("Mô tả không được để trống");
            RuleFor(x => x.thumbNail)
                .NotEmpty().WithMessage("Hình ảnh không được để trống");
        }
    }

    public class UpdateCourseCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IUser user) : IRequestHandler<UpdateCourseCommand, CourseDto>
    {
        public async Task<CourseDto> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
        {
            var transaction =  await dbContext.Database.BeginTransactionAsync();

            var newUpdateCourse = mapper.Map<Course>(request);

            var course = await dbContext.Courses.FindAsync(request.id);
            if (course == null)
            {
                throw new BadRequestException("Khóa học không tồn tại");
            }

            if (course.createdBy != user.getCurrentUser())
            {
                throw new BadRequestException("Bạn không có quyền sửa khóa học này");
            }

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

            var exitCourseByUser = await dbContext.Courses.FirstOrDefaultAsync(x => x.title == request.title);
            if (exitCourseByUser?.title == request.title && exitCourseByUser.createdBy == user.getCurrentUser())
            {
                throw new BadRequestException("Khóa học đã tồn tại");
            }

            var result = await dbContext.Courses.AddAsync(newUpdateCourse);

            if (result == null)
            {
                throw new BadRequestException("Cập nhật khóa học thất bại");
            }

            var courseDto = mapper.Map<CourseDto>(result);
            await transaction.CommitAsync();
            return courseDto;
        }
    }
}