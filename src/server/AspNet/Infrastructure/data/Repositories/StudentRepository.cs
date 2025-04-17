using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;
using Domain.Interfaces;
using Infrastructure.data.context;

namespace Infrastructure.data.Repositories
{
    public class StudentRepository(ApplicationDbContext context) : IStudentRepository
    {
        public Task<Student> AddAsync(Student student)
        {
            throw new NotImplementedException();
        }

        public Task<Student> DeleteAsync(Student student)
        {
            throw new NotImplementedException();
        }

        public Task<Student> DeleteSoftAsync(Student student)
        {
            throw new NotImplementedException();
        }

        public Task<(IEnumerable<Student> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(int pageNumber = 1, int pageSize = 10, string? search = null, string? facultyId = null, string? majorId = null, bool? isDeleted = null)
        {
            throw new NotImplementedException();
        }

        public Task<Student?> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task<Student?> GetByNameAsync(string name)
        {
            throw new NotImplementedException();
        }

        public Task<bool> HasDependentEntitiesAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task<Student> RestoreAsync(Student student)
        {
            throw new NotImplementedException();
        }

        public Task<Student> UpdateAsync(Student student)
        {
            throw new NotImplementedException();
        }
    }
}