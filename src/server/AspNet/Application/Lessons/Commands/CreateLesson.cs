using Application.Common.DTOs;
using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Entites;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Lessons.Commands.Create
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
            var newLesson = await dbContext.Lessons.AddAsync(lesson);
            await dbContext.SaveChangesAsync(cancellationToken);
            var lessonDto = mapper.Map<LessonDto>(newLesson);
            return new Response<LessonDto>() { Data = lessonDto, Message = "Thêm thành công", action = "create",Ok = true};
        }
    }
}