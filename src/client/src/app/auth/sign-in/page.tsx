'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { accountService } from '@/services/accountService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import Cookies from 'js-cookie';
import useHookMutation from '@/hooks/useHookMutation';

type FormData = {
    username: string;
    password: string;
    role: number;
};

export default function LoginPage() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        role: 0,
    });

    const router = useRouter();

    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const loginMutation = useHookMutation((data: FormData) => accountService.login(data));

    const handleLogin = async () => {
        loginMutation.mutate(formData, {
            onSuccess: (res) => {
                const decoded = jwtDecode<JwtPayload>(res.access_token);
                const role = decoded.role;
                
                console.log('role', role);
                

                Cookies.set('access_token', res.access_token, { expires: 7 });
                Cookies.set('refresh_token', res.refresh_token, { expires: 365 });

                if (role === 0) {
                    router.push('/student');
                } else if (role === 1) {
                    router.push('/lecturer');
                }
            },
            onError: (error: any) => {
                toast.error(error.response.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
        });
    };
    return (
        <div className="w-full max-w-md space-y-8 px-4 rounded-lg p-6">
            <div className="text-center flex items-center flex-col space-y-2">
                <Image src="/images/utehy-logo.png" alt="utehy logo" width={80} height={80} />
                <p className="text-base font-medium tracking-tight text-muted-foreground">
                    Trường Sư Phạm Kỹ Thuật Hưng Yên
                </p>
                <p className="text-lg mt-2 text-muted-foreground">Hệ thống hỗ trợ học tập và thi trực tuyến</p>
            </div>
            <form className="mt-8 space-y-6">
                <input
                    id="email"
                    name="username"
                    onChange={handleOnChangeInput}
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={formData.role === 0 ? 'Mã sinh viên' : 'Mã giảng viên'}
                />

                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleOnChangeInput}
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Mật khẩu"
                />

                <div className="bg-background rounded-md">
                    <Select
                        defaultValue="0"
                        onValueChange={(value: string) => setFormData({ ...formData, role: parseInt(value) })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sinh viên" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            <SelectItem value="0">Sinh viên</SelectItem>
                            <SelectItem value="1">Giảng viên</SelectItem>
                            <SelectItem value="999">Quản trị viên</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="button" className="w-full" onClick={handleLogin}>
                    Đăng nhập
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                    Quên mật khẩu ?
                    <Link href="/forget-password" className="text-primary hover:underline ml-2">
                        Lấy lại mật khẩu mới
                    </Link>
                </p>
            </form>
        </div>
    );
}
