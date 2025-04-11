using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Faculties.Commands.DeleteFaculty
{
    public class DeleteFacultyCommandValidator : AbstractValidator<DeleteFacultyCommand>
    {
        public DeleteFacultyCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("ID khoa không được để trống.");
        }
    }
}