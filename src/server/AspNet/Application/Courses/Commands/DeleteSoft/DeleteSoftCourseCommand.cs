using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Commands.DeleteSoft
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class DeleteSoftCourseCommand : IRequest<Response<CourseDto>>
    {
        public string id { get; set; } = null!;
    }

    public class DeleteSoftCourseCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<DeleteSoftCourseCommand, Response<CourseDto>>
    {

        public async Task<Response<CourseDto>> Handle(DeleteSoftCourseCommand request, CancellationToken cancellationToken)
        {
            await unitOfWork.BeginTransactionAsync();
            var course = await unitOfWork.Courses.GetByIdAsync(request.id);

            if (course == null)
            {
                return Response<CourseDto>.Fail(
                    message: "Khóa học không tồn tại"
                );

            }

            await unitOfWork.Courses.DeleteSoftAsync(course);
            await unitOfWork.CommitTransactionAsync();

            return new Response<CourseDto>
            {
                Data = mapper.Map<CourseDto>(course),
                Message = "Xóa mềm khóa học thành công",
                Ok = true,
                action = Domain.Enums.Action.DELETE.ToString()
            };
        }
    }
}