using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Majors.Commands.DeleteSoft
{
    public class DeleteSoftMajorCommandValidator : AbstractValidator<DeleteSoftMajorCommand>
    {
        public DeleteSoftMajorCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");
        }
    }
}