using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Courses.Queries.GetAllWithAuthor
{
    [Authorize]
    public class GetAllCoursesWithAuthorQuery : IRequest<ResponseList<CourseWithAuthorDto>>
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

    public class GetAllCoursesWithAuthorQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetAllCoursesWithAuthorQuery, ResponseList<CourseWithAuthorDto>>
    {

        public async Task<ResponseList<CourseWithAuthorDto>> Handle(GetAllCoursesWithAuthorQuery request, CancellationToken cancellationToken)
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

            return new ResponseList<CourseWithAuthorDto>
            {
                data = mapper.Map<List<CourseWithAuthorDto>>(query.Items),
                pageNumber = query.pageNumber,
                pageSize = query.pageSize,
                totalRecords = query.totalRecords
            };
        }
    }
}