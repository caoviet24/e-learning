using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Faculties.Commands.CreateFaculty
{
    public class CreateFacultyCommandValidator : AbstractValidator<CreateFacultyCommand>
    {
        public CreateFacultyCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên khoa không được để trống.")
                .MaximumLength(200)
                .WithMessage("Tên khoa không được vượt quá 200 ký tự.");

            RuleFor(x => x.Code)
                .NotEmpty()
                .WithMessage("Mã khoa không được để trống.")
                .MaximumLength(50)
                .WithMessage("Mã khoa không được vượt quá 50 ký tự.");
        }
    }
}