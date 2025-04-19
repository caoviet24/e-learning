using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Lecturers.Commands
{
    [Authorize(Role = "ADMIN")]
    public class UpdateLecturerCommand : IRequest<LecturerDto>
    {
        public string id { get; set; } = null!;
        public string email { get; set; } = null!;
        public string phone { get; set; } = null!;
        public string fullName { get; set; } = null!;
        public byte gender { get; set; }
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
        public string status { get; set; } = null!;
        public string position { get; set; } = null!;
        public DateTime joinedAt { get; set; }
    }

    public class UpdateLecturerCommandValidator : AbstractValidator<UpdateLecturerCommand>
    {
        public UpdateLecturerCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("ID is required.");

            RuleFor(x => x.email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .EmailAddress()
                .WithMessage("Invalid email format.");

            RuleFor(x => x.phone)
                .NotEmpty()
                .WithMessage("Phone number is required.")
                .Matches(@"^\d{10,11}$")
                .WithMessage("Phone number must be 10-11 digits.");

            RuleFor(x => x.fullName)
                .NotEmpty()
                .WithMessage("Full name is required.")
                .MaximumLength(100)
                .WithMessage("Full name must not exceed 100 characters.");

            RuleFor(x => x.facultyId)
                .NotEmpty()
                .WithMessage("Faculty ID is required.");

            RuleFor(x => x.majorId)
                .NotEmpty()
                .WithMessage("Major ID is required.");
        }
    }

    public class UpdateLecturerCommandHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<UpdateLecturerCommand, LecturerDto>
    {
        public async Task<LecturerDto> Handle(UpdateLecturerCommand request, CancellationToken cancellationToken)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                var lecturer = await dbContext.Lecturers
                    .Include(l => l.User)
                    .FirstOrDefaultAsync(l => l.userId == request.id, cancellationToken);

                if (lecturer == null)
                    throw new NotFoundException($"Không tìm thấy giảng viên với ID: {request.id}");

                // Check if faculty exists
                var faculty = await dbContext.Faculties.FindAsync(new object[] { request.facultyId }, cancellationToken);
                if (faculty == null)
                    throw new BadRequestException($"Khoa không tồn tại với ID: {request.facultyId}");

                // Check if major exists
                var major = await dbContext.Majors.FindAsync(new object[] { request.majorId }, cancellationToken);
                if (major == null)
                    throw new BadRequestException($"Chuyên ngành không tồn tại với ID: {request.majorId}");
                mapper.Map(request, lecturer);

                dbContext.Lecturers.Update(lecturer);
                await dbContext.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                var lecturerDto = mapper.Map<LecturerDto>(lecturer);

                return lecturerDto;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }
    }
}