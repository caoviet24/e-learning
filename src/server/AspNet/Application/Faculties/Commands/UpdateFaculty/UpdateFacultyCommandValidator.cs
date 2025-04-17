using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Faculties.Commands.UpdateFaculty
{
    public class UpdateFacultyCommandValidator : AbstractValidator<UpdateFacultyCommand>
    {
        public UpdateFacultyCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("ID khoa không được để trống.");

            RuleFor(x => x.name)
                .NotEmpty()
                .WithMessage("Tên khoa không được để trống.")
                .MaximumLength(200)
                .WithMessage("Tên khoa không được vượt quá 200 ký tự.");

            RuleFor(x => x.code)
                .NotEmpty()
                .WithMessage("Mã khoa không được để trống.")
                .MaximumLength(50)
                .WithMessage("Mã khoa không được vượt quá 50 ký tự.");
        }
    }
}