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
        public string password { get; set; } = null!;
        public string? subjectId { get; set; } = null!;
        public int duration { get; set; } = 0;
        public int totalQuestion { get; set; } = 0;
        public DateTime? startTime { get; set; }
        public DateTime? endTime { get; set; }
        public virtual User CreatedUser { get; set; } = null!;
        public virtual Subject? Subject { get; set; } = null!;
        public virtual ICollection<ExamQuestion> ExamQuestions { get; set; } = new HashSet<ExamQuestion>();
        public virtual ICollection<ExamResultByUser> ExamResults { get; set; } = new HashSet<ExamResultByUser>();
        public virtual ICollection<ExamSchedule> ExamSchedules { get; set; } = new HashSet<ExamSchedule>();


    }
}