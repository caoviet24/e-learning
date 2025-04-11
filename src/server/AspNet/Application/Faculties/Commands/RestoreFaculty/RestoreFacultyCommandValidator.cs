using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Faculties.Commands.RestoreFaculty
{
    public class RestoreFacultyCommandValidator : AbstractValidator<RestoreFacultyCommand>
    {
        public RestoreFacultyCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("ID khoa không được để trống.");
        }
    }
}