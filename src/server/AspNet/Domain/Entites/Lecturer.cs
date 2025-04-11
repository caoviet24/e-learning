using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entites
{
    public class Lecturer
    {
        public string CardId { get; set; } = null!;
        public string ClassId { get; set; } = null!;
        public string MajorId { get; set; } = null!;
        public string FacultyId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public virtual Class Class { get; set; } = null!;
        public virtual Major Major { get; set; } = null!;
        public virtual Faculty Faculty { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Notify> Notifies { get; set; } = new HashSet<Notify>();

    }
}