import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const classService = {
    async getAll({ page_number, page_size, search, faculty_id, major_id, lecturer_id, is_deleted }: {
        page_number: number;
        page_size: number;
        search?: string;
        faculty_id?: string;
        major_id?: string;
        lecturer_id?: string;
        is_deleted?: boolean
    }) {
        const res = await axiosJWT.get(`${API_URL}/classes/get-all`, {
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
    },

    async create(data: any) {
        const res = await axiosJWT.post(`${API_URL}/classes/create`, data);
        return res.data;
    },

    async update(id: string, data: any) {
        const res = await axiosJWT.put(`${API_URL}/classes/update/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/classes/delete/${id}`);
        return res.data;
    },

    async deleteSoft(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/classes/delete-soft/${id}`);
        return res.data;
    },

    async restore(id: string) {
        const res = await axiosJWT.put(`${API_URL}/classes/restore/${id}`);
        return res.data;
    },
};