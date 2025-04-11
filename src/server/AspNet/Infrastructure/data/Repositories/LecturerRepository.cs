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
    public class LecturerRepository(ApplicationDbContext context) : ILecturerRepository
    {
        public async Task<Lecturer> AddAsync(Lecturer lecturer)
        {
            var result = context.Lecturers.AddAsync(lecturer);
            await context.SaveChangesAsync();
            return result.Result.Entity;
        }

        public async Task<Lecturer> DeleteAsync(Lecturer lecturer)
        {
            var result = context.Lecturers.Remove(lecturer);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Lecturer> DeleteSoftAsync(Lecturer lecturer)
        {
            lecturer.User.IsDeleted = true;
            var result = context.Lecturers.Update(lecturer);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<(IEnumerable<Lecturer> Items, int TotalCount, int PageNumber, int PageSize)> GetAllAsync(int pageNumber = 1, int pageSize = 10, string? search = null, bool? isDeleted = false, string? facultyId = null, string? majorId = null)
        {
            var query = context.Lecturers.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(l => l.User != null && l.User.FullName.Contains(search));
            }

            if (isDeleted.HasValue)
            {
                query = query.Where(l => l.User.IsDeleted == isDeleted);
            }

            if (!string.IsNullOrEmpty(facultyId))
            {
                query = query.Where(l => l.FacultyId == facultyId);
            }

            if (!string.IsNullOrEmpty(majorId))
            {
                query = query.Where(l => l.MajorId == majorId);
            }

            var totalCount = await query.CountAsync();

            if (totalCount == 0)
            {
                return (new List<Lecturer>(), 0, pageNumber, pageSize);
            }

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount, pageNumber, pageSize);
        }

        public async Task<Lecturer?> GetByIdAsync(string id)
        {
            return await context.Lecturers
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.UserId == id);
        }

        public async Task<Lecturer?> GetByNameAsync(string name)
        {
            return await context.Lecturers
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.User.FullName == name);
        }

        public async Task<bool> HasDependentEntitiesAsync(string id)
        {
            var hasCourse = await context.Courses.AnyAsync(c => c.CreatedBy == id);
            return hasCourse;
        }

        public Task<Lecturer> RestoreAsync(Lecturer lecturer)
        {
            lecturer.User.IsDeleted = false;
            var result = context.Lecturers.Update(lecturer);
            context.SaveChangesAsync();
            return Task.FromResult(result.Entity);
        }

        public async Task<Lecturer> UpdateAsync(Lecturer lecturer)
        {
            var result = context.Lecturers.Update(lecturer);
            await context.SaveChangesAsync();
            return result.Entity;
        }
    }
}