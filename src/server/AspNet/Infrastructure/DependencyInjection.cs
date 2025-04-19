using Application.Common.Interfaces;
using Infrastructure.data.context;
using Infrastructure.Data.DbContext;
using Infrastructure.Data.Interceptor;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using Infrastructure.Configurations;
using Infrastructure.Services;
using Infrastructure.ExternalServices;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (configuration["Jwt:AccessKey"] == null)
        {
            throw new ArgumentNullException("Jwt:AccessKey cannot be null. Please check your configuration.");
        }
        if (configuration["Jwt:Issuer"] == null)
        {
            throw new ArgumentNullException("Jwt:Issuer cannot be null. Please check your configuration.");
        }

        services.AddMemoryCache();
        services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(connectionString);
            options.LogTo(_ => { }, LogLevel.None);
        });
        services.Configure<JwtConfiguration>(configuration.GetSection("Jwt"));
        services.AddScoped<ISaveChangesInterceptor, AuditableInterceptor>();
        services.AddScoped<ApplicationDbContextInitialiser>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IEmailService, EmailService>();



        services.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(opt =>
        {
            opt.SaveToken = true;
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:AccessKey"] ?? throw new ArgumentNullException("Jwt:AccessKey cannot be null"))),
            };
        });

        return services;
    }
}