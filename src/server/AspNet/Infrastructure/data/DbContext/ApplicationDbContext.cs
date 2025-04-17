using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.data.context
{
    public class ApplicationDbContext : DbContext
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



        /// <summary>
        /// Configures the entity models and their relationships
        /// </summary>
        /// <param name="modelBuilder">The model builder</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
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

                entity.HasOne(e => e.Faculty)
                      .WithMany(f => f.Exams)
                      .HasForeignKey(e => e.facultyId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Major)
                      .WithMany(m => m.Exams)
                      .HasForeignKey(e => e.majorId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Class)
                      .WithMany(c => c.Exams)
                      .HasForeignKey(e => e.classId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Course)
                      .WithMany(c => c.Exams)
                      .HasForeignKey(e => e.courseId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Tester)
                        .WithMany(u => u.TesterExams)
                        .HasForeignKey(e => e.testerId)
                        .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedUser)
                        .WithMany(u => u.CreatedUserExams)
                        .HasForeignKey(e => e.createdBy)
                        .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ExamQuestion>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Exam)
                      .WithMany(e => e.ExamQuestions)
                      .HasForeignKey(e => e.examId)
                      .OnDelete(DeleteBehavior.Cascade);
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





            // Enable filtering for soft delete
            // foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            // {
            //     if (typeof(AuditableEntity).IsAssignableFrom(entityType.ClrType))
            //     {
            //         var parameter = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
            //         var property = System.Linq.Expressions.Expression.Property(parameter, "isDeleted");
            //         var nullConstant = System.Linq.Expressions.Expression.Constant(null, typeof(bool?));
            //         var falseConstant = System.Linq.Expressions.Expression.Constant(false, typeof(bool?));

            //         var nullCheck = System.Linq.Expressions.Expression.Equal(property, nullConstant);
            //         var falseCheck = System.Linq.Expressions.Expression.Equal(property, falseConstant);
            //         var orExpression = System.Linq.Expressions.Expression.OrElse(nullCheck, falseCheck);

            //         var lambda = System.Linq.Expressions.Expression.Lambda(orExpression, parameter);
            //         entityType.SetQueryFilter(lambda);
            //     }
            // }

        }
    }
}