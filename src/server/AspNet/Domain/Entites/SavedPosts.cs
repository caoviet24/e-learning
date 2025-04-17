using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class SavedPosts : AuditableEntity
    {
        public string postId { get; set; } = null!;
        public string type { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual Post Post { get; set; } = null!;
    }
}