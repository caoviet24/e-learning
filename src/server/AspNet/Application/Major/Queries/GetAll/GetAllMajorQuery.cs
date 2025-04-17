using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Major.Queries.GetAll
{
    [Authorize]
    public class GetAllMajorQuery : IRequest<ResponseList<MajorDtoWithFaculty>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public bool? isDeleted { get; set; }
        public string? facultyId { get; set; }
    }

    public class GetAllMajorQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetAllMajorQuery, ResponseList<MajorDtoWithFaculty>>
    {
        public async Task<ResponseList<MajorDtoWithFaculty>> Handle(GetAllMajorQuery request, CancellationToken cancellationToken)
        {
            var query = await unitOfWork.Majors.GetAllAsync(
                request.pageNumber,
                request.pageSize,
                request.search,
                request.isDeleted,
                request.facultyId
            );

            return new ResponseList<MajorDtoWithFaculty>
            {
                data = mapper.Map<List<MajorDtoWithFaculty>>(query.Items),
                pageNumber = query.pageNumber,
                pageSize = query.pageSize,
                totalRecords = query.totalCount
            };
        }
    }
}