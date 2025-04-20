using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Sercurity;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries
{
    [Authorize]
    public record GetMyInfoQuery : IRequest<MySeftDto>;
    internal class GetMyInfoQueryHandler(IApplicationDbContext context, IUser _user, IMapper mapper) : IRequestHandler<GetMyInfoQuery, MySeftDto>
    {
        public async Task<MySeftDto> Handle(GetMyInfoQuery request, CancellationToken cancellationToken)
        {
            var user = await context.Users.Where(x => x.Id == _user.getCurrentUser())
                    .ProjectTo<MySeftDto>(mapper.ConfigurationProvider)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();
            return user!;
        }
    }
}