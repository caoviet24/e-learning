using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;

namespace Domain.Interfaces
{
    public interface IStudentRepository
    {
        Task<(IEnumerable<Student> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            string? facultyId = null,
            string? majorId = null,
            bool? isDeleted = null);
        Task<Student?> GetByIdAsync(string id);
        Task<Student?> GetByNameAsync(string name);
        Task<Student> AddAsync(Student student);
        Task<Student> UpdateAsync(Student student);
        Task<Student> DeleteSoftAsync(Student student);
        Task<Student> DeleteAsync(Student student);
        Task<Student> RestoreAsync(Student student);
        Task<bool> HasDependentEntitiesAsync(string id);
    }
}