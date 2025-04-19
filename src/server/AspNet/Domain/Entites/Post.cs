using Domain.Common;

namespace Domain.Entites
{
    public class Post : AuditableEntity
    {
        public string title { get; set; } = null!;
        public string content { get; set; } = null!;
        public string? imageUrl { get; set; } = null!;
        public string? videoUrl { get; set; } = null!;
        public string status { get; set; } = null!;
        public bool isActive { get; set; } = true;
        public int likeCount { get; set; } = 0;
        public string tag { get; set; } = null!;
        public string? hashtag { get; set; } = null!;
        public string? facultyId { get; set; } = null!;
        public string? majorId { get; set; } = null!;
        public virtual Faculty? Faculty { get; set; } = null!;
        public virtual Major? Major { get; set; } = null!;
        public virtual User Author { get; set; } = null!;
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public virtual ICollection<SavedPosts> SavedPosts { get; set; } = new HashSet<SavedPosts>();
    }
}