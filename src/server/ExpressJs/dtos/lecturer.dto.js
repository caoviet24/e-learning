import { majorDto } from './major.dto.js';
import { userDto } from './user.dto.js';

const lecturerDto = {
    id: true,
    lecturer_id: true,
    faculty: {
        select: {
            id: true,
            name: true,
            code: true,
        },
    },
    major: {
        select: {
            id: true,
            name: true,
            code: true,
        },
    },
    user: {
        select: userDto,
    },
};

export { lecturerDto };
