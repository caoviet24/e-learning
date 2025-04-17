import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

function fetchRefreshToken(token: string): Promise<RefreshTokenResponse> {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                headers: {
                    refresh_token: token,
                },
                withCredentials: true,
            });
            resolve(res.data);
        } catch (error) {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            redirect('/auth/sign-in');
        }
    })
}


function createAxiosJwtInstance() {
    const axiosJWT = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
    });
    
    axiosJWT.interceptors.request.use(
        async (config) => {
            const accessToken = Cookies.get('accessToken');
            
            if (!accessToken) {
                throw new Error('Access token is missing');
            }
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken.exp && decodedToken.exp < new Date().getTime() / 1000) {
                const refreshToken = Cookies.get('refreshToken')

                if (!refreshToken) {
                    throw new Error('Refresh token is missing');
                }
                const res = await fetchRefreshToken(refreshToken);

                if (res) {
                    Cookies.set('accessToken', res.accessToken);
                    config.headers.Authorization = `Bearer ${res.accessToken}`;
                }

               
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    return axiosJWT;
}

const axiosJWT = createAxiosJwtInstance();

export default axiosJWT;