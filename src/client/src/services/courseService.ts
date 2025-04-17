import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface GetAllOptions {
    pageNumber: number;
    pageSize: number;
    search?: string;
    facultyId?: string;
    majorId?: string;
    lecturer_id?: string;
    status?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    type: 'basic' | 'with-author' | 'detail'
}

async function getAll({
    pageNumber,
    pageSize,
    search,
    facultyId,
    majorId,
    lecturer_id,
    status,
    isActive,
    isDeleted,
    type,
}: GetAllOptions) {
    let url : string;
    if (type === 'basic') {
        url = `${API_URL}/courses/get-all-basic`;
    } else if (type === 'with-author') {
        url = `${API_URL}/courses/get-all-with-author`;
    } else if (type === 'detail') {
        url = `${API_URL}/courses/get-detail`;
    } else {
        throw new Error(`Invalid type: ${type}`);
    }
    const res = await axiosJWT.get(url, {
        params: {
            pageNumber,
            pageSize,
            search: search || null,
            facultyId: facultyId || null,
            majorId: majorId || null,
            lecturer_id: lecturer_id || null,
            status: status || null,
            isActive: null,
            isDeleted: null,
        },
    });
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

async function active(id: string) {
    const res = await axiosJWT.put(`${API_URL}/courses/active/${id}`);
    return res.data;
}

async function inActive(id: string) {
    const res = await axiosJWT.put(`${API_URL}/courses/in-active/${id}`);
    return res.data;
}

async function updateStatus(id: string, status: string) {
    const res = await axiosJWT.put(`${API_URL}/courses/update-status/${id}`, { status });
    return res.data;
}

export const courseService = {
    getAll,
    getById,
    create,
    update,
    deleteCourse,
    deleteSoft,
    restore,
    active,
    inActive,
    updateStatus,
};
