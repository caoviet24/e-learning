using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;

namespace Domain.Interfaces
{
    public interface ILessonRepository
    {
        Task<(IEnumerable<Lesson> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            string? courseId = null,
            string? lecturerId = null,
            bool? isDeleted = null);
        Task<Lesson?> GetByIdAsync(string id);
        Task<Lesson?> GetByNameAsync(string name);
        Task<Lesson?> GetByCodeAsync(string code);
        Task<Lesson> AddAsync(Lesson faculty);
        Task<Lesson> UpdateAsync(Lesson faculty);
        Task<Lesson> DeleteSoftAsync(Lesson faculty);
        Task<Lesson> DeleteAsync(Lesson faculty);
        Task<bool> HasDependentEntitiesAsync(string id);
        Task<Lesson> RestoreAsync(Lesson faculty);
    }
}