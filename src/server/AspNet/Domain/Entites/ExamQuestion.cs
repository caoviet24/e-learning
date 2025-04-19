using Domain.Common;

namespace Domain.Entites
{
    public class ExamQuestion : BaseEnity
    {
        public string examId { get; set; } = null!;
        public string questionId { get; set; } = null!;
        public virtual Exam Exam { get; set; } = null!;
        public virtual Question Question { get; set; } = null!;
    }
}