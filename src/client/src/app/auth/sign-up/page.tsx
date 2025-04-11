'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Role } from '@/types/enum';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { accountService } from '@/services/accountService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

type FormData = {
    username: string;
    password: string;
    role: Role;
};

const formDataSchema = z.object({
    username: z.string().min(1, { message: 'Tên đăng nhập không được để trống' }),
    password: z.string().min(1, { message: 'Mật khẩu không được để trống' }),
    role: z.nativeEnum(Role),
});

const roles: Record<Role, string> = {
    [Role.STUDENT]: 'Mã sinh viên',
    [Role.LECTURER]: 'Mã giảng viên',
    [Role.ADMIN]: 'Quản trị viên',
};

export default function SignUpPage() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        role: Role.STUDENT,
    });


    const router = useRouter();

    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const registerMutation = useMutation({
        mutationFn: (data: any) => accountService.register(data),
        onSuccess: () => {

            router.push('/auth/sign-in');
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

    const handleRegister = async () => {
        registerMutation.mutate(formData);
    };
    return (
        <div className="w-full max-w-md space-y-8 px-4 rounded-lg p-6">
            <div className="text-center flex items-center flex-col space-y-2">
                <Image src="/images/utehy-logo.png" alt="utehy logo" width={80} height={80} />
                <p className="text-base font-medium tracking-tight text-muted-foreground">Trường Sư Phạm Kỹ Thuật Hưng Yên</p>
                <p className="text-lg mt-2 text-muted-foreground">Hệ thống hỗ trợ học tập và thi trực tuyến</p>
            </div>
            <form className="mt-8 space-y-6">
                <input
                    id="email"
                    name="username"
                    onChange={handleOnChangeInput}
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={roles[formData.role]}
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
                    <Select defaultValue={Role.STUDENT} onValueChange={(value: string) => setFormData({ ...formData, role: value as Role })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sinh viên" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            <SelectItem value={Role.STUDENT}>Sinh viên</SelectItem>
                            <SelectItem value={Role.LECTURER}>Giảng viên</SelectItem>
                            <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative">
                    <Button type="button" disabled={registerMutation.isPending} className={`${registerMutation.isPending && 'opacity-40'} w-full`} onClick={handleRegister}>
                        Đăng ký
                    </Button>
                    {registerMutation.isPending && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Loader2 className="animate-spin" size={30} />
                        </div>
                    )}
                </div>
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
