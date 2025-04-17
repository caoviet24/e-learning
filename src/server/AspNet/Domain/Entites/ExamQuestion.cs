using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entites
{
    public class ExamQuestion
    {
        public string Id { get; set; } = null!;
        public string content { get; set; } = null!;
        public string? imageUrl { get; set; } = null!;
        public string? videoUrl { get; set; } = null!;
        public string? audioUrl { get; set; } = null!;
        public bool isMultipleChoice { get; set; } = false;
        public string? answers { get; set; } = null!;
        public string? correctAnswer { get; set; } = null!;
        public string examId { get; set; } = null!;
        public virtual Exam? Exam { get; set; } = null!;
    }
}