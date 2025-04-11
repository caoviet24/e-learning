'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ILecturer, IResponse } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { lecturerService } from '@/services/lecturerService';
import { Bounce, toast } from 'react-toastify';
import * as z from 'zod';
import FacultySelect from '../../../components/FacultySelect';
import MajorSelect from '../../../components/MajorSelect';
import { useAppDispatch } from '@/redux/store';
import { setCreateLecturer, setDeleteSoftLecturer, setRestoreLecturer, setUpdateLecturer } from '@/redux/slices/lecturer.slice';
import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';

interface ILecturerDiaLogProps {
    open: boolean;
    lecturer?: ILecturer;
    mode: 'create' | 'update' | 'delete-soft' | 'delete' | 'view' | 'restore';
    onClose: () => void;
    onSuccess?: () => void;
}

interface LecturerPayLoad {
    username: string;
    password?: string;
    full_name: string;
    gender?: string;
    email?: string;
    phone_number?: string;
    original_address?: string;
    current_address?: string;
    faculty_id: string;
    major_id: string;
    role: string;
    lecturer_id?: string;
}

const MODE_OPTIONS = {
    create: {
        title: 'Thêm giảng viên',
    },
    update: {
        title: 'Cập nhật giảng viên',
    },
    delete: {
        title: 'Xóa giảng viên',
    },
    'delete-soft': {
        title: 'Xóa tạm thời giảng viên',
    },
    view: {
        title: 'Xem giảng viên',
    },
    restore: {
        title: 'Khôi phục giảng viên',
    },
};

const GENDER_OPTIONS = [
    { value: '0', label: 'Nam' },
    { value: '1', label: 'Nữ' },
    { value: '2', label: 'Khác' },
];

const getLecturerSchema = (mode: string) => {
    const baseSchema = {
        full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
        gender: z.string().optional(),
        email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
        phone_number: z.string().optional(),
        original_address: z.string().optional(),
        current_address: z.string().optional(),
        faculty_id: z.string().min(1, 'Vui lòng chọn khoa'),
        major_id: z.string().min(1, 'Vui lòng chọn ngành'),
        role: z.string().optional().default('LECTURER'),
    };

    if (mode === 'create') {
        return z.object({
            username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
            password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
            ...baseSchema,
        });
    }

    return z.object({
        username: z.string().optional(),
        password: z.string().optional(),
        ...baseSchema,
    });
};

export default function LecturerDiaLog({ open, lecturer, mode, onClose, onSuccess }: ILecturerDiaLogProps) {
    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(getLecturerSchema(mode)),
        defaultValues: {
            username: '',
            password: '',
            full_name: lecturer?.user?.full_name || '',
            gender: lecturer?.user?.gender?.toString() || '',
            email: lecturer?.user?.email || '',
            phone_number: lecturer?.user?.phone_number || '',
            original_address: lecturer?.user?.original_address || '',
            current_address: lecturer?.user?.current_address || '',
            faculty_id: lecturer?.major?.faculty?.id || '',
            major_id: lecturer?.major?.id || '',
            role: 'LECTURER',
        } as LecturerPayLoad,
    });

    const selectedFacultyId = watch('faculty_id');

    const createLecturer = useMutation({
        mutationFn: (data: any) => lecturerService.create(data),
        onSuccess: (res) => {
            dispatch(setCreateLecturer(res.data));
            toast.success(`Thêm giảng viên ${res.data?.user?.full_name} thành công`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            onClose();
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            toast.error(`Thêm giảng viên thất bại`);
        },
    });

    const updateLecturer = useMutation({
        mutationFn: (data: any) => {
            if (data.restore === true) {
                return lecturerService.restore(data.id);
            }
            return lecturerService.update(data.id, data);
        },
        onSuccess: (res: IResponse<ILecturer>) => {
            if (res.message.startsWith('Khôi phục')) {
                dispatch(setRestoreLecturer(res.data));
            } else {
                dispatch(setUpdateLecturer(res.data));
            }

            toast.success(`${res.message.startsWith('Khôi phục') ? 'Khôi phục' : 'Cập nhật'} giảng viên ${res?.data?.user?.full_name} thành công`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            onClose();
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            toast.error(`Cập nhật giảng viên thất bại`);
        },
    });

    const deleteLecturer = useMutation({
        mutationFn: (data: any) => {
            if (data.delete) {
                return lecturerService.delete(data.id);
            }
            return lecturerService.deleteSoft(data.id);
        },
        onSuccess: (res: IResponse<ILecturer>) => {
            if (res.message.startsWith('Xóa tạm thời')) {
                dispatch(setDeleteSoftLecturer(res.data));
            } else {
                dispatch(setRestoreLecturer(res.data));
            }
            toast.success(`Xóa giảng viên ${res.data?.user.full_name || ''} thành công`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            onClose();
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            toast.error(`Xóa giảng viên thất bại`);
        },
    });

    const onFormSubmit = (data: any) => {
        const formData = {
            ...data,
            gender: data.gender ? Number(data.gender) : undefined,
        };

        if (mode === 'create') {
            createLecturer.mutate(formData);
        } else if (mode === 'update' && lecturer) {
            const { role, username, password, ...rest } = formData;
            updateLecturer.mutate({
                id: lecturer.id,
                ...rest,
            });
        } else if (mode === 'delete-soft' && lecturer) {
            deleteLecturer.mutate({
                id: lecturer.id,
            });
        } else if (mode === 'delete' && lecturer) {
            deleteLecturer.mutate({
                id: lecturer.id,
                delete: false,
            });
        } else if (mode === 'restore' && lecturer) {
            updateLecturer.mutate({
                id: lecturer.id,
                restore: true,
            });
        }
    };

    const isSubmitting = createLecturer.isPending || updateLecturer.isPending || deleteLecturer.isPending;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-4 max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{MODE_OPTIONS[mode].title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                        <RenderWithCondition condition={mode === 'create'}>
                            <div className="space-y-2">
                                <label>
                                    Tên đăng nhập <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Nhập tên đăng nhập"
                                            disabled={mode === 'view'}
                                            className={errors.username ? 'border-red-500' : ''}
                                        />
                                    )}
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <label>
                                    Mật khẩu {mode === 'update' && '(để trống nếu không thay đổi)'}{' '}
                                    {mode === 'create' && <span className="text-red-500">*</span>}
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="password"
                                            {...field}
                                            placeholder="Nhập mật khẩu"
                                            disabled={mode === 'view'}
                                            className={errors.password ? 'border-red-500' : ''}
                                        />
                                    )}
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
                            </div>
                        </RenderWithCondition>
                        <div className="space-y-2">
                            <label>
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="full_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập họ tên"
                                        disabled={mode === 'view'}
                                        className={errors.full_name ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>Giới tính</label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select disabled={mode === 'view'} onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn giới tính" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GENDER_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>Email</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        {...field}
                                        placeholder="Nhập email"
                                        disabled={mode === 'view'}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>Số điện thoại</label>
                            <Controller
                                name="phone_number"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="tel"
                                        {...field}
                                        placeholder="Nhập số điện thoại"
                                        disabled={mode === 'view'}
                                        className={errors.phone_number ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>
                                Khoa <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="faculty_id"
                                control={control}
                                render={({ field }) => <FacultySelect value={field.value} onSelectValue={field.onChange} />}
                            />
                            {errors.faculty_id && <p className="text-red-500 text-sm">{errors.faculty_id.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>
                                Ngành <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="major_id"
                                control={control}
                                render={({ field }) => <MajorSelect value={field.value} onSelectValue={field.onChange} facultyId={selectedFacultyId} />}
                            />
                            {errors.major_id && <p className="text-red-500 text-sm">{errors.major_id.message as string}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label>Mã giảng vien viên</label>
                            <Input value={lecturer && lecturer.lecturer_id} placeholder="Mã giáo viên" disabled={true} />
                        </div>
                        <div className="space-y-2">
                            <label>Địa chỉ hiện tại</label>
                            <Controller
                                name="current_address"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập địa chỉ hiện tại"
                                        disabled={mode === 'view'}
                                        className={errors.current_address ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.current_address && <p className="text-red-500 text-sm">{errors.current_address.message as string}</p>}
                        </div>
                    </div>

                    <Button type="submit" className={`w-full`} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
