using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class TeachSchedule : AuditableEntity
    {
        public string subjectId { get; set; } = null!;
        public string classId { get; set; } = null!;
        public string lecturerId { get; set; } = null!;
        public string numOfPeriods { get; set; } = null!;
        public string room { get; set; } = null!;
        public string teachDay { get; set; } = null!;
        public virtual Subject Subject { get; set; } = null!;
        public virtual Class Class { get; set; } = null!;
        public virtual User Lecturer { get; set; } = null!;
        public virtual User createdUser { get; set; } = null!;
        public virtual ICollection<Class> Classes { get; set; } = new HashSet<Class>();
    }
}