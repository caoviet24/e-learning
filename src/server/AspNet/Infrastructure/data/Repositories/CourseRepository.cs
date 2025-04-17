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
    public class CourseRepository(ApplicationDbContext context) : ICourseRepository
    {
        public async Task<Course> ActiveAsync(Course course)
        {
            course.isActive = true;
            var result = context.Courses.Update(course);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Course> AddAsync(Course course)
        {
            var result = await context.Courses.AddAsync(course);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Course> ChangeStatusAsync(Course course, string status)
        {
            course.status = status;
            var result = context.Courses.Update(course);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Course> DeleteAsync(Course course)
        {
            context.Courses.Remove(course);
            await context.SaveChangesAsync();
            return course;
        }

        public async Task<Course> DeleteSoftAsync(Course course)
        {
            course.isDeleted = true;
            var result = context.Courses.Update(course);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<(IEnumerable<Course> Items, int totalRecords, int pageNumber, int pageSize)> GetAllAsync(
            int pageNumber = 1, int pageSize = 10,
            string? search = null,
            string? facultyId = null, string? majorId = null, string? lecturerId = null,
            string? status = null, bool? isActive = null, bool? isDeleted = null
        )
        {
            var query = context.Courses
                .Include(c => c.User)
                .Include(c => c.Faculty)
                .Include(c => c.Major)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.title.Contains(search));
            }

            if (!string.IsNullOrEmpty(facultyId))
            {
                query = query.Where(c => c.facultyId == facultyId);
            }

            if (!string.IsNullOrEmpty(majorId))
            {
                query = query.Where(c => c.majorId == majorId);
            }

            if (!string.IsNullOrEmpty(lecturerId))
            {
                query = query.Where(c => c.createdBy == lecturerId);
            }
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(c => c.status == status);
            }

            if (isActive != null)
            {
                query = query.Where(c => c.isActive == isActive);
            }

            if (isDeleted != null)
            {
                query = query.Where(c => c.isDeleted == isDeleted.Value);
            }

            var totalRecords = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalRecords, pageNumber, pageSize);
        }

        public async Task<Course?> GetByIdAsync(string id)
        {
            return await context.Courses.FirstOrDefaultAsync(c => c.Id == id);
        }

        public Task<Course?> GetByNameAsync(string name)
        {
            return context.Courses.FirstOrDefaultAsync(c => c.title == name);
        }

        public Task<bool> HasDependentEntitiesAsync(string id)
        {
            var hasLesson = context.Lessons.AnyAsync(l => l.courseId == id);
            return hasLesson;
        }

        public async Task<Course> InActiveAsync(Course course)
        {
            course.isActive = false;
            var result = context.Courses.Update(course);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Course> RestoreAsync(Course course)
        {
            course.isDeleted = false;
            var result = context.Courses.Update(course);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Course> UpdateAsync(Course course)
        {
            var result = context.Courses.Update(course);
            context.Entry(course).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return result.Entity;
        }
    }
}