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

namespace Application.Major.Commands.Restore
{
    [Authorize(Role = "ADMIN")]
    public class RestoreMajorCommand : IRequest<Response<MajorDtoWithFaculty>>
    {
        public string Id { get; set; } = null!;
    }
    public class RestoreMajorCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<RestoreMajorCommand, Response<MajorDtoWithFaculty>>
    {
        public async Task<Response<MajorDtoWithFaculty>> Handle(RestoreMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await unitOfWork.Majors.GetByIdAsync(request.Id);

            if (major == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.Id}");
            }

            var result = await unitOfWork.Majors.RestoreAsync(major);
            if (result == null)
            {
                throw new BadRequestException("Khôi phục chuyên ngành không thành công.");
            }

            return new Response<MajorDtoWithFaculty>
            {
                Data = mapper.Map<MajorDtoWithFaculty>(result),
                action = Domain.Enums.Action.RESTORE.ToString(),
                Message = "Khôi phục chuyên ngành thành công",
                Ok = true,
            };
        }
    }
}