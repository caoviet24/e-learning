using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Validators;

namespace Application.Lecturers.Commands.Create
{
    public class CreateLecturerCommandValidator : AbstractValidator<CreateLecturerCommand>
    {
        public CreateLecturerCommandValidator()
        {
            RuleFor(x => x.facultyId)
                .NotEmpty()
                .WithMessage("Faculty ID is required.");
            
            RuleFor(x => x.majorId)
                .NotEmpty()
                .WithMessage("Major ID is required.");
                
            RuleFor(x => x.status)
                .NotEmpty()
                .WithMessage("Status is required.");
            
            RuleFor(x => x.position)
                .NotEmpty()
                .WithMessage("Position is required.");
            
            RuleFor(x => x.joinedAt)
                .NotEmpty()
                .WithMessage("Joined At date is required.");
        }
    }
}