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

interface CoursePayLoad {
    title: string;
    description: string;
    faculty_id: string;
    thumbnail?: string;
    major_id: string;
}

const courseSchema = z.object({
    title: z.string().min(1, {
        message: 'Tiêu đề không để trống',
    }),
    description: z.string().min(1, {
        message: 'Mô tả không để trống',
    }),
    thumbnail: z.string().optional(),
    faculty_id: z.string().min(1, {
        message: 'Khoa không để trống',
    }),
    major_id: z.string().min(1, {
        message: 'Chuyên ngành không để trống',
    }),
});

export default function CoursePage({ params }: { params: { id: string } }) {
    const { id } = params;

    const [facultySelected, setFacultySelected] = useState<string>('');
    const [courseData, setCourseData] = useState<CoursePayLoad>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
            faculty_id: '',
            thumbnail: '',
            major_id: '',
        },
    });

    const { data: response, isSuccess } = useQuery({
        queryKey: ['get-by-id', id],
        queryFn: () => courseService.getById(id),
        enabled: !!id && id !== 'new',
    });

    useEffect(() => {
        if (isSuccess && response?.data) {
            // API returns an array, take first item
            const courseItem = Array.isArray(response.data) ? response.data[0] : response.data;
            
            // Transform data to match the form structure
            const transformedData = {
                title: courseItem.title,
                description: courseItem.description,
                faculty_id: courseItem.faculty?.id || '',
                major_id: courseItem.major?.id || '',
                thumbnail: courseItem.thumbnail || ''
            };
            
            setCourseData(transformedData);
            
            // Set faculty selected for the major dropdown
            if (courseItem.faculty?.id) {
                setFacultySelected(courseItem.faculty.id);
            }
            
            // Reset form with new values
            reset(transformedData);
        }
    }, [isSuccess, response, reset]);

    const handleChangeImage = async (file: File | null) => {
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            let url = await uploadService.uploadImage(file);
            if (url) {
                setNewImage(url);
                setImagePreview(null);
                reset({
                    ...courseData,
                    thumbnail: url,
                });
            }
        }
    };

    const createCourse = useMutation({
        mutationFn: (data: CoursePayLoad) => courseService.create(data),
        onSuccess: (res) => {
            const { data } = res;
            toast.success(`Thêm khóa học thành công ${data?.title}`, {
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
                            <ImageUpload
                                onChange={handleChangeImage}
                                value={newImage || undefined}
                                initialPreview={imagePreview || undefined}
                                label="Hình ảnh khóa học"
                                className="mb-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Khoa</Label>
                            <Controller
                                name="faculty_id"
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
                            {errors.faculty_id && <p className="text-red-500 text-sm">{errors.faculty_id.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Ngành</Label>
                            <Controller
                                name="major_id"
                                control={control}
                                render={({ field }) => (
                                    <MajorSelect value={field.value} onSelectValue={field.onChange} facultyId={facultySelected ? facultySelected : undefined} />
                                )}
                            />
                            {errors.major_id && <p className="text-red-500 text-sm">{errors.major_id.message as string}</p>}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/lecturer/courses">
                                <Button variant="outline" type="button">
                                    Hủy
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={createCourse.isPending || updateCourse.isPending}
                            >
                                {createCourse.isPending || updateCourse.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner size={16} />
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
