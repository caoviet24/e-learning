using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Lecturers.Commands
{
    [Authorize(Role = "ADMIN")]
    public class CreateLecturerCommand : IRequest<LecturerDto>
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

    public class CreateLecturerCommandHander(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<CreateLecturerCommand, LecturerDto>
    {
        public async Task<LecturerDto> Handle(CreateLecturerCommand request, CancellationToken cancellationToken)
        {
            var newUser = mapper.Map<User>(request);
            newUser.role = Domain.Enums.Role.LECTURER.ToString();

            var transaction = await dbContext.Database.BeginTransactionAsync();

            var user = await dbContext.Users.AddAsync(newUser);
            if (user.Entity == null)
            {
                throw new BadRequestException("Create user failed");
            }
            var countLec = await dbContext.Lecturers.CountAsync();
            var cardId = "";
            if (countLec > 0)
            {
                cardId = $"LECTURER{countLec + 1}";
            }
            else
            {
                cardId = "LECTURER1";
            }

            var newLecturer = mapper.Map<Lecturer>(request);
            newLecturer.userId = user.Entity.Id;
            newLecturer.cardId = cardId;

            var createdLecturer = await dbContext.Lecturers.AddAsync(newLecturer);
            if (createdLecturer == null)
            {
                await transaction.RollbackAsync();
                throw new BadRequestException("Create lecturer failed");
            }

            await transaction.CommitAsync();

            return mapper.Map<LecturerDto>(createdLecturer);
        }
    }
}