import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const facultyService = {
    async getAll({ page_number, page_size }: { page_number: number; page_size: number }) {
        const res = await axiosJWT.get(`/faculties/get-all`, {
            params: {
                page_number,
                page_size,
            },
        });
        return res.data;
    },

    async getById(id: string) {
        const res = await axiosJWT.get(`${API_URL}/faculties/${id}`);
        return res.data;
    },

    async create(data: { name: string; code: string }) {
        const res = await axiosJWT.post(`${API_URL}/faculties/create`, data);
        return res.data;
    },

    async update(id: string, data: { name: string; code: string }) {
        const res = await axiosJWT.put(`${API_URL}/faculties/update/${id}`, data);
        return res.data;
    },

    async deleteSoft(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/faculties/delete-soft/${id}`);
        return res.data;
    },
};
