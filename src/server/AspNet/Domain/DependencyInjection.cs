﻿using Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Domain;
public static class DependencyInjection
{
    public static IServiceCollection AddDomainService(this IServiceCollection services)
    {
        return services;
    }
}



