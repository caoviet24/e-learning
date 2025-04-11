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

namespace Application.Faculties.Commands.RestoreFaculty
{
    [Authorize(Role = "ADMIN")]
    public class RestoreFacultyCommand : IRequest<Response<FacultyDto>>
    {
        public string Id { get; set; } = null!;
    }

    public class RestoreFacultyCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<RestoreFacultyCommand, Response<FacultyDto>>
    {

        public async Task<Response<FacultyDto>> Handle(RestoreFacultyCommand request, CancellationToken cancellationToken)
        {
            var faculty = await unitOfWork.Faculties.GetByIdAsync(request.Id);

            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.Id}");
            }

            if (faculty.IsDeleted != true)
            {
                throw new BadRequestException("Khoa này chưa bị xóa.");
            }


            var result = await unitOfWork.Faculties.RestoreAsync(faculty);

            if (result == null)
            {
                throw new BadRequestException("Khôi phục khoa không thành công.");
            }

            var data = mapper.Map<FacultyDto>(result);
            
            return new Response<FacultyDto>
            {
                Data = data,
                Message = "Khôi phục khoa thành công",
                Ok = true,
            };
        }
    }
}