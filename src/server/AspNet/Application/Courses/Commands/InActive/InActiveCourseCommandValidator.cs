using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Courses.Commands.InActive
{
    public class InActiveCourseCommandValidator : AbstractValidator<InActiveCourseCommand>
    {
        public InActiveCourseCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }
}