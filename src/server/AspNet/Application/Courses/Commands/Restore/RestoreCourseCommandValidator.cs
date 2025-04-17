using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Courses.Commands.Restore
{
    public class RestoreCourseCommandValidator : AbstractValidator<RestoreCourseCommand>
    {
        public RestoreCourseCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }
}