import { classDto } from '../dtos/class.dto.js';
import prisma from '../middleware/prisma.intercepter.js';

class classRepository {
    async getAll({ page_number = 1, page_size = 10, search = '', is_deleted }) {
        try {
            const skip = (page_number - 1) * page_size;

            const [classes, total] = await Promise.all([
                prisma.class.findMany({
                    where: {
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
                        OR: [{ name: { contains: search } }],
                    },
                    select: classDto,
                    skip,
                    take: parseInt(page_size),
                    orderBy: {
                        id: 'desc',
                    },
                }),

                prisma.class.count({
                    where: {
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
                        OR: [{ name: { contains: search } }],
                    },
                }),
            ]);

            return {
                data: classes,
                total_records: total,
                page_number,
                page_size,
            };
        } catch (error) {
            throw error;
        }
    }
    async getById(id) {
        try {
            return await prisma.class.findUnique({
                where: { id: parseInt(id) },
                include: {
                    students: {
                        include: {
                            user: true,
                        },
                    },
                    lecturers: {
                        include: {
                            user: true,
                        },
                    },
                    faculty: true,
                    _count: {
                        select: {
                            students: true,
                            lecturers: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }
    async create(data) {
        try {
            return await prisma.class.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }
    async update(id, data) {
        try {
            return await prisma.class.update({
                where: { id: parseInt(id) },
                data,
            });
        } catch (error) {
            throw error;
        }
    }
    async delete(id) {
        try {
            return await prisma.class.update({
                where: { id: parseInt(id) },
                data: { is_deleted: true },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteSoft(id) {
        try {
            return await prisma.class.update({
                where: { id: parseInt(id) },
                data: { is_deleted: true },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteHard(id) {
        try {
            return await prisma.class.deleteMany({
                where: { id: parseInt(id) },
            });
        } catch (error) {
            throw error;
        }
    }

    async restore(id) {
        try {
            return await prisma.class.update({
                where: { id: parseInt(id) },
                data: { is_deleted: false },
            });
        } catch (error) {
            throw error;
        }
    }
}

export default new classRepository();