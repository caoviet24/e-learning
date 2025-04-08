import { facultyDto } from './faculty.dto.js';

const courseDto = {
    id: true,
    name: true,
    description: true,
    faculty: facultyDto,
    major: {
        id: true,
        name: true,
        code: true,
        is_deleted: true,
    },
};

export { courseDto };
