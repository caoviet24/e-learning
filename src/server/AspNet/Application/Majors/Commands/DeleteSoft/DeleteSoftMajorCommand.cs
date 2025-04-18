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

namespace Application.Majors.Commands.DeleteSoft
{
    [Authorize(Role = "ADMIN")]
    public class DeleteSoftMajorCommand : IRequest<Response<MajorDtoWithFaculty>>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteSoftMajorCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<DeleteSoftMajorCommand, Response<MajorDtoWithFaculty>>
    {
        public async Task<Response<MajorDtoWithFaculty>> Handle(DeleteSoftMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await unitOfWork.Majors.GetByIdAsync(request.Id);

            if (major == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.Id}");
            }

            var result = await unitOfWork.Majors.DeleteSoftAsync(major);
            if (result == null)
            {
                throw new BadRequestException("Xóa mềm chuyên ngành không thành công.");
            }

            return new Response<MajorDtoWithFaculty>
            {
                Data = mapper.Map<MajorDtoWithFaculty>(result),
                action = Domain.Enums.Action.DELETE_SOFT.ToString(),
                Message = "Xóa mềm chuyên ngành thành công",
                Ok = true,
            };
        }
    }
}