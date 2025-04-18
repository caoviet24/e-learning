using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Permisstion : AuditableEntity
    {
        public bool isManagedPosts { get; set; }
        public bool isManagedCourses { get; set; }
        public bool isTeachScheduleAssignment { get; set; }
        public string assignedUserId { get; set; } = null!;
        public virtual User createdUser { get; set; } = null!;
        public virtual User assignedUser { get; set; } = null!;

    }
}