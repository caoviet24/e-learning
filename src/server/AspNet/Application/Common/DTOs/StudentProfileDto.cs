using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.DTOs
{
    public class StudentProfileDto
    {
        public string cardId { get; set; } = null!;
        public DateTime joinedAt { get; set; }
        public DateTime? graduatedAt { get; set; }
        public string? status { get; set; } = null!;
        public FacultyDto faculty { get; set; } = null!;
        public MajorDto major { get; set; } = null!;
        public ClassDto classDto { get; set; } = null!;
    }
}