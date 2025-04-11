using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entites;
using Domain.Interfaces;
using Infrastructure.data.context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.data.Repositories
{
    public class FacultyRepository(ApplicationDbContext context) : IFacultyRepository
    {
        
        public async Task<Faculty> AddAsync(Faculty faculty)
        {
            var result = await context.Faculties.AddAsync(faculty);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Faculty> DeleteAsync(Faculty faculty)
        {
            var result = context.Faculties.Remove(faculty).Entity;
            await context.SaveChangesAsync();
            return result;
        }
        public async Task<Faculty> DeleteSoftAsync(Faculty faculty)
        {
            faculty.IsDeleted = true;
            var result = context.Faculties.Update(faculty);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<(IEnumerable<Faculty> Items, int TotalCount, int PageNumber, int PageSize)> GetAllAsync(int pageNumber = 1, int pageSize = 10, string? search = null, bool? isDeleted = false)
        {
            var query = context.Faculties.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(f => f.Name.Contains(search) || f.Code.Contains(search));
            }

            if (isDeleted.HasValue)
            {
                query = query.Where(f => f.IsDeleted == isDeleted);
            }

            var totalCount = await query.CountAsync();

            if (totalCount == 0)
            {
                return (new List<Faculty>(), totalCount, pageNumber, pageSize);
            }

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount, pageNumber, pageSize);
        }

        public Task<Faculty?> GetByCodeAsync(string code)
        {
            return context.Faculties.FirstOrDefaultAsync(f => f.Code == code);
        }

        public Task<Faculty?> GetByIdAsync(string id)
        {
            return context.Faculties.FirstOrDefaultAsync(f => f.Id == id);
        }

        public Task<Faculty?> GetByNameAsync(string name)
        {
            return context.Faculties.FirstOrDefaultAsync(f => f.Name == name);
        }

        public async Task<bool> HasDependentEntitiesAsync(string id)
        {
            var hasMajor = await context.Majors.AnyAsync(m => m.FacultyId == id);
            var hasLecturer = await context.Lecturers.AnyAsync(l => l.FacultyId == id);
            var hasStudent = await context.Students.AnyAsync(s => s.FacultyId == id);
            return hasMajor || hasLecturer || hasStudent;
        }

        public async Task<Faculty> RestoreAsync(Faculty faculty)
        {
            faculty.IsDeleted = false;
            var result = context.Faculties.Update(faculty);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Faculty> UpdateAsync(Faculty faculty)
        {
            var result = context.Faculties.Update(faculty);
            await context.SaveChangesAsync();
            return result.Entity;
        }
    }
}