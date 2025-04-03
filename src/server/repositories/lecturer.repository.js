import { lecturerDto } from '../dtos/lecturer.dto.js';
import { majorDto } from '../dtos/major.dto.js';
import prisma from '../middleware/prisma.intercepter.js';

class LecturerRepository {
    async getAll({ page_size = 10, page_number = 1, search = '', faculty_id = '', major_id = '', is_deleted }) {
        try {
            const skip = (page_number - 1) * page_size;

            const [lecturers, total] = await Promise.all([
                prisma.lecturer.findMany({
                    where: {
                        user: {
                            full_name: { contains: search },
                        },
                        faculty_id: faculty_id ? faculty_id : undefined,
                        major_id: major_id ? major_id : undefined,
                        user: {
                            is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : undefined,
                        },
                    },
                    select: lecturerDto,
                    skip,
                    take: parseInt(page_size),
                    orderBy: {
                        id: 'desc',
                    },
                }),
                prisma.lecturer.count({
                    where: {
                        user: {
                            full_name: { contains: search },
                        },
                        faculty_id: faculty_id ? faculty_id : undefined,
                        major_id: major_id ? major_id : undefined,
                        user: {
                            is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : undefined,
                        },
                    },
                }),
            ]);

            return {
                data: lecturers,
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
            return await prisma.lecturer.findFirst({
                where: { id },
                select: lecturerDto,
            });
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [{ username: data.username }, { email: data.email }],
                },
            });

            if (existingUser) {
                throw new Error('Tên đăng nhập hoặc email đã tồn tại');
            }

            const faculty = await prisma.faculty.findFirst({
                where: { id: data.faculty_id },
            });

            if (!faculty) {
                throw new Error('Không tìm thấy khoa');
            }

            const major = await prisma.major.findFirst({
                where: {
                    id: data.major_id,
                    faculty_id: data.faculty_id,
                },
            });

            if (!major) {
                throw new Error('Không tìm thấy ngành hoặc ngành không thuộc khoa đã chọn');
            }

            return await prisma.$transaction(async (prismaClient) => {
                const user = await prismaClient.user.create({
                    data: {
                        id: data.id,
                        username: data.username,
                        password: data.password,
                        full_name: data.full_name,
                        gender: data.gender,
                        avatar: data.avatar || '',
                        original_address: data.original_address || data.current_address || '',
                        current_address: data.original_address || data.current_address || '',
                        email: data.email,
                        phone_number: data.phone_number || '',
                        role: data.role || 'UNDEFINED',
                        is_deleted: false,
                    },
                });

                const countLecturers = await prismaClient.lecturer.count();
                let lecturerId;
                if (countLecturers < 100) {
                    lecturerId = `${faculty?.code}${major?.code}00${countLecturers + 1}`;
                } else {
                    lecturerId = `${faculty?.code}${major?.code}${countLecturers + 1}`;
                }

                const lecturer = await prismaClient.lecturer.create({
                    data: {
                        id: data.lecturer_id,
                        lecturer_id: lecturerId,
                        user_id: user.id,
                        faculty_id: data.faculty_id,
                        major_id: data.major_id,
                    },
                    select: lecturerDto,
                });

                return lecturer;
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const existingLecturer = await prisma.lecturer.findFirst({
                where: { id },
                include: { user: true },
            });

            if (!existingLecturer) {
                throw new Error('Không tìm thấy giảng viên');
            }

            if (data.faculty_id) {
                const faculty = await prisma.faculty.findFirst({
                    where: { id: data.faculty_id },
                });

                if (!faculty) {
                    throw new Error('Không tìm thấy khoa');
                }
            }

            if (data.major_id) {
                const facultyIdToUse = data.faculty_id || existingLecturer.faculty_id;

                const major = await prisma.major.findFirst({
                    where: {
                        id: data.major_id,
                        faculty_id: facultyIdToUse,
                    },
                });

                if (!major) {
                    throw new Error('Không tìm thấy ngành hoặc ngành không thuộc khoa đã chọn');
                }
            }

            return await prisma.$transaction(async (prismaClient) => {
                await prismaClient.user.update({
                    where: { id: existingLecturer.user_id },
                    data: {
                        full_name: data.full_name,
                        gender: data.gender !== undefined ? data.gender : undefined,
                        avatar: data.avatar,
                        original_address: data.original_address,
                        current_address: data.current_address,
                        email: data.email,
                        phone_number: data.phone_number,
                    },
                });

                const lecturer = await prismaClient.lecturer.update({
                    where: { id },
                    data: {
                        lecturer_id: data.id_card,
                        faculty_id: data.faculty_id,
                        major_id: data.major_id,
                    },
                    select: lecturerDto,
                });

                return lecturer;
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const lecturer = await prisma.lecturer.findFirst({
                where: { id },
            });

            if (!lecturer) {
                throw new Error('Không tìm thấy giảng viên');
            }

            const hasRelatedClasses = await prisma.lecturerClass.count({
                where: { lecturer_id: id },
            });

            if (hasRelatedClasses > 0) {
                throw new Error('Không thể xóa giảng viên đã được phân công lớp học');
            }

            return await prisma.$transaction(async (prismaClient) => {
                await prismaClient.lecturer.delete({
                    where: { id },
                });

                return await prismaClient.user.delete({
                    where: { id: lecturer.user_id },
                });
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteSoft(id) {
        try {
            const lecturer = await prisma.lecturer.findFirst({
                where: { id },
                select: lecturerDto,
            });

            if (!lecturer) {
                throw new Error('Không tìm thấy giảng viên');
            }

            const hasActiveClasses = await prisma.lecturerClass.count({
                where: {
                    lecturer_id: lecturer.lecturer_id,
                    ended_at: null,
                },
            });

            if (hasActiveClasses > 0) {
                throw new Error('Không thể xóa giảng viên đang có lớp học đang hoạt động');
            }

            console.log('lecturer', lecturer);
            

            await prisma.user.update({
                where: { id: lecturer.user.id },
                data: {
                    is_deleted: true,
                },
            });

            return {
                ...lecturer,
                user: {
                    ...lecturer.user,
                    is_deleted: true,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async restore(id) {
        try {
            const lecturer = await prisma.lecturer.findFirst({
                where: { id },
                select: lecturerDto,
            });

            if (!lecturer) {
                throw new Error('Không tìm thấy giảng viên');
            }

            await prisma.user.update({
                where: { id: lecturer.user.id },
                data: {
                    is_deleted: false,
                },
            });

            return {
                ...lecturer,
                user: {
                    ...lecturer.user,
                    is_deleted: true,
                },
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new LecturerRepository();
