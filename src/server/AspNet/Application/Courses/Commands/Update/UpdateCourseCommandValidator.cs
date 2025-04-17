using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Courses.Commands.Update
{
    public class UpdateCourseCommandValidator : AbstractValidator<UpdateCourseCommand>
    {
        public UpdateCourseCommandValidator()
        {
            RuleFor(x => x.id)
                .NotEmpty().WithMessage("ID không được để trống");
            RuleFor(x => x.title)
                .NotEmpty().WithMessage("Tên không được để trống");
            RuleFor(x => x.description)
                .NotEmpty().WithMessage("Mô tả không được để trống");
            RuleFor(x => x.thumbNail)
                .NotEmpty().WithMessage("Hình ảnh không được để trống");
        }
    }
}