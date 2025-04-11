using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Course : AuditableEntity
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Thumbnail { get; set; } = null!;
        public bool IsActive { get; set; }
        public string Status { get; set; } = null!;
        public string FacultyId { get; set; } = null!;
        public string MajorId { get; set; } = null!;
        public virtual Faculty Faculty { get; set; } = null!;
        public virtual Major Major { get; set; } = null!;
        public virtual User User { get; set; } = null!;

        public virtual ICollection<Student> Students { get; set; } = new HashSet<Student>();
        public virtual ICollection<Lesson> Lessons { get; set; } = new HashSet<Lesson>();
    }
}