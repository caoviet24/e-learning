using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class User : AuditableEntity
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? FullName { get; set; }
        public string? Nickname { get; set; }
        public byte? Gender { get; set; }
        public DateTime? Birth { get; set; }
        public string? Avatar { get; set; } = null!;
        public string? Email { get; set; } = null!;
        public string? Phone { get; set; } = null!;
        public virtual Student Student { get; set; } = null!;
        public virtual Lecturer Lecturer { get; set; } = null!;
        public virtual ICollection<Faculty> Faculties { get; set; } = new HashSet<Faculty>();
        public virtual ICollection<Major> Majors { get; set; } = new HashSet<Major>();
        public virtual ICollection<Class> Classes { get; set; } = new HashSet<Class>();
        public virtual ICollection<Course> Courses { get; set; } = new HashSet<Course>();
        public ICollection<Notify> CreatedNotifies { get; set; } = new HashSet<Notify>();
        public ICollection<Notify> ReceivedNotifies { get; set; } = new HashSet<Notify>();

    }
}