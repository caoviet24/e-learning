'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IMajor, IResponse, IFaculty, IResponseList } from '@/types';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { majorService } from '@/services/majorService';
import { Bounce, toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { SearchIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setCreateMajor, setDeleteSoftMajor, setUpdateMajor, setRestoreMajor, setDeleteMajor } from '@/redux/slices/major.slice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { facultyService } from '@/services/facultyService';
import useDebounce from '@/hooks/useDebounce';
import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';
import FacultySelect from '../../../components/FacultySelect';
import { Action } from '@/types/enum';

interface MajorDialogProps {
    open: boolean;
    major?: IMajor;
    mode: 'create' | 'edit' | 'delete' | 'delete-soft' | 'restore';
    onClose: () => void;
    onSuccess: () => void;
}

interface MajorPayLoad {
    id?: string;
    name: string;
    code: string;
    facultyId: string;
}

const MODE_OPTIONS = {
    create: {
        title: 'Thêm ngành',
    },
    edit: {
        title: 'Chỉnh sửa ngành',
    },
    delete: {
        title: 'Xóa ngành',
    },
    'delete-soft': {
        title: 'Xóa tạm thời ngành',
    },
    restore: {
        title: 'Khôi phục ngành',
    },
};

const majorSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Tên ngành không được để trống' }),
    code: z.string().min(1, { message: 'Mã ngành không được để trống' }),
    facultyId: z.string().min(1, { message: 'Khoa không được để trống' }),
});

export default function MajorDiaLog({ open, major, mode, onClose, onSuccess }: MajorDialogProps) {
    console.log('major', major);
    
    const dispatch = useAppDispatch();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MajorPayLoad>({
        resolver: zodResolver(majorSchema),
        defaultValues: {
            id: major?.id || '',
            name: major?.name || '',
            code: major?.code || '',
            facultyId: major?.faculty?.id || '',
        },
    });

    const createMajor = useMutation<IResponse<IMajor>, Error, { name: string; code: string; facultyId: string }>({
        mutationFn: (data) => majorService.create(data),
        onSuccess: (res) => {
            if (res.data) {
                dispatch(setCreateMajor(res.data));
                toast.success(`Thêm ngành ${res.data?.name} thành công`, {
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
            toast.error('Thêm ngành thất bại');
        },
    });

    const updateMajor = useMutation({
        mutationFn: (data: any) => {
            if (data.restore) {
                return majorService.restore(data.id);
            }
            return majorService.update(data.id, {
                id: data.id,
                name: data.name,
                code: data.code,
                facultyId: data.facultyId,
            });
        },
        onSuccess: (res: IResponse<IMajor>) => {
            if (res.ok) {
                if (res.action === Action.RESTORE) {
                    dispatch(setRestoreMajor(res.data));
                } else {
                    dispatch(setUpdateMajor(res.data));
                }
                toast.success(`${res.action === Action.RESTORE ? 'Khôi phục' : 'Cập nhật'} ngành ${res.data?.name} thành công`, {
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
            toast.error('Cập nhật ngành thất bại');
        },
    });

    const deleteMajor = useMutation({
        mutationFn: (data: any) => {
            if (data?.delete) {
                return majorService.delete(data.id);
            }
            return majorService.deleteSoft(data.id);
        },
        onSuccess: (res: IResponse<IMajor>) => {
            if (res.ok) {
                if (res.action === Action.DELETE_SOFT) {
                    dispatch(setDeleteSoftMajor(res.data));
                } else {
                    dispatch(setDeleteMajor(res.data));
                }

                toast.success(`${res.action === Action.DELETE_SOFT ? 'Xóa mềm' : 'Xóa vĩnh viễn'} chuyên ngành ${res.data?.name} thành công`, {
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
            toast.error('Xóa ngành thất bại');
            console.error('Xóa ngành thất bại:', error);
        },
    });

    const onFormSubmit = (data: MajorPayLoad) => {
        mode == 'create' && createMajor.mutate(data);
        mode === 'edit' && updateMajor.mutate({ ...data, id: major?.id });
        mode === 'delete' && deleteMajor.mutate({ ...data, id: major?.id, delete: true });
        mode === 'delete-soft' && deleteMajor.mutate({ ...data, id: major?.id });
        mode === 'restore' && updateMajor.mutate({ ...data, id: major?.id, restore: true });
    };

    const isSubmitting = createMajor.isPending || updateMajor.isPending || deleteMajor.isPending;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-4">
                <DialogHeader>
                    <DialogTitle>{MODE_OPTIONS[mode].title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label>Tên ngành</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập tên ngành"
                                    className={errors.name ? 'border-red-500' : ''}
                                    disabled={mode === 'delete' || mode === 'restore'}
                                />
                            )}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <label>Mã code ngành</label>
                        <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập mã ngành"
                                    className={errors.code ? 'border-red-500' : ''}
                                    disabled={mode === 'delete' || mode === 'restore'}
                                />
                            )}
                        />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <label>Khoa</label>
                        <Controller
                            name="facultyId"
                            control={control}
                            render={({ field }) => <FacultySelect value={field.value} onSelectValue={field.onChange} />}
                        />
                        {errors.facultyId && <p className="text-red-500 text-sm">{errors.facultyId.message as string}</p>}
                    </div>
                    <Button type="submit" className="w-full hover:opacity-50" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
