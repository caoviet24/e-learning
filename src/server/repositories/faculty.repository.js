import prisma from '../middleware/prisma.intercepter.js';

class FacultyRepository {
    async getAll({ page_number = 1, page_size = 10, search = '', is_deleted }) {
        try {
            console.log('is_deleted', is_deleted);

            const skip = (page_number - 1) * page_size;

            const [faculties, total] = await Promise.all([
                prisma.faculty.findMany({
                    where: {
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
                        OR: [{ name: { contains: search } }],
                    },
                    include: {
                        _count: {
                            select: {
                                students: true,
                                lecturers: true,
                                classes: true,
                            },
                        },
                    },
                    skip,
                    take: parseInt(page_size),
                    orderBy: {
                        id: 'desc',
                    },
                }),

                prisma.faculty.count({
                    where: {
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
                        OR: [{ name: { contains: search } }],
                    },
                }),
            ]);

            return {
                data: faculties,
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
            return await prisma.faculty.findUnique({
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
                    classes: true,
                    _count: {
                        select: {
                            students: true,
                            lecturers: true,
                            classes: true,
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
            const existingFaculty = await prisma.faculty.findFirst({
                where: {
                    code: data.code,
                    name: data.name,
                },
            });

            if (existingFaculty) {
                throw new Error('Mã khoa đã tồn tại');
            }

            return await prisma.faculty.create({
                data: {
                    name: data.name,
                    code: data.code,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const existingFaculty = await prisma.faculty.findFirst({
                where: { id },
            });

            if (!existingFaculty) {
                throw new Error('Không tìm thấy khoa');
            }

            if (data.code && data.code !== existingFaculty.code) {
                const duplicateCode = await prisma.faculty.findUnique({
                    where: { code: data.code },
                });

                if (duplicateCode) {
                    throw new Error('Mã khoa đã tồn tại');
                }
            }

            return await prisma.faculty.update({
                where: { id },
                data: {
                    name: data.name,
                    code: data.code,
                    is_deleted: data?.is_deleted,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const faculty = await prisma.faculty.findFirst({
                where: { id },
            });

            if (!faculty) {
                throw new Error('Không tìm thấy khoa');
            }

            await prisma.faculty.delete({
                where: { id },
            });

            return faculty;
        } catch (error) {
            throw error;
        }
    }

    async deleteSoft(id) {
        try {
            const faculty = await prisma.faculty.findFirst({
                where: { id },
            });

            if (!faculty) {
                throw new Error('Không tìm thấy khoa');
            }

            await prisma.faculty.update({
                where: { id },
                data: { is_deleted: true },
            });

            return {
                ...faculty,
                is_deleted: true,
            };
        } catch (error) {
            throw error;
        }
    }

    async restore(id) {
        try {
            const faculty = await prisma.faculty.findFirst({
                where: { id },
            });

            if (!faculty) {
                throw new Error('Không tìm thấy khoa');
            }

            await prisma.faculty.update({
                where: { id },
                data: { is_deleted: false },
            });

            return {
                ...faculty,
                is_deleted: false,
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new FacultyRepository();
