using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Majors.Commands
{
    [Authorize(Role = "ADMIN")]
    public class DeleteMajorCommand : IRequest<MajorDtoWithFaculty>
    {
        public string Id { get; set; } = null!;
    }

    public class DeleteMajorCommandValidator : AbstractValidator<DeleteMajorCommand>
    {
        public DeleteMajorCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");
        }
    }
    public class DeleteMajorCommandHandler(IApplicationDbContext dbContext, IMapper mapper) : IRequestHandler<DeleteMajorCommand, MajorDtoWithFaculty>
    {
        public async Task<MajorDtoWithFaculty> Handle(DeleteMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await dbContext.Majors.FindAsync(request.Id);

            if (major == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.Id}");
            }


            var result = dbContext.Majors.Remove(major);
            await  dbContext.SaveChangesAsync(cancellationToken);
            if (result == null)
            {
                throw new BadRequestException("Xóa chuyên ngành không thành công.");
            }

            return mapper.Map<MajorDtoWithFaculty>(result);
        }
    }
}