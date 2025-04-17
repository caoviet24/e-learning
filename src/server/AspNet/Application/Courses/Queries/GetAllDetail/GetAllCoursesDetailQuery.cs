using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Queries.GetAllDetail
{
    [Authorize]
    public class GetAllCoursesDetailQuery : IRequest<ResponseList<CourseDetailDto>>
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

    public class GetAllCoursesDetailQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetAllCoursesDetailQuery, ResponseList<CourseDetailDto>>
    {

        public async Task<ResponseList<CourseDetailDto>> Handle(GetAllCoursesDetailQuery request, CancellationToken cancellationToken)
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

            return new ResponseList<CourseDetailDto>
            {
                data = mapper.Map<List<CourseDetailDto>>(query.Items),
                pageNumber = query.pageNumber,
                pageSize = query.pageSize,
                totalRecords = query.totalRecords
            };
        }
    }
}