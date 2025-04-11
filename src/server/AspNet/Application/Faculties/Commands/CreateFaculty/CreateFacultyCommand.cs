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

namespace Application.Faculties.Commands.CreateFaculty
{
    [Authorize(Role = "ADMIN")]
    public class CreateFacultyCommand : IRequest<Response<FacultyDto>>
    {
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
    }

    public class CreateFacultyCommandHandler : IRequestHandler<CreateFacultyCommand, Response<FacultyDto>>
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateFacultyCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<Response<FacultyDto>> Handle(CreateFacultyCommand request, CancellationToken cancellationToken)
        {
            var existingFaculty = await _unitOfWork.Faculties.GetByNameAsync(request.Name);
            if (existingFaculty != null)
            {
                throw new BadRequestException($"Khoa với mã '{request.Code}' đã tồn tại");
            }

            var faculty = _mapper.Map<Faculty>(request);

            var createdFaculty = await _unitOfWork.Faculties.AddAsync(faculty);
            await _unitOfWork.SaveChangesAsync();

            var data = _mapper.Map<FacultyDto>(createdFaculty);
            return new Response<FacultyDto>
            {
                Data = data,
                Message = "Thêm khoa thành công",
                Ok = true,
            };
        }
    }
}