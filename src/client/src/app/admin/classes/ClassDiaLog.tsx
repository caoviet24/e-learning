'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IClass, IResponse } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { classService } from '@/services/classService';
import { Bounce, toast } from 'react-toastify';
import * as z from 'zod';
import FacultySelect from '../../../components/FacultySelect';
import MajorSelect from '../../../components/MajorSelect';
import LecturerSelect from '../lecturers/LecturerSelect';
import { useAppDispatch } from '@/redux/store';
import { setCreateClass, setDeleteSoftClass, setRestoreClass, setUpdateClass } from '@/redux/slices/class.slice';
import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';

interface IClassDiaLogProps {
    open: boolean;
    class?: IClass;
    mode: 'create' | 'update' | 'delete-soft' | 'delete' | 'view' | 'restore';
    onClose: () => void;
    onSuccess?: () => void;
}

interface ClassPayLoad {
    name: string;
    class_code: string;
    faculty_id: string;
    major_id: string;
    lecturer_id?: string;
}

const MODE_OPTIONS = {
    create: {
        title: 'Thêm lớp học',
    },
    update: {
        title: 'Cập nhật lớp học',
    },
    delete: {
        title: 'Xóa lớp học',
    },
    'delete-soft': {
        title: 'Xóa tạm thời lớp học',
    },
    view: {
        title: 'Xem lớp học',
    },
    restore: {
        title: 'Khôi phục lớp học',
    },
};

const getClassSchema = (mode: string) => {
    return z.object({
        name: z.string().min(2, 'Tên lớp phải có ít nhất 2 ký tự'),
        class_code: z.string().min(2, 'Mã lớp phải có ít nhất 2 ký tự'),
        faculty_id: z.string().min(1, 'Vui lòng chọn khoa'),
        major_id: z.string().min(1, 'Vui lòng chọn ngành'),
        lecturer_id: z.string().optional(),
    });
};

export default function ClassDiaLog({ open, class: classData, mode, onClose, onSuccess }: IClassDiaLogProps) {
    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(getClassSchema(mode)),
        defaultValues: {
            name: classData?.name || '',
            class_code: classData?.class_code || '',
            faculty_id: classData?.major?.faculty?.id || '',
            major_id: classData?.major?.id || '',
            lecturer_id: classData?.lecturer?.id || '',
        } as ClassPayLoad,
    });

    const selectedFacultyId = watch('faculty_id');
    const isReadOnly = mode === 'view' || mode === 'delete-soft' || mode === 'delete' || mode === 'restore';

    const createClass = useMutation({
        mutationFn: (data: any) => classService.create(data),
        onSuccess: (res) => {
            dispatch(setCreateClass(res.data));
            toast.success(`Thêm lớp học ${res.data?.name} thành công`, {
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
            toast.error(`Thêm lớp học thất bại`);
            console.error('Thêm lớp học thất bại:', error.message);
        },
    });

    const updateClass = useMutation({
        mutationFn: (data: any) => {
            if (data.restore === true) {
                return classService.restore(data.id);
            }
            return classService.update(data.id, data);
        },
        onSuccess: (res: IResponse<IClass>) => {
            if (res.message.startsWith('Khôi phục')) {
                dispatch(setRestoreClass(res.data));
            } else {
                dispatch(setUpdateClass(res.data));
            }

            toast.success(`${res.message.startsWith('Khôi phục') ? 'Khôi phục' : 'Cập nhật'} lớp học ${res?.data?.name} thành công`, {
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
            toast.error(`Cập nhật lớp học thất bại`);
            console.error('Cập nhật lớp học thất bại:', error.message);
        },
    });

    const deleteClass = useMutation({
        mutationFn: (data: any) => {
            if (data.delete) {
                return classService.delete(data.id);
            }
            return classService.deleteSoft(data.id);
        },
        onSuccess: (res: IResponse<IClass>) => {
            if (res.message.startsWith('Xóa tạm thời')) {
                dispatch(setDeleteSoftClass(res.data));
            } else {
                dispatch(setRestoreClass(res.data));
            }
            toast.success(`Xóa lớp học ${res.data?.name || ''} thành công`, {
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
            toast.error(`Xóa lớp học thất bại`);
            console.error('Xóa lớp học thất bại:', error.message);
        },
    });

    const onFormSubmit = (data: any) => {
        if (mode === 'create') {
            createClass.mutate(data);
        } else if (mode === 'update' && classData) {
            updateClass.mutate({
                id: classData.id,
                ...data,
            });
        } else if (mode === 'delete-soft' && classData) {
            deleteClass.mutate({
                id: classData.id,
            });
        } else if (mode === 'delete' && classData) {
            deleteClass.mutate({
                id: classData.id,
                delete: true,
            });
        } else if (mode === 'restore' && classData) {
            updateClass.mutate({
                id: classData.id,
                restore: true,
            });
        }
    };

    const isSubmitting = createClass.isPending || updateClass.isPending || deleteClass.isPending;

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
                                Tên lớp <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập tên lớp"
                                        disabled={isReadOnly}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>
                                Mã lớp <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="class_code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập mã lớp"
                                        disabled={isReadOnly}
                                        className={errors.class_code ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.class_code && <p className="text-red-500 text-sm">{errors.class_code.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>
                                Khoa <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="faculty_id"
                                control={control}
                                render={({ field }) => (
                                    <FacultySelect 
                                        value={field.value || ''} 
                                        onSelectValue={field.onChange}
                                    />
                                )}
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
                                render={({ field }) => (
                                    <MajorSelect 
                                        value={field.value || ''} 
                                        onSelectValue={field.onChange} 
                                        facultyId={selectedFacultyId}
                                    />
                                )}
                            />
                            {errors.major_id && <p className="text-red-500 text-sm">{errors.major_id.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label>Giảng viên phụ trách</label>
                            <Controller
                                name="lecturer_id"
                                control={control}
                                render={({ field }) => (
                                    <LecturerSelect 
                                        value={field.value || ''} 
                                        onSelectValue={field.onChange} 
                                        facultyId={selectedFacultyId}
                                        disabled={isReadOnly} 
                                    />
                                )}
                            />
                            {errors.lecturer_id && <p className="text-red-500 text-sm">{errors.lecturer_id.message as string}</p>}
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