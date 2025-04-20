using Domain.Common;

namespace Domain.Entites
{
    public class Comment : AuditableEntity
    {
        public string content { get; set; } = null!;
        public string? imageUrl { get; set; } = null!;
        public string? videoUrl { get; set; } = null!;
        public string? audioUrl { get; set; } = null!;
        public int likeCount { get; set; } = 0;
        public string? postId { get; set; } = null!;
        public string? lessonId { get; set; } = null!;
        public virtual User Sender { get; set; } = null!;
        public virtual Course? Course { get; set; } = null!;
        public virtual Lesson? Lesson { get; set; } = null!;
        public virtual ICollection<ReplyComment> ReplyComments { get; set; } = new HashSet<ReplyComment>();
    }
}