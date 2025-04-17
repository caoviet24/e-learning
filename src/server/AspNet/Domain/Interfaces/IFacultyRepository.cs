using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;

namespace Domain.Interfaces
{
    public interface IFacultyRepository
    {
        Task<(IEnumerable<Faculty> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            bool? isDeleted = null);
        Task<Faculty?> GetByIdAsync(string id);
        Task<Faculty?> GetByNameAsync(string name);
        Task<Faculty?> GetByCodeAsync(string code);
        Task<Faculty> AddAsync(Faculty faculty);
        Task<Faculty> UpdateAsync(Faculty faculty);
        Task<Faculty> DeleteSoftAsync(Faculty faculty);
        Task<Faculty> DeleteAsync(Faculty faculty);
        Task<bool> HasDependentEntitiesAsync(string id);
        Task<Faculty> RestoreAsync(Faculty faculty);
    }
}