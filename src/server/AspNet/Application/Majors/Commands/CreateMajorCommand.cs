using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Majors.Commands
{
    [Authorize(Role = "ADMIN")]
    public class CreateMajorCommand : IRequest<MajorDtoWithFaculty>
    {
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public string facultyId { get; set; } = null!;
    }

    public class CreateMajorCommandValidator : AbstractValidator<CreateMajorCommand>
    {
        public CreateMajorCommandValidator()
        {
            RuleFor(x => x.name)
                .NotEmpty()
                .WithMessage("Name is required.")
                .MaximumLength(100)
                .WithMessage("Name must not exceed 100 characters.");

            RuleFor(x => x.code)
                .NotEmpty()
                .WithMessage("Code is required.")
                .MaximumLength(20)
                .WithMessage("Code must not exceed 20 characters.");

            RuleFor(x => x.facultyId)
                .NotEmpty()
                .WithMessage("Faculty ID is required.");
        }
    }

    public class CreateMajorCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<CreateMajorCommand, MajorDtoWithFaculty>
    {
        public async Task<MajorDtoWithFaculty> Handle(CreateMajorCommand request, CancellationToken cancellationToken)
        {
            // Check if major with the same name already exists
            var existingMajor = await dbContext.Majors.Where(m => m.name == request.name).FirstOrDefaultAsync(cancellationToken);
            if (existingMajor != null)
            {
                throw new BadRequestException($"Chuyên ngành với tên '{request.name}' đã tồn tại");
            }

            // Check if major with the same code already exists
            var existingCode = await dbContext.Majors.Where(m => m.code == request.code).FirstOrDefaultAsync(cancellationToken);
            if (existingCode != null)
            {
                throw new BadRequestException($"Mã chuyên ngành '{request.code}' đã được sử dụng");
            }

            // Check if faculty exists
            var faculty = await dbContext.Faculties.FindAsync(request.facultyId);
            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.facultyId}");
            }

            var newMajor = await dbContext.Majors.AddAsync(mapper.Map<Domain.Entites.Major>(request));

            await dbContext.SaveChangesAsync(cancellationToken);
            return mapper.Map<MajorDtoWithFaculty>(newMajor);
        }
    }
}