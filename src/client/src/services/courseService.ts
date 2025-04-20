import axiosJWT from '@/utils/axios.intercepter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface GetAllOptions {
    pageNumber: number;
    pageSize: number;
    search?: string;
    facultyId?: string;
    majorId?: string;
    lecturer_id?: string;
    status?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    type: 'basic' | 'with-author' | 'detail'
}

async function getAll({
    pageNumber,
    pageSize,
    search,
    facultyId,
    majorId,
    lecturer_id,
    status,
    isActive,
    isDeleted,
    type,
}: GetAllOptions) {
    let url : string;
    if (type === 'basic') {
        url = `${API_URL}/course/get-all-basic`;
    } else if (type === 'with-author') {
        url = `${API_URL}/course/get-all-with-author`;
    } else if (type === 'detail') {
        url = `${API_URL}/course/get-detail`;
    } else {
        throw new Error(`Invalid type: ${type}`);
    }
    const res = await axiosJWT.get(url, {
        params: {
            pageNumber,
            pageSize,
            search: search || null,
            facultyId: facultyId || null,
            majorId: majorId || null,
            lecturer_id: lecturer_id || null,
            status: status || null,
            isActive: isActive || null,
            isDeleted: isDeleted || null,
        },
    });
    return res.data;
}

async function getById(id: string) {
    const res = await axiosJWT.get(`${API_URL}/course/get-by-id/${id}`);
    return res.data;
}

async function create(data: any) {
    const res = await axiosJWT.post(`${API_URL}/course/create`, data);
    return res.data;
}

async function update(id: string, data: any) {
    const res = await axiosJWT.put(`${API_URL}/course/update/${id}`, data);
    return res.data;
}

async function deleteCourse(id: string) {
    const res = await axiosJWT.delete(`${API_URL}/course/delete/${id}`);
    return res.data;
}

async function deleteSoft(id: string) {
    const res = await axiosJWT.delete(`${API_URL}/course/delete-soft/${id}`);
    return res.data;
}

async function restore(id: string) {
    const res = await axiosJWT.put(`${API_URL}/course/restore/${id}`);
    return res.data;
}

async function active(id: string) {
    const res = await axiosJWT.put(`${API_URL}/course/active/${id}`);
    return res.data;
}

async function inActive(id: string) {
    const res = await axiosJWT.put(`${API_URL}/course/in-active/${id}`);
    return res.data;
}

async function updateStatus(id: string, status: string) {
    const res = await axiosJWT.put(`${API_URL}/course/update-status/${id}`, { status });
    return res.data;
}

// Interface for course statistics
export interface CourseStatistics {
    totalStudents: number;
    completionRate: number;
    lessonsCompleted: number;
    totalLessons: number;
    studentProgress: {
        name: string;
        progress: number;
    }[];
    completionByWeek: {
        week: string;
        completions: number;
    }[];
}

async function getStatistics(courseId: string): Promise<CourseStatistics> {
    const res = await axiosJWT.get(`${API_URL}/course/statistics/${courseId}`);
    return res.data;
}

// Mock function for statistics if backend API is not ready
async function getStatisticsMock(courseId: string): Promise<CourseStatistics> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate random data for demo
    const totalStudents = Math.floor(Math.random() * 100) + 10;
    const totalLessons = Math.floor(Math.random() * 20) + 5;
    const lessonsCompleted = Math.floor(Math.random() * totalLessons);
    const completionRate = Math.round((lessonsCompleted / totalLessons) * 100);
    
    // Generate random student progress
    const studentProgress = Array.from({ length: 10 }, (_, i) => ({
        name: `Student ${i+1}`,
        progress: Math.floor(Math.random() * 100)
    }));
    
    // Generate weekly completion data
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const completionByWeek = weeks.map(week => ({
        week,
        completions: Math.floor(Math.random() * 30)
    }));
    
    return {
        totalStudents,
        completionRate,
        lessonsCompleted,
        totalLessons,
        studentProgress,
        completionByWeek
    };
}

export const courseService = {
    getAll,
    getById,
    create,
    update,
    deleteCourse,
    deleteSoft,
    restore,
    active,
    inActive,
    updateStatus,
    getStatistics: getStatisticsMock // Use mock for now, switch to real API when ready
};
