import axiosJWT from '@/utils/axios.intercepter';
import axios from 'axios';
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

    async logout() {
        Cookies.remove('token');
        window.location.href = '/auth/sign-in';
    },
};
