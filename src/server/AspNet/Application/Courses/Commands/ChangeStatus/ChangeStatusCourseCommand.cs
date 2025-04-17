using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Commands.ChangeStatus
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class ChangeStatusCourseCommand : IRequest<Response<CourseDto>>
    {
        public string id { get; set; } = null!;
        public string status { get; set; } = null!;
    }

    public class ChangeStatusCourseCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<ChangeStatusCourseCommand, Response<CourseDto>>
    {

        public async Task<Response<CourseDto>> Handle(ChangeStatusCourseCommand request, CancellationToken cancellationToken)
        {
            await unitOfWork.BeginTransactionAsync();
            var course = await unitOfWork.Courses.GetByIdAsync(request.id);

            if (course == null)
            {
                return Response<CourseDto>.Fail(
                    message: "Khóa học không tồn tại"
                );

            }

            await unitOfWork.Courses.ChangeStatusAsync(course, status: request.status);
            await unitOfWork.CommitTransactionAsync();

            return new Response<CourseDto>
            {
                Data = mapper.Map<CourseDto>(course),
                Message = "Cập nhật trạng thái khóa học thành công",
                Ok = true,
                action = Domain.Enums.Action.DELETE.ToString()
            };
        }
    }
}