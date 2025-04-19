using Domain.Common;

namespace Domain.Entites
{
    public class Subject : AuditableEntity
    {
        public string name { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string? facultyId { get; set; } = null!;
        public string? majorId { get; set; } = null!;
        public virtual Faculty? Faculty { get; set; } = null!;
        public virtual Major? Major { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Lesson> Lessons { get; set; } = new HashSet<Lesson>();
        public virtual ICollection<Exam> Exams { get; set; } = new HashSet<Exam>();
        public virtual ICollection<TeachSchedule> TeachSchedules { get; set; } = new HashSet<TeachSchedule>();
        public virtual ICollection<ExamSchedule> ExamSchedules { get; set; } = new HashSet<ExamSchedule>();
        public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    }
}