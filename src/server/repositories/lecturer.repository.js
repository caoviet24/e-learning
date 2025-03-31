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
                        }
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                full_name: true,
                                email: true,
                                gender: true,
                                avatar: true,
                                phone_number: true,
                                is_deleted: true,
                                original_address: true,
                                current_address: true,
                            },
                        },
                        faculty: true,
                        major: true,
                    },
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
                        }
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
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            email: true,
                            gender: true,
                            avatar: true,
                            phone_number: true,
                            is_deleted: true,
                            original_address: true,
                            current_address: true,
                        },
                    },
                    faculty: true,
                    major: true,
                    classes: {
                        include: {
                            class: true,
                        }
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            // Checking if user already exists with the same username or email
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: data.username },
                        { email: data.email },
                    ],
                },
            });

            if (existingUser) {
                throw new Error('Tên đăng nhập hoặc email đã tồn tại');
            }

            // Checking if faculty exists
            const faculty = await prisma.faculty.findFirst({
                where: { id: data.faculty_id },
            });

            if (!faculty) {
                throw new Error('Không tìm thấy khoa');
            }

            // Checking if major exists and belongs to the selected faculty
            const major = await prisma.major.findFirst({
                where: {
                    id: data.major_id,
                    faculty_id: data.faculty_id,
                },
            });

            if (!major) {
                throw new Error('Không tìm thấy ngành hoặc ngành không thuộc khoa đã chọn');
            }

            // Creating user and lecturer in a transaction
            return await prisma.$transaction(async (prismaClient) => {
                const user = await prismaClient.user.create({
                    data: {
                        id: data.id,
                        username: data.username,
                        password: data.password, // Should be hashed before storing
                        full_name: data.full_name,
                        gender: data.gender,
                        avatar: data.avatar || '',
                        original_address: data.original_address || '',
                        current_address: data.current_address || '',
                        email: data.email,
                        phone_number: data.phone_number || '',
                        role: 'LECTURER',
                        created_by: data.created_by,
                        is_deleted: false,
                    },
                });

                const lecturer = await prismaClient.lecturer.create({
                    data: {
                        id: data.lecturer_id,
                        lecturer_id: data.id_card,
                        user_id: user.id,
                        faculty_id: data.faculty_id,
                        major_id: data.major_id,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                full_name: true,
                                email: true,
                                gender: true,
                                avatar: true,
                                phone_number: true,
                                is_deleted: true,
                                original_address: true,
                                current_address: true,
                            },
                        },
                        faculty: true,
                        major: true,
                    },
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

            // Check if username or email is being changed and already exists
            if (data.username || data.email) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            data.username ? { username: data.username } : {},
                            data.email ? { email: data.email } : {},
                        ],
                        NOT: {
                            id: existingLecturer.user_id,
                        },
                    },
                });

                if (existingUser) {
                    throw new Error('Tên đăng nhập hoặc email đã tồn tại');
                }
            }

            // If faculty_id is provided, check if it exists
            if (data.faculty_id) {
                const faculty = await prisma.faculty.findFirst({
                    where: { id: data.faculty_id },
                });

                if (!faculty) {
                    throw new Error('Không tìm thấy khoa');
                }
            }

            // If major_id is provided, check if it exists and belongs to the selected faculty
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

            // Update user and lecturer in a transaction
            return await prisma.$transaction(async (prismaClient) => {
                // Update user information
                await prismaClient.user.update({
                    where: { id: existingLecturer.user_id },
                    data: {
                        username: data.username,
                        full_name: data.full_name,
                        gender: data.gender !== undefined ? data.gender : undefined,
                        avatar: data.avatar,
                        original_address: data.original_address,
                        current_address: data.current_address,
                        email: data.email,
                        phone_number: data.phone_number,
                        password: data.password, // Should be hashed before storing if provided
                        updated_at: new Date(),
                        updated_by: data.updated_by,
                    },
                });

                // Update lecturer information
                const lecturer = await prismaClient.lecturer.update({
                    where: { id },
                    data: {
                        lecturer_id: data.id_card,
                        faculty_id: data.faculty_id,
                        major_id: data.major_id,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                full_name: true,
                                email: true,
                                gender: true,
                                avatar: true,
                                phone_number: true,
                                is_deleted: true,
                                original_address: true,
                                current_address: true,
                            },
                        },
                        faculty: true,
                        major: true,
                    },
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

            // Check if lecturer has related records before hard delete
            const hasRelatedClasses = await prisma.lecturerClass.count({
                where: { lecturer_id: id },
            });

            if (hasRelatedClasses > 0) {
                throw new Error('Không thể xóa giảng viên đã được phân công lớp học');
            }

            return await prisma.$transaction(async (prismaClient) => {
                // Delete lecturer record
                await prismaClient.lecturer.delete({
                    where: { id },
                });

                // Delete associated user
                return await prismaClient.user.delete({
                    where: { id: lecturer.user_id },
                });
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteSoft(id, deleted_by) {
        try {
            const lecturer = await prisma.lecturer.findFirst({
                where: { id },
                include: { user: true },
            });

            if (!lecturer) {
                throw new Error('Không tìm thấy giảng viên');
            }

            // Check if lecturer has active classes
            const hasActiveClasses = await prisma.lecturerClass.count({
                where: {
                    lecturer_id: id,
                    ended_at: null, // active classes
                },
            });

            if (hasActiveClasses > 0) {
                throw new Error('Không thể xóa giảng viên đang có lớp học đang hoạt động');
            }

            // Soft delete by updating user record
            return await prisma.user.update({
                where: { id: lecturer.user_id },
                data: {
                    is_deleted: true,
                    deleted_at: new Date(),
                    deleted_by,
                },
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    email: true,
                    is_deleted: true,
                    deleted_at: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async restore(id) {
        try {
            const lecturer = await prisma.lecturer.findFirst({
                where: { id },
                include: { user: true },
            });

            if (!lecturer) {
                throw new Error('Không tìm thấy giảng viên');
            }

            // Restore by updating user record
            return await prisma.user.update({
                where: { id: lecturer.user_id },
                data: {
                    is_deleted: false,
                    deleted_at: null,
                    deleted_by: null,
                },
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    email: true,
                    is_deleted: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async searchByDepartment(faculty_id, { page_size = 10, page_number = 1, search = '', is_deleted = false }) {
        try {
            const skip = (page_number - 1) * page_size;

            const [lecturers, total] = await Promise.all([
                prisma.lecturer.findMany({
                    where: {
                        faculty_id,
                        user: {
                            full_name: { contains: search },
                            is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : undefined,
                        }
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                full_name: true,
                                email: true,
                                gender: true,
                                avatar: true,
                                phone_number: true,
                                is_deleted: true,
                                original_address: true,
                                current_address: true,
                            },
                        },
                        faculty: true,
                        major: true,
                    },
                    skip,
                    take: parseInt(page_size),
                    orderBy: {
                        id: 'desc',
                    },
                }),
                prisma.lecturer.count({
                    where: {
                        faculty_id,
                        user: {
                            full_name: { contains: search },
                            is_deleted: is_deleted === 'false' ? false : is_deleted === 'true' ? true : undefined,
                        }
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
}

export default new LecturerRepository();