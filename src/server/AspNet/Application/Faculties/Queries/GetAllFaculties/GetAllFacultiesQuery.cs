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

namespace Application.Faculties.Queries.GetAllFaculties
{
    [Authorize]
    public class GetAllFacultiesQuery : IRequest<FacultyListDto>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public bool? IsDeleted { get; set; }
    }

    public class GetAllFacultiesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetAllFacultiesQuery, FacultyListDto>
    {
        public async Task<FacultyListDto> Handle(GetAllFacultiesQuery request, CancellationToken cancellationToken)
        {
            var query = await unitOfWork.Faculties.GetAllAsync(
                request.PageNumber,
                request.PageSize,
                request.Search,
                request.IsDeleted
            );

            return new FacultyListDto
            {
                Items = query.Items.Select(x => mapper.Map<FacultyDto>(x)).ToList(),
                TotalCount = query.TotalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }
    }
}