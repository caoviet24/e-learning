using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    /// <summary>
    /// Unit of Work pattern interface to coordinate the work of multiple repositories
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// Repository for managing entities
        IUserRepository Users { get; }
        IFacultyRepository Faculties { get; }
        IMajorRepository Majors { get; }
        IClassRepository Classes { get; }
        ILecturerRepository Lecturers { get; }
        IStudentRepository Students { get; }
        ICourseRepository Courses { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}