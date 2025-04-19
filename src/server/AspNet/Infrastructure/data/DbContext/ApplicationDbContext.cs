using Application.Common.Interfaces;
using Domain.Entites;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.data.context
{
      public class ApplicationDbContext : DbContext, IApplicationDbContext
      {
            public ApplicationDbContext()
            {
            }
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
            {
            }

            public DbSet<User> Users { get; set; } = null!;
            public DbSet<Course> Courses { get; set; } = null!;
            public DbSet<Faculty> Faculties { get; set; } = null!;
            public DbSet<Lecturer> Lecturers { get; set; } = null!;
            public DbSet<Lesson> Lessons { get; set; } = null!;
            public DbSet<Major> Majors { get; set; } = null!;
            public DbSet<Notify> Notifications { get; set; } = null!;
            public DbSet<Student> Students { get; set; } = null!;
            public DbSet<Class> Classes { get; set; } = null!;
            public DbSet<Exam> Exams { get; set; } = null!;
            public DbSet<ExamQuestion> ExamQuestions { get; set; } = null!;
            public DbSet<ExamResultByUser> ExamResultsByUser { get; set; } = null!;
            public DbSet<Post> Posts { get; set; } = null!;
            public DbSet<SavedPosts> SavedPosts { get; set; } = null!;
            public DbSet<Comment> Comments { get; set; } = null!;
            public DbSet<ReplyComment> ReplyComments { get; set; } = null!;
            public DbSet<LikePost> LikePosts { get; set; } = null!;
            public DbSet<Subject> Subjects { get; set; } = null!;
            public DbSet<Permisstion> Permisstions { get; set; } = null!;
            public DbSet<ExamSchedule> ExamSchedules { get; set; } = null!;
            public DbSet<TeachSchedule> TeachSchedules { get; set; } = null!;



            /// <summary>

            /// <summary>
            /// Configures the entity models and their relationships
            /// </summary>
            /// <param name="modelBuilder">The model builder</param>
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                  base.OnModelCreating(modelBuilder);


                  /// <summary>
                  /// Configures the entity models and their relationships
                  /// </summary>
                  /// <param name="modelBuilder">The model builder</param>
                  base.OnModelCreating(modelBuilder);

                  modelBuilder.Entity<User>(entity =>
                  {
                        entity.HasKey(e => e.Id);
                  });

                  modelBuilder.Entity<Permisstion>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.createdUser)
                        .WithMany(u => u.CreatedPermisstionsUser)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.assignedUser)
                        .WithMany(u => u.AssignedPermisstionsUser)
                        .HasForeignKey(e => e.assignedUserId)
                        .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<Lecturer>(entity =>
                  {
                        entity.ToTable("Lecturers");
                        entity.HasKey(e => e.cardId);

                        entity.HasOne(e => e.User)
                      .WithOne(u => u.Lecturer)
                      .HasForeignKey<Lecturer>(e => e.userId)
                      .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Faculty)
                      .WithMany(f => f.Lecturers)
                      .HasForeignKey(e => e.facultyId)
                      .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Major)
                      .WithMany(m => m.Lecturers)
                      .HasForeignKey(e => e.majorId)
                      .OnDelete(DeleteBehavior.Restrict);

                  });

                  modelBuilder.Entity<Student>(entity =>
                  {
                        entity.ToTable("Students");
                        entity.HasKey(e => e.cardId);

                        entity.HasOne(e => e.User)
                      .WithOne(u => u.Student)
                      .HasForeignKey<Student>(e => e.userId)
                      .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Faculty)
                     .WithMany(f => f.Students)
                     .HasForeignKey(e => e.facultyId)
                     .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Major)
                      .WithMany(m => m.Students)
                      .HasForeignKey(e => e.majorId)
                      .OnDelete(DeleteBehavior.Restrict);
                  });


                  modelBuilder.Entity<Faculty>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.User)
                      .WithMany(u => u.Faculties)
                      .HasForeignKey(e => e.createdBy)
                      .OnDelete(DeleteBehavior.Restrict);

                  });

                  modelBuilder.Entity<Major>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.User)
                      .WithMany(u => u.Majors)
                      .HasForeignKey(e => e.createdBy)
                      .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Faculty)
                      .WithMany(m => m.Majors)
                      .HasForeignKey(m => m.facultyId)
                      .OnDelete(DeleteBehavior.Restrict);

                  });

                  modelBuilder.Entity<Class>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Faculty)
                        .WithMany(f => f.Classes)
                        .HasForeignKey(e => e.facultyId)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Major)
                        .WithMany(m => m.Classes)
                        .HasForeignKey(e => e.majorId)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Lecturer)
                          .WithOne(l => l.Class)
                          .HasForeignKey<Class>(e => e.lecturerId)
                          .OnDelete(DeleteBehavior.Restrict);

                  });

                  modelBuilder.Entity<Course>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Faculty)
                      .WithMany(f => f.Courses)
                      .HasForeignKey(e => e.facultyId)
                      .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Major)
                      .WithMany(f => f.Courses)
                      .HasForeignKey(e => e.majorId)
                      .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.User)
                          .WithMany(e => e.Courses)
                          .HasForeignKey(e => e.createdBy)
                          .OnDelete(DeleteBehavior.Restrict);

                  });

                  modelBuilder.Entity<Lesson>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Course)
                      .WithMany(c => c.Lessons)
                      .HasForeignKey(e => e.courseId)
                      .OnDelete(DeleteBehavior.Cascade);
                  });


                  modelBuilder.Entity<Subject>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Faculty)
                              .WithMany(f => f.Subjects)
                              .HasForeignKey(e => e.facultyId)
                              .OnDelete(DeleteBehavior.Restrict)
                              .IsRequired(false);

                        entity.HasOne(e => e.Major)
                              .WithMany(m => m.Subjects)
                              .HasForeignKey(e => e.majorId)
                              .OnDelete(DeleteBehavior.Restrict)
                              .IsRequired(false);

                        entity.HasOne(e => e.User)
                              .WithMany(u => u.CreatedSubjectsUser)
                              .HasForeignKey(e => e.createdBy)
                              .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<TeachSchedule>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Subject)
                              .WithMany(s => s.TeachSchedules)
                              .HasForeignKey(e => e.subjectId)
                              .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Class)
                              .WithMany(c => c.TeachSchedules)
                              .HasForeignKey(e => e.classId)
                              .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.createdUser)
                              .WithMany(u => u.CreatedTeachSchedulesUser)
                              .HasForeignKey(e => e.createdBy)
                              .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Lecturer)
                              .WithMany(l => l.TeachSchedulesUser)
                              .HasForeignKey(e => e.lecturerId)
                              .OnDelete(DeleteBehavior.Restrict);
                  });


                  modelBuilder.Entity<Notify>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Faculty)
                        .WithMany(f => f.Notifies)
                        .HasForeignKey(e => e.facultyId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);

                        entity.HasOne(e => e.Major)
                        .WithMany(m => m.Notifies)
                        .HasForeignKey(e => e.majorId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);

                        entity.HasOne(e => e.Class)
                        .WithMany(c => c.Notifies)
                        .HasForeignKey(e => e.classId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);

                        entity.HasOne(e => e.Sender)
                        .WithMany(u => u.CreatedNotifies)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);

                        entity.HasOne(e => e.Receiver)
                          .WithMany(u => u.ReceivedNotifies)
                          .HasForeignKey(e => e.receiverId)
                          .OnDelete(DeleteBehavior.Restrict)
                          .IsRequired(false);
                  });

                  modelBuilder.Entity<Exam>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Subject)
                              .WithMany(s => s.Exams)
                              .HasForeignKey(e => e.subjectId)
                              .OnDelete(DeleteBehavior.Restrict);


                        entity.HasOne(e => e.CreatedUser)
                          .WithMany(u => u.CreatedUserExams)
                          .HasForeignKey(e => e.createdBy)
                          .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<Question>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Subject)
                              .WithMany(s => s.Questions)
                              .HasForeignKey(e => e.subjectId)
                              .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<ExamQuestion>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Exam)
                              .WithMany(e => e.ExamQuestions)
                              .HasForeignKey(e => e.examId)
                              .OnDelete(DeleteBehavior.Restrict);
                        entity.HasOne(e => e.Question)
                              .WithMany(q => q.ExamQuestions)
                              .HasForeignKey(e => e.questionId)
                              .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<ExamResultByUser>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.User)
                        .WithMany(u => u.ExamResultsByUser)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Exam)
                        .WithMany(e => e.ExamResults)
                        .HasForeignKey(e => e.examId)
                        .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<ExamSchedule>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Exam)
                              .WithMany(e => e.ExamSchedules)
                              .HasForeignKey(e => e.examId)
                              .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Subject)
                              .WithMany(e => e.ExamSchedules)
                              .HasForeignKey(e => e.subjectId)
                              .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.createdUser)
                              .WithMany(u => u.CreatedExamSchedulesUser)
                              .HasForeignKey(e => e.createdBy)
                              .OnDelete(DeleteBehavior.Restrict);
                  });



                  modelBuilder.Entity<Post>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Author)
                        .WithMany(u => u.Posts)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Major)
                        .WithMany(m => m.Posts)
                        .HasForeignKey(e => e.majorId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);

                        entity.HasOne(e => e.Faculty)
                        .WithMany(c => c.Posts)
                        .HasForeignKey(e => e.facultyId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);

                  });

                  modelBuilder.Entity<SavedPosts>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.User)
                        .WithMany(u => u.SavedPosts)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Post)
                        .WithMany(p => p.SavedPosts)
                        .HasForeignKey(e => e.postId)
                        .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<Comment>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Sender)
                        .WithMany(u => u.Comments)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Post)
                        .WithMany(p => p.Comments)
                        .HasForeignKey(e => e.postId)
                        .OnDelete(DeleteBehavior.Restrict);
                  });

                  modelBuilder.Entity<ReplyComment>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Sender)
                        .WithMany(u => u.ReplyCommentsSender)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Receiver)
                        .WithMany(u => u.ReplyCommentsReceiver)
                        .HasForeignKey(e => e.receiverId)
                        .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Comment)
                        .WithMany(c => c.ReplyComments)
                        .HasForeignKey(e => e.commentId)
                        .OnDelete(DeleteBehavior.Restrict);
                  });

            }
      }
}
