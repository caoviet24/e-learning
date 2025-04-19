namespace Application.Common.DTOs
{
    public class FacultyDto
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public bool isActive { get; set; }
        public bool? isDeleted { get; set; }
    }

    public class FacultyWithCreatorDto
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public bool isActive { get; set; }
        public bool? isDeleted { get; set; }
        public UserDto creator { get; set; } = null!;
    }

    public class FacultyDetailDto
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string code { get; set; } = null!;
        public bool isActive { get; set; }
        public UserDto creator { get; set; } = null!;
        public int totalMajors { get; set; }
        public int totalLecturers { get; set; }
        public int totalStudents { get; set; }
    }
}