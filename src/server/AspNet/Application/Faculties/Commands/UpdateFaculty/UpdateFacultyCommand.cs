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

namespace Application.Faculties.Commands.UpdateFaculty
{
    [Authorize(Role = "ADMIN")]
    public class UpdateFacultyCommand : IRequest<Response<FacultyDto>>
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
    }

    public class UpdateFacultyCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<UpdateFacultyCommand, Response<FacultyDto>>
    {

        public async Task<Response<FacultyDto>> Handle(UpdateFacultyCommand request, CancellationToken cancellationToken)
        {
            var faculty = await unitOfWork.Faculties.GetByIdAsync(request.Id);

            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.Id}");
            }


            if (request.Name == faculty.Name && request.Code == faculty.Code)
            {
                throw new BadRequestException("Tên, mã khoa đã tồn tại");
            }


            var result = await unitOfWork.Faculties.UpdateAsync(faculty);
            if (result == null)
            {
                throw new BadRequestException("Cập nhật khoa không thành công.");
            }

            var data = mapper.Map<FacultyDto>(result);
            return new Response<FacultyDto>
            {
                Data = data,
                Message = "Cập nhật khoa thành công",
                Ok = true,
            };
        }
    }
}