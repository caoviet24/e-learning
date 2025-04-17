using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Courses.Commands.Active
{
    public class ActiveCourseCommandValidator : AbstractValidator<ActiveCourseCommand>
    {
        public ActiveCourseCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }
}