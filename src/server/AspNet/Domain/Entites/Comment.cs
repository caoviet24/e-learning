using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Comment : AuditableEntity
    {
        public string content { get; set; } = null!;
        public string imageUrl { get; set; } = null!;
        public int likeCount { get; set; } = 0;
        public string tag { get; set; } = null!;
        public string postId { get; set; } = null!;
        public virtual Post Post { get; set; } = null!;
        public virtual User Sender { get; set; } = null!;
        public virtual ICollection<ReplyComment> ReplyComments { get; set; } = new HashSet<ReplyComment>();
    }
}