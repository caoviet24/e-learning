using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Faculties.Queries.GetFacultyById
{
    public class GetFacultyByIdQueryValidator : AbstractValidator<GetFacultyByIdQuery>
    {
        public GetFacultyByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("ID khoa không được để trống.");
        }
    }
}