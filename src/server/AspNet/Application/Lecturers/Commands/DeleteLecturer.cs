using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Lecturers.Commands
{
    [Authorize(Role = "ADMIN")]
    public class DeleteLecturerCommand : IRequest<LecturerDto>
    {
        public string id { get; set; } = null!;
    }

    public class DeleteLecturerCommandValidator : AbstractValidator<DeleteLecturerCommand>
    {
        public DeleteLecturerCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("Lecturer ID is required.");
        }
    }

    public class DeleteLecturerCommandHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<DeleteLecturerCommand, LecturerDto>
    {
        public async Task<LecturerDto> Handle(DeleteLecturerCommand request, CancellationToken cancellationToken)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                var lecturer = await dbContext.Lecturers
                    .Include(l => l.User)
                    .FirstOrDefaultAsync(l => l.User.Id == request.id, cancellationToken);

                if (lecturer == null)
                    throw new NotFoundException($"Không tìm thấy giảng viên với ID: {request.id}");

                // Check if lecturer has any dependent entities like courses, schedules, etc.
                var hasCourses = await dbContext.Courses.AnyAsync(c => c.createdBy == lecturer.User.Id, cancellationToken);
    
                
                if (hasCourses)
                    throw new BadRequestException("Giảng viên này không thể xóa vì có dữ liệu liên quan (khóa học, lịch dạy).");

                // Store lecturer info for response
                var lecturerDto = mapper.Map<LecturerDto>(lecturer);

                // Delete user if exists
                if (lecturer.User != null)
                {
                    dbContext.Users.Remove(lecturer.User);
                }

                // Delete lecturer
                dbContext.Lecturers.Remove(lecturer);
                await dbContext.SaveChangesAsync(cancellationToken);
                
                await transaction.CommitAsync(cancellationToken);

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