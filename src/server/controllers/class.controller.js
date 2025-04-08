import classRepository from '../repositories/class.repository.js';

class classController {
    async getAll(req, res) {
        try {
            const { page_number, page_size, search, is_deleted } = req.query;
            const rs = await classRepository.getAll({
                page_number,
                page_size,
                search,
                is_deleted,
            });

            res.json({
                success: true,
                message: 'Lấy danh sách lớp học thành công',
                data: rs,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách lớp học',
                error: error.message,
            });
        }
    }
}

export default new classController();
