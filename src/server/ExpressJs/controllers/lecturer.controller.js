import lecturerRepository from '../repositories/lecturer.repository.js';

class LecturerController {
    async getAll(req, res) {
        try {
            const {
                page_number = 1,
                page_size = 10,
                search = '',
                faculty_id = '',
                major_id = '',
                is_deleted,
            } = req.query;

            const result = await lecturerRepository.getAll({
                page_number: parseInt(page_number),
                page_size: parseInt(page_size),
                search,
                faculty_id,
                major_id,
                is_deleted,
            });

            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách giảng viên',
                error: error.message,
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const lecturer = await lecturerRepository.getById(id);

            if (!lecturer) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy giảng viên',
                });
            }

            res.json({
                success: true,
                data: lecturer,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin giảng viên',
                error: error.message,
            });
        }
    }

    async create(req, res) {
        try {
            const { username, password, full_name, role, faculty_id, major_id } = req.body;

            if (!username || !password || !full_name || !faculty_id || !major_id || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Thông tin bắt buộc không được để trống',
                });
            }

            const lecturer = await lecturerRepository.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Tạo giảng viên thành công',
                data: lecturer,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo giảng viên',
                error: error.message,
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { id: _id, ...rest } = req.body;


            if (!rest.full_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Họ tên không được để trống',
                });
            }

            const lecturer = await lecturerRepository.update(id, rest);

            res.json({
                success: true,
                message: 'Cập nhật giảng viên thành công',
                data: lecturer,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật giảng viên',
                error: error.message,
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const lecturer = await lecturerRepository.delete(id);

            res.json({
                success: true,
                message: 'Xóa giảng viên thành công',
                data: lecturer,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa giảng viên',
                error: error.message,
            });
        }
    }

    async deleteSoft(req, res) {
        try {
            const { id } = req.params;
            const lecturer = await lecturerRepository.deleteSoft(id);

            res.json({
                success: true,
                message: 'Xóa tạm thời giảng viên',
                data: lecturer,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa tạm thời giảng viên',
                error: error.message,
            });
        }
    }

    async restore(req, res) {
        try {
            const { id } = req.params;
            const lecturer = await lecturerRepository.restore(id);

            res.json({
                success: true,
                message: 'Khôi phục giảng viên thành công',
                data: lecturer,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi khôi phục giảng viên',
                error: error.message,
            });
        }
    }

}

export default new LecturerController();
