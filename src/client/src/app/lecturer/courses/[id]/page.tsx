'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FacultySelect from '@/components/FacultySelect';
import MajorSelect from '@/components/MajorSelect';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { Bounce, toast } from 'react-toastify';
import Spinner from '@/components/spinner';
import { uploadService } from '@/services/uploadService';
import { ImageUpload } from '@/components/image-upload';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { CourseStatus } from '@/types/const';
import { ICourse, IResponse } from '@/types';
import { redirect } from 'next/navigation';

interface CoursePayLoad {
    title: string;
    description: string;
    facultyId: string;
    thumbnail?: string;
    majorId: string;
    status: string;
}

const courseSchema = z.object({
    title: z.string().min(1, {
        message: 'Tiêu đề không để trống',
    }),
    description: z.string().min(1, {
        message: 'Mô tả không để trống',
    }),
    thumbnail: z.string().optional(),
    facultyId: z.string().min(1, {
        message: 'Khoa không để trống',
    }),
    majorId: z.string().min(1, {
        message: 'Chuyên ngành không để trống',
    }),
    status: z.string().min(1, {
        message: 'Trạng thái không để trống',
    }),
});

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);

    const [facultySelected, setFacultySelected] = useState<string>('');
    const [courseData, setCourseData] = useState<CoursePayLoad>();
    const [newImage, setNewImage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CoursePayLoad>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: '',
            description: '',
            facultyId: '',
            thumbnail: '',
            majorId: '',
            status: CourseStatus[0].value,
        },
    });

    const { data: response, isSuccess } = useQuery<IResponse<ICourse>>({
        queryKey: ['get-by-id', id],
        queryFn: () => courseService.getById(id),
        enabled: !!id && id !== 'new',
    });

    useEffect(() => {
        if (isSuccess) {
            const data = response?.data;
            reset({
                title: data?.title,
                description: data?.description,
                facultyId: data?.facultyId,
                majorId: data?.majorId,
                thumbnail: data?.thumbNail,
                status: data?.status,
            });
            setFacultySelected(data?.facultyId ? data?.facultyId : 'all');
        }
    }, [isSuccess]);

    const handleChangeImage = async (file: File | null) => {
        setNewImage(null);
        if (!file) {
            toast.error('Vui lòng chọn hình ảnh', {
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
            return;
        }

        if (file) {
            let url = await uploadService.uploadImage(file);
            if (url) {
                setNewImage(url);
                reset({
                    ...courseData,
                    thumbnail: url,
                });
            }
        }
    };

    const createCourse = useMutation({
        mutationFn: (data: CoursePayLoad) => courseService.create(data),
        onSuccess: (res: IResponse<ICourse>) => {
            if (res.ok) {
                toast.success(`Thêm khóa học thành công ${res.data?.title}`, {
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
                // redirect('/lecturer/courses');
            }
        },
        onError: () => {
            toast.error(`Thêm khóa học thất bại`, {
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
        },
    });

    const updateCourse = useMutation({
        mutationFn: (data: CoursePayLoad) => courseService.update(id, data),
        onSuccess: (res) => {
            toast.success(`Cập nhật khóa học thành công`, {
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
        },
        onError: () => {
            toast.error(`Cập nhật khóa học thất bại`, {
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
        },
    });

    const onFormSubmit = (formData: CoursePayLoad) => {
        if (id === 'new') {
            createCourse.mutate(formData);
        } else {
            updateCourse.mutate(formData);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/lecturer/courses">
                    <Button variant="ghost">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{id === 'new' ? 'Thêm khóa học mới' : 'Chỉnh sửa khóa học'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tên khóa học</Label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Nhập tiêu đề" className={errors.title ? 'border-red-500' : ''} />}
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả ngắn</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea {...field} className={errors.description ? 'border-red-500' : ''} placeholder="Nhập mô tả ngắn về khóa học" />
                                )}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message as string}</p>}
                        </div>

                        <div>
                            <ImageUpload onChange={handleChangeImage} value={newImage || undefined} label="Hình ảnh khóa học" className="mb-4" />
                        </div>

                        <div className="flex justify-between flex-wrap">
                            <div className="space-y-2">
                                <Label htmlFor="description">Khoa</Label>
                                <Controller
                                    name="facultyId"
                                    control={control}
                                    render={({ field }) => (
                                        <FacultySelect
                                            value={field.value}
                                            onSelectValue={(value) => {
                                                field.onChange(value);
                                                setFacultySelected(value);
                                            }}
                                        />
                                    )}
                                />
                                {errors.facultyId && <p className="text-red-500 text-sm">{errors.facultyId.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Ngành</Label>
                                <Controller
                                    name="majorId"
                                    control={control}
                                    render={({ field }) => (
                                        <MajorSelect
                                            value={field.value}
                                            onSelectValue={field.onChange}
                                            facultyId={facultySelected ? facultySelected : undefined}
                                        />
                                    )}
                                />
                                {errors.majorId && <p className="text-red-500 text-sm">{errors.majorId.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Trạng thái</Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn chuyên ngành" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CourseStatus.map((status, idx) => (
                                                    <SelectItem key={idx} value={status.value}>
                                                        {status.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.majorId && <p className="text-red-500 text-sm">{errors.majorId.message as string}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/lecturer/courses">
                                <Button variant="outline" type="button">
                                    Hủy
                                </Button>
                            </Link>
                            <Button type="submit" disabled={createCourse.isPending || updateCourse.isPending}>
                                {createCourse.isPending || updateCourse.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner size="sm" />
                                        Loading....
                                    </div>
                                ) : id === 'new' ? (
                                    'Thêm khóa học'
                                ) : (
                                    'Cập nhật'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
