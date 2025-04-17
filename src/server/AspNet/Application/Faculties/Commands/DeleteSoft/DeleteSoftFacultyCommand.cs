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

namespace Application.Faculties.Commands.DeleteSoft
{
    [Authorize(Role = "ADMIN")]
    public class DeleteSoftFacultyCommand : IRequest<Response<FacultyDto>>
    {
        public string Id { get; set; } = null!;
    }

    public class DeleteSoftFacultyCommandResponse(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<DeleteSoftFacultyCommand, Response<FacultyDto>>
    {
        public async Task<Response<FacultyDto>> Handle(DeleteSoftFacultyCommand request, CancellationToken cancellationToken)
        {
            var faculty = await unitOfWork.Faculties.GetByIdAsync(request.Id);

            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.Id}");
            }

            var result = await unitOfWork.Faculties.DeleteSoftAsync(faculty);

            if (result == null)
            {
                throw new BadRequestException("Xóa khoa không thành công.");
            }

            var data = mapper.Map<FacultyDto>(result);
            return new Response<FacultyDto>
            {
                Data = data,
                action = Domain.Enums.Action.DELETE_SOFT.ToString(),
                Message = "Xóa tạm thời khoa thành công",
                Ok = true,
            };
        }
    }
}