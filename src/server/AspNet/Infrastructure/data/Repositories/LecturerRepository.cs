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
            var result = await context.Lecturers.AddAsync(lecturer);
            await context.SaveChangesAsync();

            return await context.Lecturers
                .Include(l => l.Faculty)
                .Include(l => l.Major)
                .Include(l => l.User)
                .FirstAsync(l => l.cardId == result.Entity.cardId);
        }

        public async Task<int> CountAsync()
        {
            return await context.Lecturers.CountAsync();
        }

        public async Task<Lecturer> DeleteAsync(Lecturer lecturer)
        {
            var result = context.Lecturers.Remove(lecturer);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Lecturer> DeleteSoftAsync(Lecturer lecturer)
        {
            lecturer.User.isDeleted = true;
            var result = context.Lecturers.Update(lecturer);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<(IEnumerable<Lecturer> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(int pageNumber = 1, int pageSize = 10, string? search = null, string? facultyId = null, string? majorId = null, bool? isDeleted = null)
        {
            var query = context.Lecturers
                .Include(l => l.Faculty)
                .Include(l => l.Major)
                .Include(l => l.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.User.fullName != null && u.User.fullName.Contains(search));
            }

            if (isDeleted != null)
            {
                query = query.Where(l => l.User.isDeleted == isDeleted);
            }

            if (!string.IsNullOrEmpty(facultyId))
            {
                query = query.Where(l => l.facultyId == facultyId);
            }

            if (!string.IsNullOrEmpty(majorId))
            {
                query = query.Where(l => l.majorId == majorId);
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
                .FirstOrDefaultAsync(l => l.userId == id);
        }



        public async Task<Lecturer?> GetByNameAsync(string name)
        {
            return await context.Lecturers
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.User.fullName == name);
        }

        public async Task<bool> HasDependentEntitiesAsync(string id)
        {
            var hasCourse = await context.Courses.AnyAsync(c => c.createdBy == id);
            return hasCourse;
        }

        public Task<Lecturer> RestoreAsync(Lecturer lecturer)
        {
            lecturer.User.isDeleted = false;
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