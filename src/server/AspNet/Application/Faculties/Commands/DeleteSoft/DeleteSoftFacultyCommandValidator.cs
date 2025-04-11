using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Faculties.Commands.DeleteSoft
{
    public class DeleteSoftFacultyCommandValidator : AbstractValidator<DeleteSoftFacultyCommand>
    {
        public DeleteSoftFacultyCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");
        }
    }
}