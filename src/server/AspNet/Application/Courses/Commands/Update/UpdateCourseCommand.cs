using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Commands.Update
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class UpdateCourseCommand : IRequest<Response<CourseDto>>
    {
        public string id { get; set; } = null!;
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string status { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
    }

    public class UpdateCourseCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, IUser user) : IRequestHandler<UpdateCourseCommand, Response<CourseDto>>
    {
        public async Task<Response<CourseDto>> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
        {
            await unitOfWork.BeginTransactionAsync();

            var newUpdateCourse = mapper.Map<Course>(request);

            var course = await unitOfWork.Courses.GetByIdAsync(request.id);
            if (course == null)
            {
                throw new BadRequestException("Khóa học không tồn tại");
            }

            if (course.createdBy != user.getCurrentUser())
            {
                throw new BadRequestException("Bạn không có quyền sửa khóa học này");
            }

            var faculty = await unitOfWork.Faculties.GetByIdAsync(request.facultyId);
            if (faculty == null)
            {
                throw new BadRequestException("Khoa không tồn tại");
            }

            var major = await unitOfWork.Majors.GetByIdAsync(request.majorId);
            if (major == null)
            {
                throw new BadRequestException("Chuyên ngành không tồn tại");
            }

            var exitCourseByUser = await unitOfWork.Courses.GetByNameAsync(request.title);
            if (exitCourseByUser?.title == request.title && exitCourseByUser.createdBy == user.getCurrentUser())
            {
                throw new BadRequestException("Khóa học đã tồn tại");
            }

            var result = await unitOfWork.Courses.AddAsync(newUpdateCourse);

            if (result == null)
            {
                throw new BadRequestException("Cập nhật khóa học thất bại");
            }

            var courseDto = mapper.Map<CourseDto>(result);
            await unitOfWork.CommitTransactionAsync();
            return Response<CourseDto>.Success
            (
                data: courseDto,
                message: "Cập nhật khóa học thành công",
                action: Domain.Enums.Action.CREATE.ToString()
            );
        }
    }
}