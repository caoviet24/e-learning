using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Lecturers.Queries.GetAll
{
    public class GetAllLecturerQueryValidator : AbstractValidator<GetAllLecturersQuery>
    {
        public GetAllLecturerQueryValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0)
                .WithMessage("Page number must be greater than 0.");

            RuleFor(x => x.pageSize)
                .GreaterThan(0)
                .WithMessage("Page size must be greater than 0.");
        }
    }
}