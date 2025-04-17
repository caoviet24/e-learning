using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Queries.GetBasic
{
    [Authorize]
    public class GetAllCoursesBasicQuery : IRequest<ResponseList<CourseDto>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public string? facultyId { get; set; }
        public string? majorId { get; set; }
        public string? lecturerId { get; set; }
        public string? status { get; set; }
        public bool? isActive { get; set; }
        public bool? isDeleted { get; set; }
    }

    public class GetAllCoursesBasicQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetAllCoursesBasicQuery, ResponseList<CourseDto>>
    {

        public async Task<ResponseList<CourseDto>> Handle(GetAllCoursesBasicQuery request, CancellationToken cancellationToken)
        {
            var query = await unitOfWork.Courses.GetAllAsync(
                 request.pageNumber,
                 request.pageSize,
                 request.search,
                 request.facultyId,
                 request.majorId,
                 request.lecturerId,
                 request.status,
                 request.isActive,
                 request.isDeleted
             );

            return new ResponseList<CourseDto>
            {
                data = mapper.Map<List<CourseDto>>(query.Items),
                pageNumber = query.pageNumber,
                pageSize = query.pageSize,
                totalRecords = query.totalRecords
            };
        }
    }
}