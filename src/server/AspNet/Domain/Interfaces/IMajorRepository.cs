using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;

namespace Domain.Interfaces
{
    public interface IMajorRepository
    {
        Task<(IEnumerable<Major> Items, int TotalCount, int PageNumber, int PageSize)> GetAllAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            bool? isDeleted = false,
            string? facultyId = null);
        Task<Major?> GetByIdAsync(string id);
        Task<Major?> GetByCodeAsync(string code);
        Task<IEnumerable<Major>> GetByFacultyIdAsync(string facultyId);
        Task<Major> AddAsync(Major major);
        Task<Major> UpdateAsync(Major major);
        Task<Major> DeleteAsync(Major major);
        Task<Major> DeleteSoftAsync(Major major);
        Task<Major> RestoreAsync(Major major);
        Task<bool> HasDependentEntitiesAsync(string id);
    }
}