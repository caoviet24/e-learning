using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Major.Commands.Restore
{
    public class RestoreMajorCommandValidator : AbstractValidator<RestoreMajorCommand>
    {
        public RestoreMajorCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");
        }
    }
}