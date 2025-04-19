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
    public class UpdateFacultyCommand : IRequest<FacultyDto>
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
    }

    public class UpdateFacultyCommandValidator : AbstractValidator<UpdateFacultyCommand>
    {
        public UpdateFacultyCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("ID khoa không được để trống.");

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

    public class UpdateFacultyCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<UpdateFacultyCommand, FacultyDto>
    {
        public async Task<FacultyDto> Handle(UpdateFacultyCommand request, CancellationToken cancellationToken)
        {
            var transaction = await dbContext.Database.BeginTransactionAsync();
            
            var faculty = await dbContext.Faculties.FindAsync(request.id);
            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.id}");
            }

            // Check for duplicate name or code with other faculties
            var existingFaculty = await dbContext.Faculties
                .FirstOrDefaultAsync(x => (x.name == request.name || x.code == request.code) && x.Id != request.id, cancellationToken);
                
            if (existingFaculty != null)
            {
                throw new BadRequestException("Tên hoặc mã khoa đã tồn tại");
            }

            faculty.name = request.name;
            faculty.code = request.code;

            var result = dbContext.Faculties.Update(faculty);
            await dbContext.SaveChangesAsync(cancellationToken);
            
            if (result == null)
            {
                throw new BadRequestException("Cập nhật khoa không thành công.");
            }

            var facultyDto = mapper.Map<FacultyDto>(result.Entity);
            await transaction.CommitAsync();
            
            return facultyDto;
        }
    }
}