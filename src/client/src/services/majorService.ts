import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const majorService = {
    async getAll({ page_number, page_size, search, is_deleted, faculty_id }: {
        page_number: number;
        page_size: number;
        search?: string;
        is_deleted?: boolean;
        faculty_id?: string;
    }) {
        const res = await axiosJWT.get(`${API_URL}/majors/get-all`, {
            params: {
                page_number,
                page_size,
                search,
                is_deleted,
                faculty_id,
            },
        });
        return res.data;
    },

    async getById(id: string) {
        const res = await axiosJWT.get(`${API_URL}/majors/${id}`);
        return res.data;
    },

    async create(data: any) {
        const res = await axiosJWT.post(`${API_URL}/majors/create`, data);
        return res.data;
    },

    async update(id: string, data: any) {
        console.log('update major', id, data);
        
        const res = await axiosJWT.put(`${API_URL}/majors/update/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/majors/delete/${id}`);
        return res.data;
    },

    async deleteSoft(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/majors/delete-soft/${id}`);
        return res.data;
    },

    async restore(id: string) {
        const res = await axiosJWT.put(`${API_URL}/majors/restore/${id}`);
        return res.data;
    },
};