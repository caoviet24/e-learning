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

namespace Application.Lecturers.Commands.Create
{
    [Authorize(Role = "ADMIN")]
    public class CreateLecturerCommand : IRequest<Response<LecturerDto>>
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
        public string email { get; set; } = null!;
        public string phone { get; set; } = null!;
        public string fullName { get; set; } = null!;
        public byte gender { get; set; }
        public string? cardId { get; set; } // Optional because it's auto-generated
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
        public string? userId { get; set; } // Optional because it's assigned from created user
        public string status { get; set; } = null!;
        public string position { get; set; } = null!;
        public DateTime joinedAt { get; set; }
    }

    public class CreateLecturerCommandHander : IRequestHandler<CreateLecturerCommand, Response<LecturerDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateLecturerCommandHander(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Response<LecturerDto>> Handle(CreateLecturerCommand request, CancellationToken cancellationToken)
        {
            var newUser = _mapper.Map<User>(request);
            newUser.role = Domain.Enums.Role.LECTURER.ToString();

            await _unitOfWork.BeginTransactionAsync();

            var user = await _unitOfWork.Users.AddAsync(newUser);
            if (user == null)
            {
                throw new BadRequestException("Create user failed");
            }
            var countLec = await _unitOfWork.Lecturers.CountAsync();
            var cardId = "";
            if (countLec > 0)
            {
                cardId = $"LECTURER{countLec + 1}";
            }
            else
            {
                cardId = "LECTURER1";
            }

            var newLecturer = _mapper.Map<Lecturer>(request);
            newLecturer.userId = user.Id;
            newLecturer.cardId = cardId;

            var createdLecturer = await _unitOfWork.Lecturers.AddAsync(newLecturer);
            if (createdLecturer == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw new BadRequestException("Create lecturer failed");
            }

            await _unitOfWork.CommitTransactionAsync();

            var lecturerDto = _mapper.Map<LecturerDto>(createdLecturer);

            return Response<LecturerDto>.Success(
                data: lecturerDto,
                message: "Lecturer created successfully",
                action: Domain.Enums.Action.CREATE.ToString()
            );
        }
    }
}