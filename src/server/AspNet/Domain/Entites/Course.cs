using Domain.Common;

namespace Domain.Entites
{
    public class Course : AuditableEntity
    {
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public bool isActive { get; set; }
        public string? documentUrl { get; set; } = null!;
        public string status { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
        public virtual Faculty Faculty { get; set; } = null!;
        public virtual Major Major { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Student> Students { get; set; } = new HashSet<Student>();
        public virtual ICollection<Lesson> Lessons { get; set; } = new HashSet<Lesson>();
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
    }
}