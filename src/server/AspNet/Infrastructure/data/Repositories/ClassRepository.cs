using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;
using Domain.Interfaces;
using Infrastructure.data.context;

namespace Infrastructure.data.Repositories
{
    public class ClassRepository(ApplicationDbContext context) : IClassRepository
    {
        public Task<Class> AddAsync(Class _class)
        {
            throw new NotImplementedException();
        }

        public Task<Class> DeleteAsync(Class _class)
        {
            throw new NotImplementedException();
        }

        public Task<Class> DeleteSoftAsync(Class _class)
        {
            throw new NotImplementedException();
        }

        public Task<(IEnumerable<Class> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(int pageNumber = 1, int pageSize = 10, string? search = null, string? facultyId = null, string? majorId = null, bool? isDeleted = null)
        {
            throw new NotImplementedException();
        }

        public Task<Class?> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task<Class?> GetByNameAsync(string name)
        {
            throw new NotImplementedException();
        }

        public Task<bool> HasDependentEntitiesAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task<Class> RestoreAsync(Class _class)
        {
            throw new NotImplementedException();
        }

        public Task<Class> UpdateAsync(Class _class)
        {
            throw new NotImplementedException();
        }
    }
}