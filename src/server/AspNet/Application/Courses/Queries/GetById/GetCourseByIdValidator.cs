using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Courses.Queries.GetById
{
    public class GetCourseByIdValidator : AbstractValidator<GetCourseByIdQuery>
    {
        public GetCourseByIdValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
        }
    }
}