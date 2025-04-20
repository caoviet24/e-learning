import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const majorService = {
    async getAll({ pageNumber, pageSize, search, isDeleted, facultyId }: {
        pageNumber: number;
        pageSize: number;
        search?: string;
        isDeleted?: boolean;
        facultyId?: string;
    }) {
        const res = await axiosJWT.get(`${API_URL}/major/get-all`, {
            params: {
                pageNumber,
                pageSize,
                search,
                isDeleted,
                facultyId,
            },
        });
        return res.data;
    },

    async getById(id: string) {
        const res = await axiosJWT.get(`${API_URL}/major/${id}`);
        return res.data;
    },

    async create(data: unknown) {
        const res = await axiosJWT.post(`${API_URL}/major/create`, data);
        return res.data;
    },

    async update(id: string, data: any) {
        console.log('update major', id, data);
        
        const res = await axiosJWT.put(`${API_URL}/major/update/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/major/delete/${id}`);
        return res.data;
    },

    async deleteSoft(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/major/delete-soft/${id}`);
        return res.data;
    },

    async restore(id: string) {
        const res = await axiosJWT.put(`${API_URL}/major/restore/${id}`);
        return res.data;
    },
};