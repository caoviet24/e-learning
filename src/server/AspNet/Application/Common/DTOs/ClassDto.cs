using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.DTOs
{
    public class ClassDto
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
        public string lecturerId { get; set; } = null!;
    }
}