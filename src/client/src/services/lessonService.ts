import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LessonPayload {
    title: string;
    description: string;
    urlVideo: string;
    position: number;
    courseId: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    urlVideo: string;
    position: number;
    courseId: string;
    createdAt?: string;
    updatedAt?: string;
}

export const lessonService = {
    async create(data: LessonPayload) {
        const res = await axiosJWT.post(`${API_URL}/lessons/create`, data);
        return res.data;
    },

    async getAll(courseId: string, page = 1, limit = 10) {
        const res = await axiosJWT.get(`${API_URL}/lessons/course/${courseId}`, {
            params: { page, limit }
        });
        return res.data;
    },

    async getById(id: string) {
        const res = await axiosJWT.get(`${API_URL}/lessons/${id}`);
        return res.data;
    },

    async update(id: string, data: Partial<LessonPayload>) {
        const res = await axiosJWT.put(`${API_URL}/lessons/update/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await axiosJWT.delete(`${API_URL}/lessons/delete/${id}`);
        return res.data;
    },

    async updatePosition(courseId: string, lessonId: string, position: number) {
        const res = await axiosJWT.put(`${API_URL}/lessons/update-position/${lessonId}`, {
            position,
            courseId
        });
        return res.data;
    }
};