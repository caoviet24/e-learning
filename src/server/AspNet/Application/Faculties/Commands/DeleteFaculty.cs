using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Faculties.Commands
{
    [Authorize(Role = "ADMIN")]
    public class DeleteFacultyCommand : IRequest<FacultyDto>
    {
        public string id { get; set; } = null!;
    }

    public class DeleteFacultyCommandValidator : AbstractValidator<DeleteFacultyCommand>
    {
        public DeleteFacultyCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("ID khoa không được để trống.");
        }
    }

    public class DeleteFacultyCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<DeleteFacultyCommand, FacultyDto>
    {
        public async Task<FacultyDto> Handle(DeleteFacultyCommand request, CancellationToken cancellationToken)
        {
            var transaction = await dbContext.Database.BeginTransactionAsync();
            var faculty = await dbContext.Faculties.FindAsync(request.id);

            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.id}");
            }

            // Check for dependencies before deleting
            var hasMajor = await dbContext.Majors.AnyAsync(m => m.facultyId == request.id);
            var hasLecturer = await dbContext.Lecturers.AnyAsync(l => l.facultyId == request.id);
            var hasStudent = await dbContext.Students.AnyAsync(s => s.facultyId == request.id);
            
            if (hasMajor || hasLecturer || hasStudent)
            {
                throw new BadRequestException("Không thể xóa khoa này vì có liên kết với các dữ liệu khác.");
            }

            dbContext.Faculties.Remove(faculty);
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            
            return mapper.Map<FacultyDto>(faculty);
        }
    }
}