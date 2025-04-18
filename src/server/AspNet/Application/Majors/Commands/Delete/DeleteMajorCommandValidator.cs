using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Majors.Commands.Delete
{
    public class DeleteMajorCommandValidator : AbstractValidator<DeleteMajorCommand>
    {
        public DeleteMajorCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");
        }
    }
}