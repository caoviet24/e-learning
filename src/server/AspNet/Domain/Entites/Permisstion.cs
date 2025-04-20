using Domain.Common;

namespace Domain.Entites
{
    public class Permisstion : AuditableEntity
    {
        public bool isManagedCourses { get; set; }
        public bool isManagedUsers { get; set; }
        public bool isManagedSubjects { get; set; }
        public string assignedUserId { get; set; } = null!;
        public virtual User createdUser { get; set; } = null!;
        public virtual User assignedUser { get; set; } = null!;

    }
}