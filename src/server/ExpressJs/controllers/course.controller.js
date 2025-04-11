import courseRepository from '../repositories/course.repository.js';

class CourseController {
    async getAll(req, res) {
        try {
            const { page_number, page_size, search, is_deleted, faculty_id, major_id, lecturer_id } = req.query;
            const rs = await courseRepository.getAll({
                page_number,
                page_size,
                search,
                is_deleted,
                faculty_id,
                major_id,
                lecturer_id,
            });
            res.json({
                success: true,
                message: 'Lấy danh sách khóa học thành công',
                data: rs,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách khóa học',
                error: error.message,
            });
        }
    }

    async getByLecturerId(req, res) {
        try {
            const { id } = req.params;
            const rs = await courseRepository.getByLecturerId(id);
            res.json({
                success: true,
                message: 'Lấy danh sách khóa học thành công',
                data: rs,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách khóa học',
                error: error.message,
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const rs = await courseRepository.getById(id);
            res.json({
                success: true,
                message: 'Lấy khóa học thành công',
                data: rs,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy khóa học',
                error: error.message,
            });
        }
    }

    async create(req, res) {
        try {
            const { title, description, faculty_id, major_id } = req.body;

            if (!title || !description || !faculty_id || !major_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên khóa học và mã khoa không được để trống',
                });
            }

            const course = await courseRepository.create({
                title,
                description,
                faculty_id,
                major_id,
            });

            res.json({
                success: true,
                message: 'Tạo khóa học thành công',
                data: course,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo khóa học',
                error: error.message,
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, faculty_id, major_id, lecturer_id } = req.body;

            if (!title || !description || !faculty_id || !major_id || !lecturer_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên khóa học và mã khoa không được để trống',
                });
            }

            const course = await courseRepository.update(id, {
                title,
                description,
                faculty_id,
                major_id,
                lecturer_id,
            });

            res.json({
                success: true,
                message: 'Cập nhật khóa học thành công',
                data: course,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật khóa học',
                error: error.message,
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;

            const course = await courseRepository.delete(id);

            res.json({
                success: true,
                message: 'Xóa khóa học thành công',
                data: course,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa khóa học',
                error: error.message,
            });
        }
    }

    async deleteSoft(req, res) {
        try {
            const { id } = req.params;

            const course = await courseRepository.deleteSoft(id);

            res.json({
                success: true,
                message: 'Xóa khóa học thành công',
                data: course,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa khóa học',
                error: error.message,
            });
        }
    }

    async restore(req, res) {
        try {
            const { id } = req.params;

            const course = await courseRepository.restore(id);

            res.json({
                success: true,
                message: 'Khôi phục khóa học thành công',
                data: course,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi khôi phục khóa học',
                error: error.message,
            });
        }
    }
}

export default new CourseController();
