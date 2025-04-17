using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;

namespace Domain.Interfaces
{
    public interface IClassRepository
    {
        Task<(IEnumerable<Class> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            string? facultyId = null,
            string? majorId = null,
            bool? isDeleted = null);
        Task<Class?> GetByIdAsync(string id);
        Task<Class?> GetByNameAsync(string name);
        Task<Class> AddAsync(Class _class);
        Task<Class> UpdateAsync(Class _class);
        Task<Class> DeleteSoftAsync(Class _class);
        Task<Class> DeleteAsync(Class _class);
        Task<Class> RestoreAsync(Class _class);
        Task<bool> HasDependentEntitiesAsync(string id);
    }
}