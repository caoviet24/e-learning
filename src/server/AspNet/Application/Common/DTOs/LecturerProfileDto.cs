using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.DTOs
{
    public class LecturerProfileDto
    {
        public string cardId { get; set; } = null!;
        public string position { get; set; } = null!;
        public string status { get; set; } = null!;
        public DateTime joinedAt { get; set; }
        public FacultyDto faculty { get; set; } = null!;
        public MajorDto major { get; set; } = null!;
    }
}