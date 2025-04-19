using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Faculties.Commands
{
    [Authorize(Role = "ADMIN")]
    public class ActivateFacultyCommand : IRequest<FacultyDto>
    {
        public string id { get; set; } = null!;
    }

    public class ActivateFacultyCommandValidator : AbstractValidator<ActivateFacultyCommand>
    {
        public ActivateFacultyCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }

    public class ActivateFacultyCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<ActivateFacultyCommand, FacultyDto>
    {
        public async Task<FacultyDto> Handle(ActivateFacultyCommand request, CancellationToken cancellationToken)
        {
            var transaction = await dbContext.Database.BeginTransactionAsync();
            var faculty = await dbContext.Faculties.FindAsync(request.id);

            if (faculty == null)
            {
                throw new NotFoundException("Khoa không tồn tại");
            }
            
            faculty.isActive = !faculty.isActive;
            var updatedFaculty = dbContext.Faculties.Update(faculty);
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return mapper.Map<FacultyDto>(updatedFaculty.Entity);
        }
    }
}