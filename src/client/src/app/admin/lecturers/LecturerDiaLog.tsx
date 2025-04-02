'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IFaculty, ILecturer, IMajor } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { lecturerService } from '@/services/lecturerService';
import { Bounce, toast } from 'react-toastify';
import * as z from 'zod';
import { facultyService } from '@/services/facultyService';
import { majorService } from '@/services/majorService';
import FacultySelect from '../faculty/FacultySelect';
import MajorSelect from '../majors/MajorSelect';

interface ILecturerDiaLogProps {
    open: boolean;
    lecturer?: ILecturer;
    mode: 'create' | 'update' | 'delete' | 'view' | 'restore';
    onClose: () => void;
    onSuccess?: () => void;
}

interface LecturerPayLoad {
    username: string;
    password: string;
    full_name: string;
    gender: string;
    email: string;
    phone_number: string;
    original_address: string;
    current_address: string;
    faculty_id: string;
    major_id: string;
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

const lecturerSchema = z.object({
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').optional(),

    full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    gender: z.string().optional(),
    email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
    phone_number: z.string().optional(),
    original_address: z.string().optional(),
    current_address: z.string().optional(),

    faculty_id: z.string().min(1, 'Vui lòng chọn khoa'),
    major_id: z.string().min(1, 'Vui lòng chọn ngành'),
});

export default function LecturerDiaLog({ open, lecturer, mode, onClose, onSuccess }: ILecturerDiaLogProps) {
    const [faculties, setFaculties] = React.useState<IFaculty[]>([]);
    const [majors, setMajors] = React.useState<IMajor[]>([]);
    const [filteredMajors, setFilteredMajors] = React.useState<IMajor[]>([]);
    const [isFetchingFaculties, setIsFetchingFaculties] = React.useState(false);
    const [isFetchingMajors, setIsFetchingMajors] = React.useState(false);
    const [hasMoreFaculties, setHasMoreFaculties] = React.useState(true);
    const [hasMoreMajors, setHasMoreMajors] = React.useState(true);
    const [facultyPage, setFacultyPage] = React.useState(1);
    const [majorPage, setMajorPage] = React.useState(1);
    const facultyPageSize = 10;
    const majorPageSize = 10;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(lecturerSchema),
        defaultValues: {
            username: '',
            password: '',
            full_name: '',
            gender: '',
            email: '',
            phone_number: '',
            original_address: '',
            current_address: '',
            faculty_id: '',
            major_id: '',
        } as LecturerPayLoad,
    });

    const selectedFacultyId = watch('faculty_id');

    const createLecturer = useMutation({
        mutationFn: (data: any) => lecturerService.create(data),
        onSuccess: (res) => {
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
            toast.error(`Thêm giảng viên thất bại: ${error.message}`);
            console.error('Thêm giảng viên thất bại:', error);
        },
    });

    const updateLecturer = useMutation({
        mutationFn: (data: any) => {
            if (data.restore === true) {
                return lecturerService.restore(data.id);
            }
            return lecturerService.update(data.id, data);
        },
        onSuccess: (res: any) => {
            toast.success(`${res?.data?.user?.is_deleted ? 'Khôi phục' : 'Cập nhật'} giảng viên ${res?.data?.user?.full_name} thành công`, {
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
            toast.error(`Cập nhật giảng viên thất bại: ${error.message}`);
            console.error('Cập nhật giảng viên thất bại:', error);
        },
    });

    const deleteLecturer = useMutation({
        mutationFn: (data: any) => {
            if (data.delete) {
                return lecturerService.delete(data.id);
            }
            return lecturerService.deleteSoft(data.id);
        },
        onSuccess: (res: any) => {
            toast.success(`Xóa giảng viên ${res.data?.full_name || ''} thành công`, {
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
            toast.error(`Xóa giảng viên thất bại: ${error.message}`);
            console.error('Xóa giảng viên thất bại:', error);
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
            updateLecturer.mutate({
                id: lecturer.id,
                ...formData,
                password: formData.password || undefined,
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                Mật khẩu {mode === 'update' && '(để trống nếu không thay đổi)'} {mode === 'create' && <span className="text-red-500">*</span>}
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
                            <label>Địa chỉ gốc</label>
                            <Controller
                                name="original_address"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập địa chỉ gốc"
                                        disabled={mode === 'view'}
                                        className={errors.original_address ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.original_address && <p className="text-red-500 text-sm">{errors.original_address.message as string}</p>}
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

                    <Button
                        type="submit"
                        className={`w-full ${
                            mode === 'delete' ? 'bg-red-500 hover:bg-red-600' : mode === 'restore' ? 'bg-orange-500 hover:bg-orange-600' : ''
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
