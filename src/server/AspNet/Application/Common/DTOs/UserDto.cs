namespace Application.Common.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = null!;
        public string fullName { get; set; } = null!;
        public string nickname { get; set; } = null!;
        public byte gender { get; set; }
        public DateTime birth { get; set; }
        public string avatar { get; set; } = null!;
        public string email { get; set; } = null!;
        public string currentAddress { get; set; } = null!;
        public string phone { get; set; } = null!;
        public StudentProfileDto? StudentProfile { get; set; }
        public LecturerProfileDto? LecturerProfile { get; set; }

    }

    public class MySeftDto
    {
        public string Id { get; set; } = null!;
        public string fullName { get; set; } = null!;
        public string nickname { get; set; } = null!;
        public byte gender { get; set; }
        public DateTime birth { get; set; }
        public string avatar { get; set; } = null!;
        public string email { get; set; } = null!;
        public string currentAddress { get; set; } = null!;
        public string phone { get; set; } = null!;
        public StudentProfileDto? StudentProfile { get; set; }
        public LecturerProfileDto? LecturerProfile { get; set; }
    }
}