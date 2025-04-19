using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Lessons.Commands
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public record UpdateLessonCommand : IRequest<Response<LessonDto>>
    {
        public string id { get; init; } = null!;
        public string title { get; init; } = null!;
        public string description { get; init; } = null!;
        public string thumbnail { get; init; } = null!;
        public string urlVideo { get; init; } = null!;
    }

    public class UpdateLessonValidator : AbstractValidator<UpdateLessonCommand>
    {
        public UpdateLessonValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("ID is required.");

            RuleFor(x => x.title)
                .NotEmpty()
                .WithMessage("Title is required.")
                .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters.");

            RuleFor(x => x.description)
                .NotEmpty()
                .WithMessage("Description is required.")
                .MaximumLength(500)
                .WithMessage("Description must not exceed 500 characters.");

            RuleFor(x => x.thumbnail)
                .NotEmpty()
                .WithMessage("Thumbnail is required.");

            RuleFor(x => x.urlVideo)
                .NotEmpty()
                .WithMessage("Video URL is required.");
        }
    }

    internal class UpdateLessonCommandHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<UpdateLessonCommand, Response<LessonDto>>
    {
        public async Task<Response<LessonDto>> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
        {
            var lesson = await dbContext.Lessons.FindAsync(request.id);
            if (lesson == null) throw new NotFoundException("Lesson not found");

            lesson.title = request.title;
            lesson.description = request.description;
            lesson.thumbnail = request.thumbnail;
            lesson.urlVideo = request.urlVideo;

            dbContext.Lessons.Update(lesson);
            await dbContext.SaveChangesAsync(cancellationToken);

            var lessonDto = mapper.Map<LessonDto>(lesson);
            return Response<LessonDto>.Success(
                data: lessonDto,
                message: "Cập nhật bài học thành công",
                action: Domain.Enums.Action.UPDATE.ToString()
            );
        }
    }
}