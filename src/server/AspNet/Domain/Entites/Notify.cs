using Domain.Common;

namespace Domain.Entites
{
    public class Notify : AuditableEntity
    {
        public string title { get; set; } = null!;
        public string content { get; set; } = null!;
        public bool isRead { get; set; } = false;
        public bool isForAll { get; set; } = false;
        public string? facultyId { get; set; }
        public string? majorId { get; set; }
        public string? classId { get; set; }
        public string? receiverId { get; set; } = null!;
        public virtual Faculty? Faculty { get; set; }
        public virtual Major? Major { get; set; }
        public virtual Class? Class { get; set; }
        public virtual User? Sender { get; set; }
        public virtual User? Receiver { get; set; }

    }
}