using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Major.Commands.Update
{
    public class UpdateMajorCommandValidator : AbstractValidator<UpdateMajorCommand>
    {
        public UpdateMajorCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty()
                .WithMessage("ID không được để trống.");
                
            RuleFor(x => x.name)
                .NotEmpty()
                .WithMessage("Tên ngành không để trống.");

            RuleFor(x => x.code)
                .NotEmpty()
                .WithMessage("Mã ngành không để trống.");
                
            RuleFor(x => x.facultyId)
                .NotEmpty()
                .WithMessage("Mã khoa không được để trống.");
        }
    }
}