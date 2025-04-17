using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Exam : AuditableEntity
    {
        public string title { get; set; } = null!;
        public string? courseId { get; set; } = null!;
        public string? classId { get; set; } = null!;
        public string? majorId { get; set; } = null!;
        public string? facultyId { get; set; } = null!;
        public string? testerId { get; set; } = null!;
        public bool isActive { get; set; }
        public int duration { get; set; } = 0;
        public int totalQuestion { get; set; } = 0;
        public DateTime? startTime { get; set; }
        public DateTime? endTime { get; set; }
        public virtual User CreatedUser { get; set; } = null!;
        public virtual User? Tester { get; set; } = null!;
        public virtual Faculty? Faculty { get; set; } = null!;
        public virtual Major? Major { get; set; } = null!;
        public virtual Class? Class { get; set; } = null!;
        public virtual Course? Course { get; set; } = null!;
        public virtual ICollection<ExamQuestion> ExamQuestions { get; set; } = new HashSet<ExamQuestion>();       
        public virtual ICollection<ExamResultByUser> ExamResults { get; set; } = new HashSet<ExamResultByUser>(); 
    }
}