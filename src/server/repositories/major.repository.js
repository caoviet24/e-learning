import { majorDto } from '../dtos/major.dto.js';
import prisma from '../middleware/prisma.intercepter.js';

class MajorRepository {
    async getAll({ page_size = 10, page_number = 1, search = '', faculty_id = '', is_deleted }) {
        try {
            const skip = (page_number - 1) * page_size;

            const [majors, total] = await Promise.all([
                prisma.major.findMany({
                    where: {
                        OR: [{ name: { contains: search } }],
                        faculty_id: faculty_id ? faculty_id : undefined,
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
                    },
                    select: majorDto,
                    skip,
                    take: parseInt(page_size),
                    orderBy: {
                        id: 'desc',
                    },
                }),
                prisma.major.count({
                    where: {
                        OR: [{ name: { contains: search } }],
                        faculty_id: faculty_id ? faculty_id : undefined,
                        is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : null,
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
                select: majorDto,
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
                where: { id: data.faculty_id },
            });

            if (!faculty) {
                throw new Error('Không tìm thấy khoa');
            }

            return await prisma.major.create({
                data: {
                    name: data.name,
                    code: data.code,
                    faculty_id: data.faculty_id,
                },
                select: majorDto,
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
            if (duplicateName && duplicateName.id !== id) {
                throw new Error('Tên ngành đã tồn tại');
            }

            const duplicateCode = await prisma.major.findFirst({
                where: { code: data.code },
            });
            if (duplicateCode && duplicateCode.id !== id) {
                throw new Error('Mã ngành đã tồn tại');
            }

            const exitFaculty = await prisma.faculty.findFirst({
                where: { id: data.faculty_id },
            });
            if (!exitFaculty) {
                throw new Error('Không tìm thấy khoa');
            }

            return await prisma.major.update({
                where: { id },
                data: {
                    name: data.name,
                    code: data.code,
                    faculty_id: data.faculty_id,
                },
                select: majorDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const major = await prisma.major.findFirst({
                where: { id: id },
            });

            if (!major) {
                throw new Error('Không tìm thấy ngành');
            }

            return await prisma.major.delete({
                where: { id },
                select: majorDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteSoft(id) {
        try {
            const major = await prisma.major.findFirst({
                where: { id: id },
            });

            if (!major) {
                throw new Error('Không tìm thấy ngành');
            }

            if (major?.students?.length > 0 || major?.classes?.length > 0) {
                throw new Error('Không thể xóa ngành đang có sinh viên hoặc lớp học');
            }

            return await prisma.major.update({
                where: { id },
                data: {
                    is_deleted: true,
                },
                select: majorDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async restore(id) {
        try {
            const major = await prisma.major.findFirst({
                where: { id: id },
            });

            if (!major) {
                throw new Error('Không tìm thấy ngành');
            }

            return await prisma.major.update({
                where: { id },
                data: {
                    is_deleted: false,
                },
                select: majorDto,
            });
        } catch (error) {
            throw error;
        }
    }
}

export default new MajorRepository();
