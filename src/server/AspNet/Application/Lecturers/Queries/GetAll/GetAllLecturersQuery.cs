using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Lecturers.Queries.GetAll
{
    [Authorize]
    public class GetAllLecturersQuery : IRequest<ResponseList<LecturerDto>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public string? facultyId { get; set; }
        public string? majorId { get; set; }
        public bool? isDeleted { get; set; }
    }

    public class GetAllLecturersQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetAllLecturersQuery, ResponseList<LecturerDto>>
    {
        public async Task<ResponseList<LecturerDto>> Handle(GetAllLecturersQuery request, CancellationToken cancellationToken)
        {
            var query = await unitOfWork.Lecturers.GetAllAsync(
                request.pageNumber,
                request.pageSize,
                request.search,
                request.facultyId,
                request.majorId,
                request.isDeleted
            );

            return new ResponseList<LecturerDto>
            {
                data = mapper.Map<List<LecturerDto>>(query.Items),
                pageNumber = query.pageNumber,
                pageSize = query.pageSize,
                totalRecords = query.totalRecords
            };
        }
    }
}