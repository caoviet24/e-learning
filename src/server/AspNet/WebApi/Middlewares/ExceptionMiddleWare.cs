using System.Net;
using System.Text.Json;
using Application.Common.Exceptions;
using Domain.Exceptions;

namespace WebApi.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, IHostEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {

            var response = context.Response;
            response.ContentType = "application/json";
            
            var statusCode = GetStatusCode(exception);
            response.StatusCode = (int)statusCode;

            var result = JsonSerializer.Serialize(new
            {
                Ok = false,
                statusCode = response.StatusCode,
                message = exception.Message,
                // stackTrace = _env.IsDevelopment() ? exception.StackTrace : null
            });

            await response.WriteAsync(result);
        }

        private static HttpStatusCode GetStatusCode(Exception exception)
        {
            return exception switch
            {
                BadRequestException => HttpStatusCode.BadRequest,
                ValidationException => HttpStatusCode.BadRequest,
                NotFoundException => HttpStatusCode.NotFound,
                ForbiddenAccessException => HttpStatusCode.Forbidden,
                Domain.Exceptions.UnauthorizedAccessException => HttpStatusCode.Unauthorized,
                _ => HttpStatusCode.InternalServerError
            };
        }
    }
}