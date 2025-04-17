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
import { Role } from '@/types/enum';
import { InputCalendar } from '@/components/input-calender';

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
    role: string;
    fullName: string;
    gender?: string;
    email?: string;
    phone?: string;
    position?: string;
    status?: string;
    joinedAt?: string;
    currentAddress?: string;
    facultyId: string;
    majorId: string;
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

const LecturerStatusOptions = [
    { value: 'WORKING', label: 'Đang làm việc' },
    { value: 'TEMPORARILYABSENT', label: 'Nghỉ tạm thời' },
    { value: 'RESIGNED', label: 'Đã nghỉ việc' },
];

const POSITION_OPTIONS = [
    { value: 'INTERN', label: 'Thực tập' },
    { value: 'LECTURER', label: 'Giảng viên' },
    { value: 'SENIOR_LECTURER', label: 'Thạc sĩ' },
    { value: 'ASSOCIATE_DOCTOR', label: 'Phó tiến sĩ' },
    { value: 'DOCTOR', label: 'Tiến sĩ' },
    { value: 'ASSISTANT_PROFESSOR', label: 'Phó giáo sư' },
    { value: 'PROFESSOR', label: 'Giáo sư' },
];

const getLecturerSchema = (mode: string) => {
    const baseSchema = {
        fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
        gender: z.string().optional(),
        email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
        phone: z.string().optional(),
        currentAddress: z.string().optional(),
        status: z.string().optional(),
        position: z.string().optional(),
        joinedAt: z.string().optional(),
        facultyId: z.string().min(1, 'Vui lòng chọn khoa'),
        majorId: z.string().min(1, 'Vui lòng chọn ngành'),
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
            role: Role.LECTURER,
            fullName: lecturer?.user?.fullName || '',
            gender: lecturer?.user?.gender?.toString() || '',
            email: lecturer?.user?.email || '',
            phone: lecturer?.user?.phone || '',
            status: lecturer?.status || '',
            position: lecturer?.position || '',
            joinedAt: lecturer?.joinedAt || '',
            currentAddress: lecturer?.user?.currentAddress || '',
            facultyId: lecturer?.faculty?.id || '',
            majorId: lecturer?.major?.id || '',
        } as LecturerPayLoad,
    });

    const selectedFacultyId = watch('facultyId');

    const createLecturer = useMutation({
        mutationFn: (data: any) => lecturerService.create(data),
        onSuccess: (res) => {
            dispatch(setCreateLecturer(res.data));
            toast.success(`Thêm giảng viên ${res.data?.user?.fullName} thành công`, {
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

            toast.success(`${res.message.startsWith('Khôi phục') ? 'Khôi phục' : 'Cập nhật'} giảng viên ${res?.data?.user?.fullName} thành công`, {
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
            toast.success(`Xóa giảng viên ${res.data?.user.fullName || ''} thành công`, {
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
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập họ tên"
                                        disabled={mode === 'view'}
                                        className={errors.fullName ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName?.message as string}</p>}
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
                            <label>Chức vụ</label>
                            <Controller
                                name="position"
                                control={control}
                                render={({ field }) => (
                                    <Select disabled={mode === 'view'} onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className={errors.position ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn chức vụ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {POSITION_OPTIONS.map((option) => (
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
                            <label>Trạng thái</label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select disabled={mode === 'view'} onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LecturerStatusOptions.map((option) => (
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
                        <div className="space-y-2 flex flex-col">
                            <label>Ngày làm việc</label>
                            <Controller
                                name="joinedAt"
                                control={control}
                                render={({ field }) => (
                                    <InputCalendar
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={(date) => field.onChange(date ? date.toISOString() : undefined)}
                                    />
                                )}
                            />
                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>Mã giảng viên</label>
                            <Input value={lecturer && lecturer.cardId} placeholder="Mã giáo viên" disabled={true} />
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
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="tel"
                                        {...field}
                                        placeholder="Nhập số điện thoại"
                                        disabled={mode === 'view'}
                                        className={errors.phone ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>
                                Khoa <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="facultyId"
                                control={control}
                                render={({ field }) => <FacultySelect value={field.value} onSelectValue={field.onChange} />}
                            />
                            {errors.facultyId && <p className="text-red-500 text-sm">{errors.facultyId.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>
                                Ngành <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="majorId"
                                control={control}
                                render={({ field }) => <MajorSelect value={field.value} onSelectValue={field.onChange} facultyId={selectedFacultyId} />}
                            />
                            {errors.majorId && <p className="text-red-500 text-sm">{errors.majorId.message as string}</p>}
                        </div>
                       
                    </div>

                    {/* <div className="space-y-2">
                            <label>Địa chỉ hiện tại</label>
                            <Controller
                                name="currentAddress"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập địa chỉ hiện tại"
                                        disabled={mode === 'view'}
                                        className={errors.currentAddress ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.currentAddress && <p className="text-red-500 text-sm">{errors.currentAddress.message as string}</p>}
                        </div> */}

                    <Button type="submit" className={`w-full`} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
