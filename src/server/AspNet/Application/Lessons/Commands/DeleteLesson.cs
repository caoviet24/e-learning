

using Application.Common.DTOs;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Exceptions;
using MediatR;

namespace Application.Lessons.Commands
{
    public record DeleteLessonCommand : IRequest<Response<LessonDto>>
    {
        public string id { get; init; } = null!;
    }

    public class DeleteLessonValidator : AbstractValidator<DeleteLessonCommand>
    {
        public DeleteLessonValidator()
        {
            RuleFor(x=>x.id).NotEmpty();
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
            if (lesson == null) throw new NotFoundException("Lesson not found");
            dbContext.Lessons.Remove(lesson);
            await dbContext.SaveChangesAsync(cancellationToken);
            var lessonDto = mapper.Map<LessonDto>(lesson);
            return Response<LessonDto>.Success(lessonDto, "Xóa thành công", "delete");
        }
    }
}