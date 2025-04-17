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
using Microsoft.Extensions.Logging;

namespace Application.Faculties.Commands.DeleteFaculty
{
    [Authorize(Role = "ADMIN")]
    public class DeleteFacultyCommand : IRequest<Response<FacultyDto>>
    {
        public string Id { get; set; } = null!;
    }

    public class DeleteFacultyCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<DeleteFacultyCommand, Response<FacultyDto>>
    {
        public async Task<Response<FacultyDto>> Handle(DeleteFacultyCommand request, CancellationToken cancellationToken)
        {
            var faculty = await unitOfWork.Faculties.GetByIdAsync(request.Id);

            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.Id}");
            }


            var hasDependentEntities = await unitOfWork.Faculties.HasDependentEntitiesAsync(faculty.Id);
            if (hasDependentEntities)
            {
                throw new BadRequestException("Không thể xóa khoa này vì có liên kết với các dữ liệu khác.");
            }

            var result = await unitOfWork.Faculties.DeleteAsync(faculty);

            if (result == null)
            {
                throw new BadRequestException("Xóa khoa không thành công.");
            }

            var data = mapper.Map<FacultyDto>(result);
            return new Response<FacultyDto>
            {
                Data = data,
                action = Domain.Enums.Action.DELETE.ToString(),
                Message = "Xóa khoa thành công",
                Ok = true,
            };
        }
    }
}