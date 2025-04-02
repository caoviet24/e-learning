import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const lecturerService = {
    async getAll({ page_number, page_size, search, faculty_id, major_id, is_deleted }: {
        page_number: number;
        page_size: number;
        search?: string;
        faculty_id?: string;
        major_id?: string;
        is_deleted?: boolean
    }) {
        const res = await axiosJWT.get(`${API_URL}/lecturers/get-all`, {
            params: {
                page_number,
                page_size,
                search: search || null,
                faculty_id: faculty_id || null,
                major_id: major_id || null,
                is_deleted,
            },
        });
        return res.data;
    },

  
    async create(data : any) {
        const res = await axiosJWT.post(`${API_URL}/lecturers/create`, data);
        return res.data;
    },

    async update(id: string, data : any) {
        const res = await axiosJWT.put(`${API_URL}/lecturers/update/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/lecturers/delete/${id}`);
        return res.data;
    },

    async deleteSoft(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/lecturers/delete-soft/${id}`);
        return res.data;
    },

    async restore(id: string) {
        const res = await axiosJWT.put(`${API_URL}/lecturers/restore/${id}`);
        return res.data;
    },
};
