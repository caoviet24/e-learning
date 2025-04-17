using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entites
{
    public class Student
    {
        public string cardId { get; set; } = null!;
        public string classId { get; set; } = null!;
        public string majorId { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string userId { get; set; } = null!;
        public DateTime joinedAt { get; set; }
        public DateTime? graduatedAt { get; set; }
        public string? status { get; set; } = null!;
        public virtual Class Class { get; set; } = null!;
        public virtual Major Major { get; set; } = null!;
        public virtual Faculty Faculty { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Notify> Notifies { get; set; } = new HashSet<Notify>();

    }
}