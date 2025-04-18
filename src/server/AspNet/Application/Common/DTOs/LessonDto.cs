
using Domain.Common;

namespace Application.Common.DTOs
{
    public class LessonDto : BaseEnity
    {
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbnail { get; set; } = null!;
        public int position { get; set; }
        public string urlVideo { get; set; } = null!;
        public string courseId { get; set; } = null!;
        public virtual CourseDto Course { get; set; } = null!;
    }
}