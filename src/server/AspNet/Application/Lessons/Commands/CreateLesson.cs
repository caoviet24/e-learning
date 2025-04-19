using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Lessons.Commands
{
    [Authorize(Role = "ADMIN,LECTURER")]
    public record CreateLessonCommand : IRequest<Response<LessonDto>>
    {
        public string title { get; init; } = null!;
        public string description { get; init; } = null!;
        public string thumbnail { get; init; } = null!;
        public string urlVideo { get; init; } = null!;
        public string courseId { get; init; } = null!;
    }

    public class CreateLessonValidator : AbstractValidator<CreateLessonCommand>
    {
        public CreateLessonValidator()
        {
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
                
            RuleFor(x => x.courseId)
                .NotEmpty()
                .WithMessage("Course ID is required.");
        }
    }

    internal class CreateLessonCommandHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<CreateLessonCommand, Response<LessonDto>>
    {
        public async Task<Response<LessonDto>> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
        {
            var course = await dbContext.Courses.FindAsync(request.courseId);
            if (course == null) throw new NotFoundException("Course not found");

            var highestPosition = await dbContext.Lessons
                                .Where(x => x.courseId == request.courseId)
                                .MaxAsync(x => (int?)x.position) ?? 0;
            var position = highestPosition + 1;
            var lesson = mapper.Map<Lesson>(request);
            lesson.position = position;
            
            await dbContext.Lessons.AddAsync(lesson, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            
            var lessonDto = mapper.Map<LessonDto>(lesson);
            return Response<LessonDto>.Success(
                data: lessonDto,
                message: "Thêm bài học thành công",
                action: Domain.Enums.Action.CREATE.ToString()
            );
        }
    }
}