using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;

namespace Domain.Interfaces
{
    public interface ILecturerRepository
    {
        Task<(IEnumerable<Lecturer> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            string? facultyId = null,
            string? majorId = null,
            bool? isDeleted = null);
        Task<Lecturer?> GetByIdAsync(string id);
        Task<Lecturer?> GetByNameAsync(string name);
        Task<Lecturer> AddAsync(Lecturer lecturer);
        Task<Lecturer> UpdateAsync(Lecturer lecturer);
        Task<Lecturer> DeleteSoftAsync(Lecturer lecturer);
        Task<Lecturer> DeleteAsync(Lecturer lecturer);
        Task<Lecturer> RestoreAsync(Lecturer lecturer);
        Task<int> CountAsync();
        Task<bool> HasDependentEntitiesAsync(string id);
    }
}