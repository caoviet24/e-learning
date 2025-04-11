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
    public class MajorRepository(ApplicationDbContext context) : IMajorRepository
    {
        public async Task<Major> AddAsync(Major major)
        {
            var result = await context.Majors.AddAsync(major);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Major> DeleteAsync(Major major)
        {
            var result = context.Majors.Update(major);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Major> DeleteSoftAsync(Major major)
        {
            major.IsDeleted = true;
            var result = context.Majors.Update(major);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<(IEnumerable<Major> Items, int TotalCount, int PageNumber, int PageSize)> GetAllAsync(int pageNumber = 1, int pageSize = 10, string? search = null, bool? isDeleted = false, string? facultyId = null)
        {
            var query = context.Majors.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m => m.Name.Contains(search) || m.Code.Contains(search));
            }

            if (isDeleted.HasValue)
            {
                query = query.Where(m => m.IsDeleted == isDeleted);
            }

            if (!string.IsNullOrEmpty(facultyId))
            {
                query = query.Where(m => m.FacultyId == facultyId);
            }

            var totalCount = await query.CountAsync();

            if (totalCount == 0)
            {
                return (new List<Major>(), 0, pageNumber, pageSize);
            }

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount, pageNumber, pageSize);
        }

        public async Task<Major?> GetByCodeAsync(string code)
        {
            return await context.Majors.FirstOrDefaultAsync(m => m.Code == code);
        }

        public async Task<IEnumerable<Major>> GetByFacultyIdAsync(string facultyId)
        {
            return await context.Majors.Where(m => m.FacultyId == facultyId).ToListAsync(); ;
        }

        public async Task<Major?> GetByIdAsync(string id)
        {
            return await context.Majors.FindAsync(id);
        }

        public async Task<bool> HasDependentEntitiesAsync(string id)
        {
            var hasLecturer = await context.Lecturers.AnyAsync(l => l.MajorId == id);
            var hasStudent = await context.Students.AnyAsync(s => s.MajorId == id);
            return hasLecturer || hasStudent;
        }

        public async Task<Major> RestoreAsync(Major major)
        {
            major.IsDeleted = false;
            var result = context.Majors.Update(major);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Major> UpdateAsync(Major major)
        {
            var result = context.Majors.Update(major);
            await context.SaveChangesAsync();
            return result.Entity;
        }
    }
}