import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const lecturerService = {
    async getAll({ pageNumber, pageSize, search, facultyId, majorId, isDeleted }: {
        pageNumber: number;
        pageSize: number;
        search?: string;
        facultyId?: string;
        majorId?: string;
        isDeleted?: boolean
    }) {
        const res = await axiosJWT.get(`${API_URL}/lecturers/get-all`, {
            params: {
                pageNumber,
                pageSize,
                search: search || null,
                facultyId: facultyId || null,
                majorId: majorId || null,
                isDeleted,
            },
        });
        return res.data;
    },

    async getById(id: string) {
        const res = await axiosJWT.get(`${API_URL}/lecturers/get-by-id/${id}`);
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
