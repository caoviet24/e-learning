using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;

namespace Application.Faculties.Commands.UpdateFaculty
{
    [Authorize(Role = "ADMIN")]
    public class UpdateFacultyCommand : IRequest<Response<FacultyDto>>
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
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


            if (request.name == faculty.name && request.code == faculty.code)
            {
                throw new BadRequestException("Tên, mã khoa đã tồn tại");
            }

            faculty.name = request.name;
            faculty.code = request.code;

            var result = await unitOfWork.Faculties.UpdateAsync(faculty);
            if (result == null)
            {
                throw new BadRequestException("Cập nhật khoa không thành công.");
            }

            var data = mapper.Map<FacultyDto>(result);
            return new Response<FacultyDto>
            {
                Data = data,
                action = Domain.Enums.Action.UPDATE.ToString(),
                Message = "Cập nhật khoa thành công",
                Ok = true,
            };
        }
    }
}