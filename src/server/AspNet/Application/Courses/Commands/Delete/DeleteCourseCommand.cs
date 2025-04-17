using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Commands.Delete
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public class DeleteCourseCommand : IRequest<Response<CourseDto>>
    {
        public string id { get; set; } = null!;
    }
    
    public class DeleteCourseCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<DeleteCourseCommand, Response<CourseDto>>
    {

        public async Task<Response<CourseDto>> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
        {
            await unitOfWork.BeginTransactionAsync();
            var course = await unitOfWork.Courses.GetByIdAsync(request.id);

            if (course == null)
            {
                return Response<CourseDto>.Fail(
                    message: "Khóa học không tồn tại"
                );
                
            }

            await unitOfWork.Courses.DeleteAsync(course);
            await unitOfWork.CommitTransactionAsync();

            return new Response<CourseDto>
            {
                Data = mapper.Map<CourseDto>(course),
                Message = "Xóa khóa học thành công",
                Ok = true,
                action = Domain.Enums.Action.DELETE.ToString()
            };
        }
    }
}