namespace Domain.Entites
{
    public class Lecturer
    {
        public string cardId { get; set; } = null!;
        public string majorId { get; set; } = null!;
        public string facultyId { get; set; } = null!;
        public string userId { get; set; } = null!;
        public string position { get; set; } = null!;
        public string status { get; set; } = null!;
        public DateTime joinedAt { get; set; }
        public virtual Class Class { get; set; } = null!;
        public virtual Major Major { get; set; } = null!;
        public virtual Faculty Faculty { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Notify> Notifies { get; set; } = new HashSet<Notify>();

    }
}