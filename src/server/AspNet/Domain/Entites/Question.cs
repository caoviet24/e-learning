using Domain.Common;

namespace Domain.Entites
{
    public class Question : AuditableEntity
    {
        public string content { get; set; } = null!;
        public string? imageUrl { get; set; } = null!;
        public string? videoUrl { get; set; } = null!;
        public string? audioUrl { get; set; } = null!;
        public bool isMultipleChoice { get; set; } = false;
        public string? answers { get; set; } = null!;
        public string? correctAnswer { get; set; } = null!;
        public string? facultyId { get; set; } = null!;
        public string? majorId { get; set; } = null!;
        public string? subjectId { get; set; } = null!;
        public virtual Faculty? Faculty { get; set; } = null!;
        public virtual Major? Major { get; set; } = null!;
        public virtual Subject? Subject { get; set; } = null!;
        public virtual ICollection<ExamQuestion> ExamQuestions { get; set; } = new HashSet<ExamQuestion>();
    }
}