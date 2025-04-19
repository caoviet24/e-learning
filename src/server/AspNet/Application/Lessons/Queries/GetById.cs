using Application.Common.Interfaces;
using AutoMapper;
using Domain.Exceptions;

namespace Application.Lessons.Queries
{
    public record GetLessonByIdQuery : IRequest<LessonDto>
    {
        public string id { get; init; } = null!;
    }

    public class GetLessonByIdValidator : AbstractValidator<GetLessonByIdQuery>
    {
        public GetLessonByIdValidator()
        {
            RuleFor(x => x.id).NotEmpty().WithMessage("Lesson ID is required.");
        }
    }

    internal class GetLessonByIdQueryHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<GetLessonByIdQuery, LessonDto>
    {
        public async Task<LessonDto> Handle(GetLessonByIdQuery request, CancellationToken cancellationToken)
        {
            var lesson = await dbContext.Lessons.FindAsync(new object[] { request.id }, cancellationToken);

            if (lesson == null)
                throw new NotFoundException("Không tìm thấy bài học");

            return mapper.Map<LessonDto>(lesson);

        }
    }
}