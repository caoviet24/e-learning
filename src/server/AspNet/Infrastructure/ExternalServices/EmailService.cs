using Application.Common.Interfaces;

namespace Infrastructure.ExternalServices
{
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            throw new NotImplementedException();
        }
    }
}