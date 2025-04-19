using Domain.Common;

namespace Domain.Entites
{
    public class User : AuditableEntity
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
        public string role { get; set; } = null!;
        public string? fullName { get; set; }
        public string? nickname { get; set; }
        public byte? gender { get; set; }
        public DateTime? birth { get; set; }
        public string? avatar { get; set; } = null!;
        public string? currentAddress { get; set; } = null!;
        public string? email { get; set; } = null!;
        public string? phone { get; set; } = null!;
        public virtual Student Student { get; set; } = null!;
        public virtual Lecturer Lecturer { get; set; } = null!;
        public virtual ICollection<Faculty> Faculties { get; set; } = new HashSet<Faculty>();
        public virtual ICollection<Major> Majors { get; set; } = new HashSet<Major>();
        public virtual ICollection<Class> Classes { get; set; } = new HashSet<Class>();
        public virtual ICollection<Course> Courses { get; set; } = new HashSet<Course>();

        public ICollection<Notify> CreatedNotifies { get; set; } = new HashSet<Notify>();
        public ICollection<Notify> ReceivedNotifies { get; set; } = new HashSet<Notify>();

        public virtual ICollection<Exam> CreatedUserExams { get; set; } = new HashSet<Exam>();
        public virtual ICollection<Exam> TesterExams { get; set; } = new HashSet<Exam>();
        public virtual ICollection<ExamResultByUser> ExamResultsByUser { get; set; } = new HashSet<ExamResultByUser>();

        public virtual ICollection<Post> Posts { get; set; } = new HashSet<Post>();
        public virtual ICollection<SavedPosts> SavedPosts { get; set; } = new HashSet<SavedPosts>();
        public virtual ICollection<LikePost> LikePosts { get; set; } = new HashSet<LikePost>();
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public virtual ICollection<ReplyComment> ReplyCommentsSender { get; set; } = new HashSet<ReplyComment>();
        public virtual ICollection<ReplyComment> ReplyCommentsReceiver { get; set; } = new HashSet<ReplyComment>();
        public virtual ICollection<Permisstion> CreatedPermisstionsUser { get; set; } = new HashSet<Permisstion>();
        public virtual ICollection<Permisstion> AssignedPermisstionsUser { get; set; } = new HashSet<Permisstion>();
        public virtual ICollection<Subject> CreatedSubjectsUser { get; set; } = new HashSet<Subject>();
        public virtual ICollection<ExamSchedule> CreatedExamSchedulesUser { get; set; } = new HashSet<ExamSchedule>();
        public virtual ICollection<ExamSchedule> ExamSuperVisor { get; set; } = new HashSet<ExamSchedule>();
        public virtual ICollection<TeachSchedule> CreatedTeachSchedulesUser { get; set; } = new HashSet<TeachSchedule>();
        public virtual ICollection<TeachSchedule> TeachSchedulesUser { get; set; } = new HashSet<TeachSchedule>();


    }
}