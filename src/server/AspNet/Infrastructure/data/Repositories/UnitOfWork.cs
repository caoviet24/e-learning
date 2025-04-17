using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Interfaces;
using Infrastructure.data.context;
using Infrastructure.data.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;
        private bool _disposed = false;

        private IUserRepository? _userRepository;
        private IFacultyRepository? _facultyRepository;
        private IMajorRepository? _majorRepository;
        private IClassRepository? _classRepository;
        private ILecturerRepository? _lecturerRepository;
        private IStudentRepository? _studentRepository;
        private ICourseRepository? _courseRepository;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IUserRepository Users => _userRepository ??= new UserRepository(_context);
        public IFacultyRepository Faculties => _facultyRepository ??= new FacultyRepository(_context);
        public IMajorRepository Majors => _majorRepository ??= new MajorRepository(_context);
        public IClassRepository Classes => _classRepository ??= new ClassRepository(_context);
        public ILecturerRepository Lecturers => _lecturerRepository ??= new LecturerRepository(_context);
        public IStudentRepository Students => _studentRepository ??= new StudentRepository(_context);
        public ICourseRepository Courses => _courseRepository ??= new CourseRepository(_context);


        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                if (_transaction != null)
                    await _transaction.CommitAsync();
            }
            finally
            {
                if (_transaction != null)
                    await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            try
            {
                if (_transaction != null)
                    await _transaction.RollbackAsync();
            }
            finally
            {
                if (_transaction != null)
                    await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _transaction?.Dispose();
                    _context.Dispose();
                }

                _disposed = true;
            }
        }
    }
}