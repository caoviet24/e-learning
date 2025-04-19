using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Lessons.Commands
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public record DeleteLessonCommand : IRequest<Response<LessonDto>>
    {
        public string id { get; init; } = null!;
    }

    public class DeleteLessonValidator : AbstractValidator<DeleteLessonCommand>
    {
        public DeleteLessonValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("Lesson ID is required.");
        }
    }

    internal class DeleteLessonCommandHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<DeleteLessonCommand, Response<LessonDto>>
    {
        public async Task<Response<LessonDto>> Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
        {
            var lesson = await dbContext.Lessons.FindAsync(request.id);
            if (lesson == null) throw new NotFoundException("Bài học không tồn tại");

            // Check if there are dependent entities (like exams, questions, etc.) if needed
            // For example: var hasDependent = await CheckForDependentEntities(request.id);

            dbContext.Lessons.Remove(lesson);
            await dbContext.SaveChangesAsync(cancellationToken);

            var lessonDto = mapper.Map<LessonDto>(lesson);
            return Response<LessonDto>.Success(
                data: lessonDto,
                message: "Xóa bài học thành công",
                action: Domain.Enums.Action.DELETE.ToString()
            );
        }
    }
}