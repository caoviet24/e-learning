import { majorDto } from './major.dto.js';
import { userDto } from './user.dto.js';

const lecturerDto = {
    id: true,
    lecturer_id: true,
    major: {
        select: majorDto,
    },
    user: {
        select : userDto,
    }
};

export { lecturerDto };
