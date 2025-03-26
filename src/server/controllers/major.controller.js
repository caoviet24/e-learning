import majorRepository from '../repositories/major.repository.js';

class MajorController {
    async getAll(req, res) {
        try {
            const { page_number = 1, page_size = 10, search = '', faculty_id = '', is_deleted } = req.query;

            const result = await majorRepository.getAll({
                page_number: parseInt(page_number),
                page_size: parseInt(page_size),
                search,
                faculty_id,
                is_deleted,
            });

            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách ngành',
                error: error.message,
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const major = await majorRepository.getById(id);

            if (!major) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy ngành',
                });
            }

            res.json({
                success: true,
                data: major,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin ngành',
                error: error.message,
            });
        }
    }

    async getByFacultyId(req, res) {
        try {
            const { faculty_id } = req.params;
            const { page_number = 1, page_size = 10, search = '' } = req.query;

            const result = await majorRepository.getByFacultyId(faculty_id, {
                page_number: parseInt(page_number),
                page_size: parseInt(page_size),
                search,
            });

            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách ngành theo khoa',
                error: error.message,
            });
        }
    }

    async create(req, res) {
        try {
            const { name, code, description, faculty_id } = req.body;

            if (!name || !code || !faculty_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên ngành, mã ngành và mã khoa không được để trống',
                });
            }

            const major = await majorRepository.create({
                name,
                code,
                description,
                faculty_id,
            });

            res.status(201).json({
                success: true,
                message: 'Tạo ngành thành công',
                data: major,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo ngành',
                error: error.message,
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, code, description, faculty_id } = req.body;

            if (!name || !code) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên ngành và mã ngành không được để trống',
                });
            }

            const major = await majorRepository.update(id, {
                name,
                code,
                description,
                faculty_id,
            });

            res.json({
                success: true,
                message: 'Cập nhật ngành thành công',
                data: major,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật ngành',
                error: error.message,
            });
        }
    }

    async deleteSoft(req, res) {
        try {
            const { id } = req.params;
            await majorRepository.deleteSoft(id);

            res.json({
                success: true,
                message: 'Xóa ngành thành công',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa ngành',
                error: error.message,
            });
        }
    }
}

export default new MajorController();
