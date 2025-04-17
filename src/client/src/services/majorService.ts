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
        const res = await axiosJWT.get(`${API_URL}/majors/get-all`, {
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