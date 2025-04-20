using Domain.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Application.Common.Interfaces
{
    public interface IApplicationDbContext : IDisposable
    {
        public DbSet<User> Users { get; }
        public DbSet<Course> Courses { get; }
        public DbSet<Faculty> Faculties { get; }
        public DbSet<Lecturer> Lecturers { get; }
        public DbSet<Lesson> Lessons { get; }
        public DbSet<Major> Majors { get; }
        public DbSet<Notify> Notifications { get; }
        public DbSet<Student> Students { get; }
        public DbSet<Class> Classes { get; }
        public DbSet<Exam> Exams { get; }
        public DbSet<ExamQuestion> ExamQuestions { get; }
        public DbSet<ExamResultByUser> ExamResultsByUser { get; }
        public DbSet<Comment> Comments { get; }
        public DbSet<ReplyComment> ReplyComments { get; }
        public DatabaseFacade Database { get; }

        EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}