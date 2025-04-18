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

namespace Application.Majors.Commands.Delete
{
    [Authorize(Role = "ADMIN")]
    public class DeleteMajorCommand : IRequest<Response<MajorDtoWithFaculty>>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteMajorCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<DeleteMajorCommand, Response<MajorDtoWithFaculty>>
    {
        public async Task<Response<MajorDtoWithFaculty>> Handle(DeleteMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await unitOfWork.Majors.GetByIdAsync(request.Id);

            if (major == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.Id}");
            }

            var hasDependent = await unitOfWork.Majors.HasDependentEntitiesAsync(request.Id);
            if (hasDependent)
            {
                throw new BadRequestException("Chuyên ngành này không thể xóa vì có các thực thể phụ thuộc.");
            }

            var result = await unitOfWork.Majors.DeleteAsync(major);
            if (result == null)
            {
                throw new BadRequestException("Xóa chuyên ngành không thành công.");
            }

            return new Response<MajorDtoWithFaculty>
            {
                Data = mapper.Map<MajorDtoWithFaculty>(result),
                action = Domain.Enums.Action.DELETE.ToString(),
                Message = "Xóa chuyên ngành thành công",
                Ok = true,
            };
        }
    }
}