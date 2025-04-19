using Domain.Common;

namespace Domain.Entites
{
    public class LikePost : AuditableEntity
    {
        public string postId { get; set; } = null!;
        public string emjoji { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}