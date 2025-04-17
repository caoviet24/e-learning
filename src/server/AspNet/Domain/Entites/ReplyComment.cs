using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class ReplyComment : AuditableEntity
    {
        public string content { get; set; } = null!;
        public string imageUrl { get; set; } = null!;
        public int likeCount { get; set; } = 0;
        public string tag { get; set; } = null!;
        public string receiverId { get; set; } = null!;
        public string commentId { get; set; } = null!;
        public virtual Comment Comment { get; set; } = null!;
        public virtual User Sender { get; set; } = null!;
        public virtual User Receiver { get; set; } = null!;
    }
}