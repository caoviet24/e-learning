import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAll({
    page_number,
    page_size,
    search,
    faculty_id,
    major_id,
    lecturer_id,
    is_deleted,
}: {
    page_number: number;
    page_size: number;
    search?: string;
    faculty_id?: string;
    major_id?: string;
    lecturer_id?: string;
    is_deleted?: boolean;
}) {
    const res = await axiosJWT.get(`${API_URL}/courses/get-all`, {
        params: {
            page_number,
            page_size,
            search: search || null,
            faculty_id: faculty_id || null,
            major_id: major_id || null,
            lecturer_id: lecturer_id || null,
            is_deleted,
        },
    });
    return res.data;
}


async function getByLecturerId(lecturer_id: string) {
    const res = await axiosJWT.get(`${API_URL}/courses/get-by-lecturer-id/${lecturer_id}`);
    return res.data;
}

async function getById(id: string) {
    const res = await axiosJWT.get(`${API_URL}/courses/get-by-id/${id}`);
    return res.data;
}

async function create(data: any) {
    const res = await axiosJWT.post(`${API_URL}/courses/create`, data);
    return res.data;
}

async function update(id: string, data: any) {
    const res = await axiosJWT.put(`${API_URL}/courses/update/${id}`, data);
    return res.data;
}

async function deleteCourse(id: string) {
    const res = await axiosJWT.delete(`${API_URL}/courses/delete/${id}`);
    return res.data;
}

async function deleteSoft(id: string) {
    const res = await axiosJWT.delete(`${API_URL}/courses/delete-soft/${id}`);
    return res.data;
}

async function restore(id: string) {
    const res = await axiosJWT.put(`${API_URL}/courses/restore/${id}`);
    return res.data;
}

export const courseService = {
    getAll,
    getByLecturerId,
    getById,
    create,
    update, 
    deleteCourse,
    deleteSoft,
    restore,
};
