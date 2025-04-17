using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.DTOs
{
    public class MajorDto
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public bool? isDeleted { get; set; }
    }

    public class MajorDtoWithFaculty
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public bool? isDeleted { get; set; }
        public FacultyDto? faculty { get; set; }
    }
}