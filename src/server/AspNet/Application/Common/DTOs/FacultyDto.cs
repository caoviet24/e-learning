using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.DTOs
{
    public class FacultyDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!; 
        public bool? IsDeleted { get; set; }
    }

    public class FacultyListDto
    {
        public IEnumerable<FacultyDto> Items { get; set; } = new List<FacultyDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}