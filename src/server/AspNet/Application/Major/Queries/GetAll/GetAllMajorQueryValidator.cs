using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Major.Queries.GetAll
{
    public class GetAllMajorQueryValidator : AbstractValidator<GetAllMajorQuery>
    {
        public GetAllMajorQueryValidator()
        {
            RuleFor(x => x.pageNumber)
                .GreaterThan(0)
                .WithMessage("Số trang phải lớn hơn 0.");

            RuleFor(x => x.pageSize)
                .GreaterThan(0)
                .WithMessage("Kích thước trang phải lớn hơn 0.");
        }
    }
}