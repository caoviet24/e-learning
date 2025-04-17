using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Major : AuditableEntity
    {
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual Faculty Faculty { get; set; } = null!;
        public virtual ICollection<Lecturer> Lecturers { get; set; } = new HashSet<Lecturer>();
        public virtual ICollection<Class> Classes { get; set; } = new HashSet<Class>();
        public virtual ICollection<Student> Students { get; set; } = new HashSet<Student>();
        public virtual ICollection<Course> Courses { get; set; } = new HashSet<Course>();
        public virtual ICollection<Notify> Notifies { get; set; } = new HashSet<Notify>();
        public virtual ICollection<Exam> Exams { get; set; } = new HashSet<Exam>();
        public virtual ICollection<Post> Posts { get; set; } = new HashSet<Post>();
    }
}