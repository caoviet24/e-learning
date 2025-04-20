namespace Application.Common.DTOs
{
    public class CourseDto
    {
        public string id { get; set; } = null!;
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string? documentUrl { get; set; } = null!;
        public string status { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;

    }

    public class CourseWithAuthorDto
    {
        public string id { get; set; } = null!;
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string status { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string majorId { get; set; } = null!;
        public UserDto author { get; set; } = null!;
    }

    public class CourseDetailDto
    {
        public string id { get; set; } = null!;
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public string thumbNail { get; set; } = null!;
        public string status { get; set; } = null!;
        public UserDto author { get; set; } = null!;
        public FacultyDto faculty { get; set; } = null!;
        public MajorDto major { get; set; } = null!;
        public int totalVideos { get; set; }
        public int totalStudents { get; set; }
    }
}