using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class ExamSchedule : AuditableEntity
    {
        public string examId { get; set; } = null!;
        public string subjectId { get; set; } = null!;
        public string? classId { get; set; } = null!;
        public string examDay { get; set; } = null!;
        public string superVisoryId { get; set; } = null!;
        public virtual Exam Exam { get; set; } = null!;
        public virtual Subject Subject { get; set; } = null!;
        public virtual Class Class { get; set; } = null!;
        public virtual User createdUser { get; set; } = null!;
        public virtual User superVisory { get; set; } = null!;
    }
}