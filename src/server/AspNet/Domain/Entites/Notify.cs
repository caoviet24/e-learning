using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Notify : AuditableEntity
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public bool IsRead { get; set; } = false;
        public bool IsForAll { get; set; } = false;
        public string? FacultyId { get; set; }
        public string? MajorId { get; set; }
        public string? ClassId { get; set; }
        public string? ReceiverId { get; set; } = null!;
        public virtual Faculty? Faculty { get; set; }
        public virtual Major? Major { get; set; }
        public virtual Class? Class { get; set; }
        public virtual User? Sender { get; set; }
        public virtual User? Receiver { get; set; }

    }
}