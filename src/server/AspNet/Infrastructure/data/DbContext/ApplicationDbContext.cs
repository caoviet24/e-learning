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
                entity.HasKey(e => e.CardId);

                entity.HasOne(e => e.User)
                    .WithOne(u => u.Lecturer)
                    .HasForeignKey<Lecturer>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Faculty)
                    .WithMany(f => f.Lecturers)
                    .HasForeignKey(e => e.FacultyId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Major)
                    .WithMany(m => m.Lecturers)
                    .HasForeignKey(e => e.MajorId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.ToTable("Students");
                entity.HasKey(e => e.CardId);

                entity.HasOne(e => e.User)
                    .WithOne(u => u.Student)
                    .HasForeignKey<Student>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Faculty)
                   .WithMany(f => f.Students)
                   .HasForeignKey(e => e.FacultyId)
                   .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Major)
                    .WithMany(m => m.Students)
                    .HasForeignKey(e => e.MajorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });


            modelBuilder.Entity<Faculty>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Faculties)
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
                
            });

            modelBuilder.Entity<Major>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Majors)
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Faculty)
                    .WithMany(m => m.Majors)
                    .HasForeignKey(m => m.FacultyId)
                    .OnDelete(DeleteBehavior.Restrict);

            });

            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Faculty)
                      .WithMany(f => f.Classes)
                      .HasForeignKey(e => e.FacultyId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Major)
                      .WithMany(m => m.Classes)
                      .HasForeignKey(e => e.MajorId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Lecturer)
                        .WithOne(l => l.Class)
                        .HasForeignKey<Class>(e => e.LecturerId)
                        .OnDelete(DeleteBehavior.Restrict);

            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Faculty)
                    .WithMany(f => f.Courses)
                    .HasForeignKey(e => e.FacultyId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Major)
                    .WithMany(f => f.Courses)
                    .HasForeignKey(e => e.MajorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.User)
                        .WithMany(e => e.Courses)
                        .HasForeignKey(e => e.CreatedBy)
                        .OnDelete(DeleteBehavior.Restrict);

            });

            modelBuilder.Entity<Lesson>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Course)
                    .WithMany(c => c.Lessons)
                    .HasForeignKey(e => e.CourseId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            
            
            modelBuilder.Entity<Notify>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Faculty)
                      .WithMany(f => f.Notifies)
                      .HasForeignKey(e => e.FacultyId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Major)
                      .WithMany(m => m.Notifies)
                      .HasForeignKey(e => e.MajorId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Class)
                      .WithMany(c => c.Notifies)
                      .HasForeignKey(e => e.ClassId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Sender)
                      .WithMany(u => u.CreatedNotifies)
                      .HasForeignKey(e => e.CreatedBy)
                      .OnDelete(DeleteBehavior.Restrict)
                      .IsRequired(false);

                entity.HasOne(e => e.Receiver)
                        .WithMany(u => u.ReceivedNotifies)
                        .HasForeignKey(e => e.ReceiverId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);
            });

            // Configure global query filters for soft delete
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(AuditableEntity).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
                    var property = System.Linq.Expressions.Expression.Property(parameter, "IsDeleted");
                    var nullConstant = System.Linq.Expressions.Expression.Constant(null, typeof(bool?));
                    var falseConstant = System.Linq.Expressions.Expression.Constant(false, typeof(bool?)); 

                    var nullCheck = System.Linq.Expressions.Expression.Equal(property, nullConstant);
                    var falseCheck = System.Linq.Expressions.Expression.Equal(property, falseConstant);
                    var orExpression = System.Linq.Expressions.Expression.OrElse(nullCheck, falseCheck);

                    var lambda = System.Linq.Expressions.Expression.Lambda(orExpression, parameter);
                    entityType.SetQueryFilter(lambda);
                }
            }

        }
    }
}