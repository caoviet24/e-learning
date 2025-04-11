using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Domain.Interfaces;

namespace WebApi.Services
{
    public class GetCurrentUser : IUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<GetCurrentUser> _logger;

        public GetCurrentUser(IHttpContextAccessor httpContextAccessor, ILogger<GetCurrentUser> logger)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public string getCurrentUser()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            
            if (user == null || !user.Claims.Any())
            {
                _logger.LogWarning("User context or claims are null/empty");
                return string.Empty;
            }

            // Try to find the nameidentifier claim (standard claim type for user ID)
            string userId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            // If not found, try the "nameid" claim (which is in your JWT token)
            if (string.IsNullOrEmpty(userId))
            {
                userId = user.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value ?? string.Empty;
            }

            _logger.LogInformation($"UserId: {userId}");
            
            // Log all claims for debugging
            foreach (var claim in user.Claims)
            {
                _logger.LogDebug($"Claim: {claim.Type} = {claim.Value}");
            }
            
            return userId;
        }
        
        public bool IsInRole(string role)
        {
            if (string.IsNullOrEmpty(role))
                return false;
                
            var userRole = _httpContextAccessor.HttpContext?.User?.Claims?
                .FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                
            if (string.IsNullOrEmpty(userRole))
                return false;
                
            return string.Equals(userRole, role, StringComparison.OrdinalIgnoreCase);
        }
    }
}