using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Exceptions;
using MediatR;

namespace Application.Lessons.Queries
{
    public record GetByIdQuery : IRequest<Response<LessonDto>>
    {
        public string id { get; set; } = null!;
    }

    public class GetByIdValidator : AbstractValidator<GetByIdQuery>
    {
        public GetByIdValidator()
        {
            RuleFor(x => x.id).NotEmpty();
        }
    }
    internal class GetByIdQueryHandler(
        IApplicationDbContext dbContext,
        IMapper mapper
    ) : IRequestHandler<GetByIdQuery, Response<LessonDto>>
    {
        public async Task<Response<LessonDto>> Handle(GetByIdQuery request, CancellationToken cancellationToken)
        {
            var lesson = await dbContext.Lessons.FindAsync(request.id);
            if (lesson == null) throw new NotFoundException("Lesson not found");
            var lessonDto = mapper.Map<LessonDto>(lesson);
            return Response<LessonDto>.Success(lessonDto, "Lấy thành công", "getById");
        }
    }
}