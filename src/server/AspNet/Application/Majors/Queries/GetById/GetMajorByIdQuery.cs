using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Common.Sercurity;
using AutoMapper;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;

namespace Application.Majors.Queries.GetById
{
    [Authorize]
    public class GetMajorByIdQuery : IRequest<Response<MajorDto>>
    {
        public string Id { get; set; } = null!;
    }

    public class GetMajorByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper) : IRequestHandler<GetMajorByIdQuery, Response<MajorDto>>
    {
        public async Task<Response<MajorDto>> Handle(GetMajorByIdQuery request, CancellationToken cancellationToken)
        {
            var query = await unitOfWork.Majors.GetByIdAsync(request.Id);

            if (query == null)
            {
                throw new NotFoundException($"Không tìm thấy chuyên ngành với ID: {request.Id}");
            }

            return new Response<MajorDto>
            {
                Data = mapper.Map<MajorDto>(query),
                action = Domain.Enums.Action.GET.ToString(),
                Message = "Lấy chuyên ngành thành công",
                Ok = true,
            };
        }
    }
}