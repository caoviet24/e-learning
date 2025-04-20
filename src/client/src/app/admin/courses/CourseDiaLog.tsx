'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import FacultySelect from '@/components/FacultySelect';
import MajorSelect from '@/components/MajorSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/image-upload';

interface CourseDiaLogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    option: string;
    title: string;
    courseData: ICourse | null;
    onSuccess: () => void;
}

// Define ICourse interface matching with page.tsx
interface ICourse {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    status: string;
    faculty: {
        id: string;
        name: string;
    };
    major: {
        id: string;
        name: string;
    };
    lecturer?: {
        id: string;
        user: {
            fullName: string;
        }
    };
}

interface FormValues {
    id?: string;
    title: string;
    description: string;
    thumbnail: string;
    facultyId: string;
    majorId: string;
    lecturerId?: string;
    status: string;
}

const STATUS_OPTIONS = [
    { value: 'DRAFT', label: 'Bản nháp' },
    { value: 'PUBLISHED', label: 'Đã xuất bản' },
    { value: 'ARCHIVED', label: 'Đã lưu trữ' },
    { value: 'PENDING', label: 'Chờ duyệt' },
];

export default function CourseDiaLog({ open, onOpenChange, option, title, courseData, onSuccess }: CourseDiaLogProps) {
    const [facultySelected, setFacultySelected] = useState(courseData?.faculty?.id || '');
    const [majorSelected, setMajorSelected] = useState(courseData?.major?.id || '');
    const [imageUrl, setImageUrl] = useState<string>(courseData?.thumbnail || '');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            id: courseData?.id || undefined,
            title: courseData?.title || '',
            description: courseData?.description || '',
            thumbnail: courseData?.thumbnail || '',
            facultyId: courseData?.faculty?.id || '',
            majorId: courseData?.major?.id || '',
            lecturerId: courseData?.lecturer?.id || '',
            status: courseData?.status || 'DRAFT',
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: FormValues) => courseService.create(data),
        onSuccess: () => {
            toast.success('Thêm khóa học thành công', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
            reset();
            onSuccess();
        },
        onError: () => {
            toast.error('Thêm khóa học thất bại', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormValues) => courseService.update(data.id!, data),
        onSuccess: () => {
            toast.success('Cập nhật khóa học thành công', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
            reset();
            onSuccess();
        },
        onError: () => {
            toast.error('Cập nhật khóa học thất bại', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        // Update form data with the selected faculty, major, and image
        data.facultyId = facultySelected;
        data.majorId = majorSelected;
        data.thumbnail = imageUrl;

        if (option === 'create') {
            await createMutation.mutateAsync(data);
        } else if (option === 'update') {
            await updateMutation.mutateAsync(data);
        }
    };

    const onImageUploadSuccess = (url: string) => {
        setImageUrl(url);
        setValue('thumbnail', url);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề khóa học</Label>
                        <Input
                            id="title"
                            {...register('title', {
                                required: 'Vui lòng nhập tiêu đề khóa học',
                            })}
                            placeholder="Nhập tiêu đề"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            {...register('description', {
                                required: 'Vui lòng nhập mô tả',
                            })}
                            placeholder="Nhập mô tả khóa học"
                            rows={4}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Ảnh bìa</Label>
                        <ImageUpload
                            value={imageUrl}
                            onChange={(file) => {
                                if (file) {
                                    // Simulate upload success with a URL
                                    // In a real scenario, you would upload the file and get the URL
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const url = e.target?.result as string;
                                        onImageUploadSuccess(url);
                                    };
                                    reader.readAsDataURL(file);
                                } else {
                                    setImageUrl('');
                                    setValue('thumbnail', '');
                                }
                            }}
                        />
                        {!imageUrl && <p className="text-red-500 text-sm">Vui lòng tải lên ảnh bìa khóa học</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="faculty">Khoa</Label>
                            <FacultySelect
                                value={facultySelected}
                                onSelectValue={(value) => {
                                    setFacultySelected(value);
                                    if (value !== majorSelected.split(':')[0]) {
                                        setMajorSelected('');
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="major">Chuyên ngành</Label>
                            <MajorSelect
                                value={majorSelected}
                                onSelectValue={(value) => {
                                    setMajorSelected(value);
                                }}
                                facultyId={facultySelected === 'all' ? undefined : facultySelected}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                            onValueChange={(value) => setValue('status', value)}
                            defaultValue={courseData?.status || 'DRAFT'}
                            value={courseData?.status || 'DRAFT'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMutation.isPending || updateMutation.isPending || !imageUrl || !facultySelected || !majorSelected}
                        >
                            {(createMutation.isPending || updateMutation.isPending) && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {option === 'create' ? 'Thêm mới' : 'Cập nhật'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}