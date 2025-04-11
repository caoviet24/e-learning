import axiosJWT from '@/utils/axios.intercepter';
import axios from 'axios';
import { IUser } from '@/types';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const accountService = {
    async auth() {
        const res = await axiosJWT.get(`${API_URL}/auth/me`);
        return res.data;
    },

    async login(data: any) {
        const res = await axios.post(`${API_URL}/auth/login`, data);
        return res.data;
    },

    async register(data: any) {
        const res = await axios.post(`${API_URL}/auth/register`, data);
        return res.data;
    },

    async logout(setUserFn?: (user: IUser | null) => void) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        if (setUserFn) {
            setUserFn(null);
        }
        
        window.location.href = '/auth/sign-in';
    },

    async updateProfile(userId: string, data: Partial<IUser>) {
        const res = await axiosJWT.put(`${API_URL}/users/update/${userId}`, data);
        return res.data;
    },

    async changePassword(userId: string, data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
        const res = await axiosJWT.put(`${API_URL}/users/change-password/${userId}`, data);
        return res.data;
    }
};
