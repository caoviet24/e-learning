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

namespace Application.Majors.Commands.Create
{
    [Authorize(Role = "ADMIN")]
    public class CreateMajorCommand : IRequest<Response<MajorDtoWithFaculty>>
    {
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public string facultyId { get; set; } = null!;
    }

    public class CreateMajorCommandHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<CreateMajorCommand, Response<MajorDtoWithFaculty>>
    {
        public async Task<Response<MajorDtoWithFaculty>> Handle(CreateMajorCommand request, CancellationToken cancellationToken)
        {
            var existingMajor = await unitOfWork.Majors.GetByNameAsync(request.name);
            if (existingMajor!= null)
            {
                throw new BadRequestException($"Chuyên ngành với tên '{request.name}' đã tồn tại");
            }


            var faculty = await unitOfWork.Faculties.GetByIdAsync(request.facultyId);

            if (faculty == null || request.facultyId != faculty.Id)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.facultyId}");
            }

            var newMajor = await unitOfWork.Majors.AddAsync(mapper.Map<Domain.Entites.Major>(request));
            return new Response<MajorDtoWithFaculty>
            {
                Data = mapper.Map<MajorDtoWithFaculty>(newMajor),
                action = Domain.Enums.Action.CREATE.ToString(),
                Message = "Thêm chuyên ngành thành công",
                Ok = true,
            };
        }
    }


}