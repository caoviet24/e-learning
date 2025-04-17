using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Faculties.Queries.GetAllFaculties
{
    [Authorize]
    public class GetAllFacultiesQuery : IRequest<ResponseList<FacultyDto>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public bool? isDeleted { get; set; }
    }

    public class GetAllFacultiesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ILogger<GetAllFacultiesQueryHandler> logger) : IRequestHandler<GetAllFacultiesQuery, ResponseList<FacultyDto>>
    {
        public async Task<ResponseList<FacultyDto>> Handle(GetAllFacultiesQuery request, CancellationToken cancellationToken)
        {
            var query = await unitOfWork.Faculties.GetAllAsync(
                request.pageNumber,
                request.pageSize,
                request.search,
                request.isDeleted
            );

            return new ResponseList<FacultyDto>
            {
                data = mapper.Map<List<FacultyDto>>(query.Items),
                pageNumber = query.pageNumber,
                pageSize = query.pageSize,
                totalRecords = query.totalRecords
            };
        }
    }
}