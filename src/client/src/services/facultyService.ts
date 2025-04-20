import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const facultyService = {
    async getAll({ pageNumber, pageSize, search, isDeleted }: { pageNumber: number; pageSize: number, search?: string, isDeleted?: boolean }) {
        const res = await axiosJWT.get(`${API_URL}/faculty/get-all`, {
            params: {
                pageNumber,
                pageSize,
                search: search || null,
                isDeleted,
            },
        });
        return res.data;
    },

    async getById(id: string) {
        const res = await axiosJWT.get(`${API_URL}/faculty/${id}`);
        return res.data;
    },

    async create(data: { name: string; code: string }) {
        const res = await axiosJWT.post(`${API_URL}/faculty/create`, data);
        return res.data;
    },

    async update(id: string, data: { name?: string; code?: string; isDeleted?: boolean }) {
        const res = await axiosJWT.put(`${API_URL}/faculty/update/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/faculty/delete/${id}`);
        return res.data;
    },

    async deleteSoft(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/faculty/delete-soft/${id}`);
        return res.data;
    },


    async restore(id: string) {
        const res = await axiosJWT.put(`${API_URL}/faculty/restore/${id}`);
        return res.data;
    },
};
