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
using Microsoft.AspNetCore.Mvc;

namespace Application.Major.Commands.Update
{
    [Authorize(Role = "ADMIN")]
    public class UpdateMajorCommand : IRequest<Response<MajorDtoWithFaculty>>
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public string facultyId { get; set; } = null!;
    }


    public class UpdateMajorCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<UpdateMajorCommand, Response<MajorDtoWithFaculty>>
    {

        public async Task<Response<MajorDtoWithFaculty>> Handle(UpdateMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await unitOfWork.Majors.GetByIdAsync(request.id);

            if (major == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.id}");
            }


            if (request.name == major.name && request.code == major.code)
            {
                throw new BadRequestException("Tên, mã chuyên ngành đã tồn tại");
            }

            major.name = request.name;
            major.code = request.code;
            major.facultyId = request.facultyId;

            var result = await unitOfWork.Majors.UpdateAsync(major);
            if (result == null)
            {
                throw new BadRequestException("Cập nhật chuyên ngành không thành công.");
            }

            var data = mapper.Map<MajorDtoWithFaculty>(result);
            return new Response<MajorDtoWithFaculty>
            {
                Data = data,
                action = Domain.Enums.Action.UPDATE.ToString(),
                Message = "Cập nhật chuyên ngành thành công",
                Ok = true,
            };
        }
    }
}