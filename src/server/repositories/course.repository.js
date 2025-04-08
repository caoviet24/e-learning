import { courseDto } from '../dtos/course.dto.js';
import prisma from '../middleware/prisma.intercepter.js';

class CourseRepository {
    async getAll({ page_number = 1, page_size = 10, search = '', is_deleted, faculty_id, major_id, lecturer_id }) {
        try {
            const skip = (page_number - 1) * page_size;

            const [courses, total] = await Promise.all([
                prisma.course.findMany({
                    where: {
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
                        OR: [{ name: { contains: search } }],
                        faculty_id: faculty_id ? parseInt(faculty_id) : undefined,
                        major_id: major_id ? parseInt(major_id) : undefined,
                        lecturer_id: lecturer_id ? parseInt(lecturer_id) : undefined,
                    },
                    select: courseDto,
                    skip,
                    take: parseInt(page_size),
                    orderBy: {
                        id: 'desc',
                    },
                }),

                prisma.course.count({
                    where: {
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
                        OR: [{ name: { contains: search } }],
                        faculty_id: faculty_id ? parseInt(faculty_id) : undefined,
                        major_id: major_id ? parseInt(major_id) : undefined,
                        lecturer_id: lecturer_id ? parseInt(lecturer_id) : undefined,
                    },
                }),
            ]);

            return {
                data: courses,
                total_records: total,
                page_number,
                page_size,
            };
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            const { title, description, faculty_id, major_id, lecturer_id } = data;

            if (!title || !description || !faculty_id || !major_id || !lecturer_id) {
                throw new Error('Missing required fields');
            }

            const existingCourse = await prisma.course.findFirst({
                where: {
                    title,
                    faculty_id,
                    major_id,
                    lecturer_id,
                },
            });

            if (existingCourse) {
                throw new Error('Course already exists');
            }

            return await prisma.course.create({
                data,
                select: courseDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const { title, description, faculty_id, major_id, lecturer_id } = data;

            if (!title || !description || !faculty_id || !major_id || !lecturer_id) {
                throw new Error('Missing required fields');
            }

            const existingCourse = await prisma.course.findFirst({
                where: { id },
            });

            if (!existingCourse) {
                throw new Error('Course not found');
            }

            return await prisma.course.update({
                where: { id },
                data,
                select: courseDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const course = await prisma.course.findFirst({
                where: { id },
            });

            if (!course) {
                throw new Error('Course not found');
            }

            return await prisma.course.delete({
                where: { id },
                select: courseDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteSoft(id) {
        try {
            const course = await prisma.course.findFirst({
                where: { id },
            });

            if (!course) {
                throw new Error('Course not found');
            }

            return await prisma.course.update({
                where: { id },
                data: { is_deleted: true },
                select: courseDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async restore(id) {
        try {
            const course = await prisma.course.findFirst({
                where: { id },
            });

            if (!course) {
                throw new Error('Course not found');
            }

            return await prisma.course.update({
                where: { id },
                data: { is_deleted: false },
                select: courseDto,
            });
        } catch (error) {
            throw error;
        }
    }
}

export default new CourseRepository();
