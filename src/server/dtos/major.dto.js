import { facultyDto } from "./faculty.dto.js";

 
 
 const majorDto = {
    id: true,
    name: true,
    code: true,
    is_deleted: true,
    faculty: {
        select: facultyDto,
    },
}


export {
    majorDto,
}