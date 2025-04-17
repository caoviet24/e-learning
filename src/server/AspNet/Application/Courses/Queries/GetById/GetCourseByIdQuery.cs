using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using AutoMapper;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Queries.GetById
{
    public class GetCourseByIdQuery : IRequest<Response<CourseDto>>
    {
        public string id { get; set; } = null!;

    }

    public class GetCourseByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetCourseByIdQuery, Response<CourseDto>>
    {
        public async Task<Response<CourseDto>> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
        {
            var course = await unitOfWork.Courses.GetByIdAsync(request.id);

            if (course == null)
            {
                throw new NotFoundException($"Không tìm thấy khóa học với ID: {request.id}");
            }

            var data = mapper.Map<CourseDto>(course);
            return new Response<CourseDto>
            {
                Data = data,
                Message = "Lấy thông tin khóa học thành công",
                Ok = true,
            };
        }
    }
}