using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class ExamResultByUser : AuditableEntity
    {
        public string examId { get; set; } = null!;
        public double score { get; set; } = 0;
        public double duration { get; set; } = 0;
        public virtual User User { get; set; } = null!;
        public virtual Exam Exam { get; set; } = null!;
    }
}