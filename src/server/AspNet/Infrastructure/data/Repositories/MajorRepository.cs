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
            return await context.Majors.Include(m => m.Faculty).FirstAsync(m => m.Id == major.Id)
                   ?? throw new InvalidOperationException("Major not found after insert");
        }

        public async Task<Major> DeleteAsync(Major major)
        {
            var result = context.Majors.Remove(major);
            await context.SaveChangesAsync();
            return result != null ? major : throw new InvalidOperationException("Major not found after delete");
        }

        public async Task<Major> DeleteSoftAsync(Major major)
        {
            major.isDeleted = true;
            var result = context.Majors.Update(major);
            await context.SaveChangesAsync();
            return await context.Majors.Include(m => m.Faculty).FirstAsync(m => m.Id == major.Id)
                   ?? throw new InvalidOperationException("Major not found after delete-soft");
        }

        public async Task<(IEnumerable<Major> Items, int totalCount, int pageNumber, int pageSize)> GetAllAsync(int pageNumber = 1, int pageSize = 10, string? search = null, bool? isDeleted = null, string? facultyId = null)
        {
            var query = context.Majors.Include(m => m.Faculty).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m => m.name.Contains(search) || m.code.Contains(search));
            }

            if (isDeleted != null)
            {
                query = query.Where(m => m.isDeleted == isDeleted);
            }

            if (!string.IsNullOrEmpty(facultyId))
            {
                query = query.Where(m => m.facultyId == facultyId);
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
            return await context.Majors.Include(m => m.Faculty).FirstOrDefaultAsync(m => m.code == code);
        }

        public async Task<IEnumerable<Major>> GetByFacultyIdAsync(string facultyId)
        {
            return await context.Majors.Include(m => m.Faculty).Where(m => m.facultyId == facultyId).ToListAsync();
        }

        public async Task<Major?> GetByIdAsync(string id)
        {
            return await context.Majors.Include(m => m.Faculty).FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Major?> GetByNameAsync(string name)
        {
            return await context.Majors.Include(m => m.Faculty).FirstOrDefaultAsync(m => m.name == name);
        }

        public async Task<bool> HasDependentEntitiesAsync(string id)
        {
            var hasLecturer = await context.Lecturers.AnyAsync(l => l.majorId == id);
            var hasStudent = await context.Students.AnyAsync(s => s.majorId == id);
            return hasLecturer || hasStudent;
        }

        public async Task<Major> RestoreAsync(Major major)
        {
            major.isDeleted = false;
            var result = context.Majors.Update(major);
            await context.SaveChangesAsync();
            return await context.Majors.Include(m => m.Faculty).FirstAsync(m => m.Id == major.Id)
                   ?? throw new InvalidOperationException("Major not found after restore");
        }

        public async Task<Major> UpdateAsync(Major major)
        {
            var result = context.Majors.Update(major);
            await context.SaveChangesAsync();
            return await context.Majors.Include(m => m.Faculty).FirstAsync(m => m.Id == major.Id)
                   ?? throw new InvalidOperationException("Major not found after update");
        }
    }
}