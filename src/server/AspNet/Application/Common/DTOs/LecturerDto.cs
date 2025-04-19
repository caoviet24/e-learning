namespace Application.Common.DTOs
{
    public class LecturerDto
    {
        public string cardId { get; set; } = null!;
        public string status { get; set; } = null!;
        public string position { get; set; } = null!;
        public DateTime joinedAt { get; set; }
        public UserDto user { get; set; } = null!;
        public FacultyDto faculty { get; set; } = null!;
        public MajorDto major { get; set; } = null!;
    }
}