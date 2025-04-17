import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const classService = {
    async getAll({ pageNumber, pageSize, search, facultyId, majorId, lecturer_id, isDeleted }: {
        pageNumber: number;
        pageSize: number;
        search?: string;
        facultyId?: string;
        majorId?: string;
        lecturer_id?: string;
        isDeleted?: boolean
    }) {
        const res = await axiosJWT.get(`${API_URL}/classes/get-all`, {
            params: {
                pageNumber,
                pageSize,
                search: search || null,
                facultyId: facultyId || null,
                majorId: majorId || null,
                lecturer_id: lecturer_id || null,
                isDeleted,
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