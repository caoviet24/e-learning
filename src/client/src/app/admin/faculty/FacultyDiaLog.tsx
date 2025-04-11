'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IFaculty, IResponse } from '@/types';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { facultyService } from '@/services/facultyService';
import { Bounce, toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/store';
import { setCreateFaculty, setUpdateFaculty, setDeleteSoftFaculty, setRestoreFaculty } from '@/redux/slices/faculty.slice';

interface FacultyDialogProps {
    open: boolean;
    faculty?: IFaculty;
    mode: 'create' | 'edit' | 'delete' | 'delete-soft' | 'restore';
    onClose: () => void;
    onSuccess: () => void;
}

interface FacultyPayLoad {
    name: string;
    code: string;
}

const MODE_OPTIONS = {
    create: {
        title: 'Thêm khoa',
    },
    edit: {
        title: 'Chỉnh sửa khoa',
    },
    delete: {
        title: 'Xóa khoa',
    },
    'delete-soft': {
        title: 'Xóa tạm thời khoa',
    },
    restore: {
        title: 'Khôi phục khoa',
    },
};

const facultySchema = z.object({
    name: z.string().min(1, { message: 'Tên khoa không được để trống' }),
    code: z.string().min(1, { message: 'Mã khoa không được để trống' }),
});

export default function FacultyDiaLog({ open, faculty, mode, onClose, onSuccess }: FacultyDialogProps) {
    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FacultyPayLoad>({
        resolver: zodResolver(facultySchema),
        defaultValues: {
            name: faculty?.name || '',
            code: faculty?.code || '',
        },
    });

    const createFaculty = useMutation<IResponse<IFaculty>, Error, { name: string; code: string }>({
        mutationFn: (data) => facultyService.create(data),
        onSuccess: (res) => {
            if (res.data) {
                dispatch(setCreateFaculty(res.data));
                toast.success(`Thêm khoa ${res.data?.name} thành công`, {
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
            }
            reset();
            onSuccess();
            onClose();
        },
        onError: (error) => {
            toast.error('Thêm khoa thất bại');
        },
    });

    const updateFaculty = useMutation({
        mutationFn: (data: any) => {
            if (data.restore) {
                return facultyService.restore(data.id);
            }
            return facultyService.update(data.id, {
                name: data.name,
                code: data.code,
            });
        },
        onSuccess: (res: IResponse<IFaculty>) => {
            if (res.data) {
                if (res.success && res.message.includes('Khôi phục')) {
                    dispatch(setRestoreFaculty(res.data));
                } else {
                    dispatch(setUpdateFaculty(res.data));
                }
                toast.success(`${!res?.data?.is_deleted ? 'Khôi phục' : 'Cập nhật'} khoa ${res.data?.name} thành công`, {
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
            }
            reset();
            onSuccess();
            onClose();
        },
        onError: (error) => {
            toast.error('Cập nhật khoa thất bại');

        },
    });

    const deleteFaculty = useMutation({
        mutationFn: (data: any) => {
            if (data?.delete) {
                return facultyService.delete(data.id);
            }
            return facultyService.deleteSoft(data.id);
        },
        onSuccess: (res: IResponse<IFaculty>) => {
            if (res.data) {
                if (res.data?.is_deleted) {
                    dispatch(setDeleteSoftFaculty(res.data));
                }

                toast.success(`Xóa khoa ${res.data?.name} thành công`, {
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
            }
            reset();
            onSuccess();
            onClose();
        },
        onError: (error) => {
            toast.error('Xóa khoa thất bại');
        },
    });

    const onFormSubmit = (data: FacultyPayLoad) => {
        mode == 'create' && createFaculty.mutate(data);
        mode === 'edit' && updateFaculty.mutate({ ...data, id: faculty?.id });
        mode === 'delete' && deleteFaculty.mutate({ ...data, id: faculty?.id, delete: true });
        mode === 'delete-soft' && deleteFaculty.mutate({ ...data, id: faculty?.id });
        mode === 'restore' && updateFaculty.mutate({ ...data, id: faculty?.id, restore: true });
    };

    const isSubmitting = createFaculty.isPending || updateFaculty.isPending || deleteFaculty.isPending;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-4">
                <DialogHeader>
                    <DialogTitle>{MODE_OPTIONS[mode].title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label>Tên khoa</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập tên khoa"
                                    className={errors.name ? 'border-red-500' : ''}
                                    disabled={mode === 'delete' || mode === 'restore'}
                                />
                            )}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <label>Mã code khoa</label>
                        <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập mã khoa"
                                    className={errors.code ? 'border-red-500' : ''}
                                    disabled={mode === 'delete' || mode === 'restore'}
                                />
                            )}
                        />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code.message as string}</p>}
                    </div>
                    <Button type="submit" className="w-full hover:opacity-50" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
