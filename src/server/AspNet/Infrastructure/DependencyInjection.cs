using Application.Common.Interfaces;
using Domain.Interfaces;
using Infrastructure.data.context;
using Infrastructure.data.Repositories;
using Infrastructure.Data.DbContext;
using Infrastructure.Data.Interceptor;
using Infrastructure.Data.Repositories;
using Infrastructure.ExternalServices;
using Infrastructure.Redis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using StackExchange.Redis;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        services.AddSingleton<TimeProvider>(TimeProvider.System);
        services.AddScoped<IJwtService, JwtService>();

        services.AddScoped<ISaveChangesInterceptor, AuditableInterceptor>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IFacultyRepository, FacultyRepository>();
        services.AddScoped<IMajorRepository, MajorRepository>();
        services.AddScoped<ILecturerRepository, LecturerRepository>();
        
        services.AddScoped<ApplicationDbContextInitialiser>();

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
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:AccessKey"]))
            };
        });


        // Configure Redis
        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var configuration = sp.GetRequiredService<IConfiguration>();
            var redisConfig = configuration["Redis:Configuration"] ?? "localhost:6379";
            return ConnectionMultiplexer.Connect(redisConfig);
        });
        services.AddScoped<IRedisService, RedisService>();

        return services;
    }
}