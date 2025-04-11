using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = null!;
        public string? FullName { get; set; }
        public string? Nickname { get; set; }
        public byte? Gender { get; set; }
        public DateTime? Birth { get; set; }
        public string? Avatar { get; set; } = null!;
        public string? Email { get; set; } = null!;
        public string? Phone { get; set; } = null!;

    }
}