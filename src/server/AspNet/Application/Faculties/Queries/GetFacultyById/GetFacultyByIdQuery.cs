using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;

namespace Application.Faculties.Queries.GetFacultyById
{
    [Authorize]
    public class GetFacultyByIdQuery : IRequest<Response<FacultyDto>>
    {
        public string Id { get; set; } = null!;
    }

    public class GetFacultyByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetFacultyByIdQuery, Response<FacultyDto>>
    {

        public async Task<Response<FacultyDto>> Handle(GetFacultyByIdQuery request, CancellationToken cancellationToken)
        {
            var faculty = await unitOfWork.Faculties.GetByIdAsync(request.Id);

            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.Id}");
            }

            var data = mapper.Map<FacultyDto>(faculty);
            return new Response<FacultyDto>
            {
                Data = data,
                Message = "Lấy thông tin khoa thành công",
                Ok = true,
            };
        }
    }
}