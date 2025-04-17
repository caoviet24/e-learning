using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;

namespace Domain.Interfaces
{
    public interface ICourseRepository
    {
        Task<(IEnumerable<Course> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            string? facultyId = null,
            string? majorId = null,
            string? lecturerId = null,
            string? status = null,
            bool? isActive = null,
            bool? isDeleted = null
            );
        Task<Course?> GetByIdAsync(string id);
        Task<Course?> GetByNameAsync(string name);
        Task<Course> AddAsync(Course course);
        Task<Course> UpdateAsync(Course course);
        Task<Course> DeleteSoftAsync(Course course);
        Task<Course> DeleteAsync(Course course);
        Task<Course> RestoreAsync(Course course);
        Task<Course> ActiveAsync(Course course);
        Task<Course> InActiveAsync(Course course);
        Task<Course> ChangeStatusAsync(Course course, string status);

        Task<bool> HasDependentEntitiesAsync(string id);
    }
}