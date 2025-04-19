using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Faculties.Commands
{
    [Authorize(Role = "ADMIN")]
    public class CreateFacultyCommand : IRequest<FacultyDto>
    {
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
    }

    public class CreateFacultyCommandValidator : AbstractValidator<CreateFacultyCommand>
    {
        public CreateFacultyCommandValidator()
        {
            RuleFor(x => x.name)
                .NotEmpty()
                .WithMessage("Tên khoa không được để trống.")
                .MaximumLength(200)
                .WithMessage("Tên khoa không được vượt quá 200 ký tự.");

            RuleFor(x => x.code)
                .NotEmpty()
                .WithMessage("Mã khoa không được để trống.")
                .MaximumLength(50)
                .WithMessage("Mã khoa không được vượt quá 50 ký tự.");
        }
    }

    public class CreateFacultyCommandHandler(
        IApplicationDbContext dbContext,
        IMapper mapper,
        IUser user
    ) : IRequestHandler<CreateFacultyCommand, FacultyDto>
    {
        public async Task<FacultyDto> Handle(CreateFacultyCommand request, CancellationToken cancellationToken)
        {
            var transaction = await dbContext.Database.BeginTransactionAsync();
            
            var existingFaculty = await dbContext.Faculties.FirstOrDefaultAsync(x => x.name == request.name || x.code == request.code, cancellationToken);
            if (existingFaculty != null)
            {
                throw new BadRequestException("Khoa với tên hoặc mã này đã tồn tại");
            }

            var faculty = mapper.Map<Faculty>(request);
            faculty.createdBy = user.getCurrentUser();

            var result = await dbContext.Faculties.AddAsync(faculty, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            
            if (result == null)
            {
                throw new BadRequestException("Thêm khoa thất bại");
            }
            
            var facultyDto = mapper.Map<FacultyDto>(result.Entity);
            await transaction.CommitAsync();
            
            return facultyDto;
        }
    }
}