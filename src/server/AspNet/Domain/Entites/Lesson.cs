using Domain.Common;

namespace Domain.Entites
{
    public class Lesson : BaseEnity
    {
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbnail { get; set; } = null!;
        public int position { get; set; }
        public string urlVideo { get; set; } = null!;
        public string courseId { get; set; } = null!;
        public virtual Course Course { get; set; } = null!;
    }


}