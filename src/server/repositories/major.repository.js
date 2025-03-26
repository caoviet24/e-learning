import prisma from '../middleware/prisma.intercepter.js';

class MajorRepository {
    async getAll({ page_size = 1, page_number = 10, search = '', faculty_id = '', is_deleted }) {
        try {
            const skip = (page_size - 1) * page_number;

            const [majors, total] = await Promise.all([
                prisma.major.findMany({
                    where: {
                        OR: [{ name: { contains: search } }],
                        faculty_id: faculty_id ? faculty_id : undefined,
                        is_deleted,
                    },
                    include: {
                        department: true,
                        _count: {
                            select: {
                                students: true,
                                classes: true,
                            },
                        },
                    },
                    skip,
                    take: parseInt(page_number),
                    orderBy: {
                        id: 'desc',
                    },
                }),
                prisma.major.count({
                    where: {
                        OR: [{ name: { contains: search } }],
                        faculty_id: faculty_id ? faculty_id : undefined,
                        is_deleted,
                    },
                }),
            ]);

            return {
                data: majors,
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
            return await prisma.major.findFirst({
                where: { id },
                include: {
                    department: true,
                    students: {
                        include: {
                            user: true,
                        },
                    },
                    classes: true,
                    _count: {
                        select: {
                            students: true,
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
            const existingMajor = await prisma.major.findFirst({
                where: { name: data.name },
            });

            if (existingMajor) {
                throw new Error('Mã ngành đã tồn tại');
            }

            const faculty = await prisma.faculty.findFirst({
                where: { faculty_id: data.faculty_id },
            });

            if (!faculty) {
                throw new Error('Không tìm thấy khoa');
            }

            return await prisma.major.create({
                data: {
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    faculty_id: data.faculty_id,
                },
                include: {
                    faculty: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const existingMajor = await prisma.major.findFirst({
                where: { id },
            });

            if (!existingMajor) {
                throw new Error('Không tìm thấy ngành');
            }

            const duplicateName = await prisma.major.findFirst({
                where: { name: data.name },
            });

            if (duplicateName) {
                throw new Error('Tên ngành đã tồn tại');
            }

            if (data.faculty_id) {
                const faculty = await prisma.faculty.findFirst({
                    where: { id: data.faculty_id },
                });

                if (!department) {
                    throw new Error('Không tìm thấy khoa');
                }
            }

            return await prisma.major.update({
                where: { id: parseInt(id) },
                data: {
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    faculty_id: data.faculty_id
                },
                include: {
                    faculty: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteSoft(id) {
        try {
            const major = await prisma.major.findFirst({
                where: { id: id }
            });

            if (!major) {
                throw new Error('Không tìm thấy ngành');
            }

            if (major.students.length > 0 || major.classes.length > 0) {
                throw new Error('Không thể xóa ngành đang có sinh viên hoặc lớp học');
            }

            return await prisma.major.update({
                where: { id },
                data: {
                    is_deleted: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}

export default new MajorRepository();
