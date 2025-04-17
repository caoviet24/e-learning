using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Major.Queries.GetById
{
    public class GetMajorByIdQueryValidator : AbstractValidator<GetMajorByIdQuery>
    {
        public GetMajorByIdQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");
        }
    }
}