using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Majors.Commands
{
    [Authorize(Role = "ADMIN")]
    public class UpdateMajorCommand : IRequest<MajorDtoWithFaculty>
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public string facultyId { get; set; } = null!;
    }

    public class UpdateMajorCommandValidator : AbstractValidator<UpdateMajorCommand>
    {
        public UpdateMajorCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("ID is required.");

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

    public class UpdateMajorCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<UpdateMajorCommand, MajorDtoWithFaculty>
    {
        public async Task<MajorDtoWithFaculty> Handle(UpdateMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await dbContext.Majors.FindAsync(request.id);

            if (major == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.id}");
            }

            // Check if the name or code belongs to a different major (not this one)
            var existingByName = await dbContext.Majors.FirstOrDefaultAsync(m => m.name == request.name);
            if (existingByName != null && existingByName.Id != request.id)
            {
                throw new BadRequestException($"Tên chuyên ngành '{request.name}' đã được sử dụng");
            }

            var existingByCode = await dbContext.Majors.FirstOrDefaultAsync(m => m.code == request.code);
            if (existingByCode != null && existingByCode.Id != request.id)
            {
                throw new BadRequestException($"Mã chuyên ngành '{request.code}' đã được sử dụng");
            }

            // Check if the faculty exists
            var faculty = await dbContext.Faculties.FindAsync(request.facultyId);
            if (faculty == null)
            {
                throw new NotFoundException($"Không tìm thấy khoa với ID: {request.facultyId}");
            }

            major.name = request.name;
            major.code = request.code;
            major.facultyId = request.facultyId;

            var result = dbContext.Majors.Update(major);
            await dbContext.SaveChangesAsync(cancellationToken);
            if (result == null)
            {
                throw new BadRequestException("Cập nhật chuyên ngành không thành công.");
            }

            return mapper.Map<MajorDtoWithFaculty>(result);
        }
    }
}