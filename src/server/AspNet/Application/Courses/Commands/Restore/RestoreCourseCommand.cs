using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Commands.Restore
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class RestoreCourseCommand : IRequest<Response<CourseDto>>
    {
        public string id { get; set; } = null!;
    }

    public class RestoreCourseCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<RestoreCourseCommand, Response<CourseDto>>
    {

        public async Task<Response<CourseDto>> Handle(RestoreCourseCommand request, CancellationToken cancellationToken)
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
                Message = "Khôi phục khóa học thành công",
                Ok = true,
                action = Domain.Enums.Action.DELETE.ToString()
            };
        }
    }
}