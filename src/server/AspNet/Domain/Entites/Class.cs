using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Class : AuditableEntity
    {
        public string Name { get; set; } = null!;
        public string FacultyId { get; set; } = null!;
        public string MajorId { get; set; } = null!;
        public string LecturerId { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual Faculty Faculty { get; set; } = null!;
        public virtual Major Major { get; set; } = null!;
        public virtual Lecturer Lecturer { get; set; } = null!;
        public virtual ICollection<Student> Students { get; set; } = new HashSet<Student>();
        public virtual ICollection<Notify> Notifies { get; set; } = new HashSet<Notify>();
    }
}