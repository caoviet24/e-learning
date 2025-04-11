using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entites
{
    public class Lesson : BaseEnity
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Thumbnail { get; set; } = null!;
        public string UrlVideo { get; set; } = null!;
        public string CourseId { get; set; } = null!;
        public virtual Course Course { get; set; } = null!;
    }


}