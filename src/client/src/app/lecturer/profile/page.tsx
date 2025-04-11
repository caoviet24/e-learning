'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { Pencil, Save, X, User, Mail, Phone, MapPin, UserCircle, BookOpen, Award, Building, Calendar, School, Lock, Key, Users } from 'lucide-react';
import { accountService } from '@/services/accountService';
import { courseService } from '@/services/courseService';
import { classService } from '@/services/classService';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { lecturerService } from '@/services/lecturerService';
import AvatarChangeDialog from './AvatarChangeDialog';
import PasswordChangeDialog from './PasswordChangeDialog';
import { Separator } from '@/components/ui/separator';
import { ILecturer } from '@/types';

interface UserPayLoad {
    full_name: string;
    email: string;
    phone_number: string;
    current_address: string;
    gender: number;
    avatar: string;
}

const userSchema = z.object({
    full_name: z.string().min(1, { message: 'Tên không được để trống' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    avatar: z.string().optional(),
    phone_number: z.string().optional(),
    current_address: z.string().optional(),
    gender: z.number().optional(),
});

export default function Profile() {
    const { user, setUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [data, setData] = useState<ILecturer | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            full_name: user?.full_name || '',
            email: user?.email || '',
            phone_number: user?.phone_number || '',
            gender: user?.gender || 0,
            current_address: user?.current_address || '',
            avatar: user?.avatar || '',
        },
    });

    const {
        data: lecturerData,
        isSuccess: isFetchLecturerSuccess,
        isLoading: isFetchLecturerLoading,
    } = useQuery<ILecturer>({
        queryKey: ['get-lecturer-by-id', user?.id],
        queryFn: () => lecturerService.getById(user?.id || ''),
        enabled: !!user?.id,
    });
    
    const {
        data: coursesData,
        isSuccess: isFetchCoursesSuccess,
        isLoading: isFetchCoursesLoading,
    } = useQuery({
        queryKey: ['get-courses-by-lecturer-id', user?.id],
        queryFn: () => courseService.getByLecturerId(user?.id || ''),
        enabled: !!user?.id,
    });
    
    const {
        data: classesData,
        isSuccess: isFetchClassesSuccess,
        isLoading: isFetchClassesLoading,
    } = useQuery({
        queryKey: ['get-classes-by-lecturer-id', user?.id],
        queryFn: () => classService.getAll({
            page_number: 1,
            page_size: 100,
            lecturer_id: user?.id || '',
        }),
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (user) {
            reset({
                full_name: user.full_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                gender: user.gender || 0,
                current_address: user.current_address || '',
                avatar: user.avatar || '',
            });
        }
    }, [user, reset]);

    useEffect(() => {
        if(isFetchLecturerSuccess) {
            setData(lecturerData);
        }
    }, [isFetchLecturerSuccess]);
    
    useEffect(() => {
        if(isFetchCoursesSuccess && coursesData) {
            setCourses(coursesData);
        }
    }, [isFetchCoursesSuccess, coursesData]);
    
    useEffect(() => {
        if(isFetchClassesSuccess && classesData) {
            setClasses(classesData.data || []);
        }
    }, [isFetchClassesSuccess, classesData]);

    if (!user || isFetchLecturerLoading) {
        return (
            <div className="container mx-auto py-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-[250px]" />
                                <Skeleton className="h-5 w-[200px]" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i}>
                                        <Skeleton className="h-5 w-[120px] mb-2" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i}>
                                        <Skeleton className="h-5 w-[120px] mb-2" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getGenderText = (gender: number | undefined) => {
        if (gender === 0) return 'Nam';
        if (gender === 1) return 'Nữ';
        return 'Không xác định';
    };

    const handleEditToggle = () => {
        if (isEditing) {
            reset({
                full_name: user.full_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                gender: user.gender || 0,
                current_address: user.current_address || '',
                avatar: user.avatar || '',
            });
        }
        setIsEditing(!isEditing);
    };

    const onSubmit = async (data: z.infer<typeof userSchema>) => {
        try {
            const response = await accountService.updateProfile(user.id, data);
            if (response) {
                setUser({ ...user, ...data });
                toast.success('Cập nhật thông tin thành công');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error('Cập nhật thông tin thất bại');
            console.error('Error updating profile:', error);
        }
    };

    const handleChangeAvatar = async (newAvatarUrl: string) => {
        try {
            const updatedData = {
                ...user,
                avatar: newAvatarUrl,
            };

            const response = await accountService.updateProfile(user.id, updatedData);
            if (response) {
                setUser({ ...user, avatar: newAvatarUrl });
                setValue('avatar', newAvatarUrl);
                toast.success('Cập nhật ảnh đại diện thành công');
            }
        } catch (error) {
            toast.error('Cập nhật ảnh đại diện thất bại');
            console.error('Error updating avatar:', error);
        }
    };

    const avatarUrl = watch('avatar') || user.avatar;

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Thông tin giảng viên</h1>

            <Tabs defaultValue="personal" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="personal" className="text-base">
                        <User className="h-4 w-4 mr-2" />
                        Thông tin cá nhân
                    </TabsTrigger>
                    <TabsTrigger value="academic" className="text-base">
                        <Award className="h-4 w-4 mr-2" />
                        Thông tin học thuật
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                    <Card className="shadow-lg border-t-4 border-t-primary">
                        <CardHeader className="flex flex-row items-center justify-between pb-0">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24 border-4 border-primary/10">
                                        <AvatarImage src={avatarUrl} alt={user.full_name} />
                                        <AvatarFallback className="text-xl bg-primary/10">{getInitials(user.full_name)}</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute -right-2 -bottom-2 rounded-full w-8 h-8 shadow-md"
                                        onClick={() => setAvatarDialogOpen(true)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold">{user.full_name}</h2>
                                        <Badge variant="outline" className="ml-2">
                                            Giảng viên
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> {user.email}
                                    </p>
                                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                        <Building className="h-4 w-4" /> {lecturerData?.faculty?.name}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={handleEditToggle}>
                                            <X className="w-4 h-4 mr-1" />
                                            Hủy
                                        </Button>
                                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                                            <Save className="w-4 h-4 mr-1" />
                                            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" onClick={handleEditToggle}>
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name" className="font-medium flex items-center gap-2">
                                            <UserCircle className="h-4 w-4" /> Họ và tên
                                        </Label>
                                        <Controller
                                            name="full_name"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <Input {...field} disabled={!isEditing} className="mt-1" placeholder="Nhập họ và tên" />
                                                    {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" /> Giới tính
                                        </Label>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value?.toString()}
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                    disabled={!isEditing}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Chọn giới tính" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">Nam</SelectItem>
                                                        <SelectItem value="1">Nữ</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4" /> Email
                                        </Label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <Input {...field} disabled={!isEditing} className="mt-1" placeholder="Nhập email" />
                                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number" className="font-medium flex items-center gap-2">
                                            <Phone className="h-4 w-4" /> Số điện thoại
                                        </Label>
                                        <Controller
                                            name="phone_number"
                                            control={control}
                                            render={({ field }) => <Input {...field} disabled={!isEditing} className="mt-1" placeholder="Nhập số điện thoại" />}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="current_address" className="font-medium flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> Địa chỉ hiện tại
                                        </Label>
                                        <Controller
                                            name="current_address"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    disabled={!isEditing}
                                                    className="mt-1 resize-none"
                                                    placeholder="Nhập địa chỉ hiện tại"
                                                    rows={3}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <div className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Ngày tham gia
                                    </div>
                                    <p className="text-sm">{new Date().toLocaleDateString('vi-VN')}</p>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <Key className="h-4 w-4" /> Bảo mật tài khoản
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setPasswordDialogOpen(true)} className="min-w-[120px]">
                                        <Lock className="h-4 w-4 mr-2" />
                                        Đổi mật khẩu
                                    </Button>
                                </div>
                            </form>
                        </CardContent>

                        {!isEditing && (
                            <CardFooter className="bg-muted/20 py-4">
                                <p className="text-sm text-muted-foreground w-full text-center">Nhấn nút "Chỉnh sửa" để cập nhật thông tin cá nhân của bạn</p>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="academic">
                    <Card className="shadow-lg border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="h-5 w-5" />
                                Thông tin học thuật
                            </CardTitle>
                            <CardDescription>Chi tiết về khoa, bộ môn và các môn giảng dạy</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                                        <Building className="h-4 w-4" /> Khoa
                                    </h3>
                                    <p className="font-medium">{lecturerData?.faculty?.name}</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Bộ môn
                                    </h3>
                                    <p className="font-medium">{lecturerData?.major?.name}</p>
                                </div>
                            </div>

                            <Separator />
                            
                            <div className="space-y-3">
                                <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Lớp đang phụ trách
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {isFetchClassesLoading ? (
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map((i) => (
                                                <Skeleton key={i} className="h-8 w-28 rounded-full" />
                                            ))}
                                        </div>
                                    ) : classes && classes.length > 0 ? (
                                        classes.map((classItem: any) => (
                                            <Badge key={classItem.id} variant="outline" className="px-3 py-1">
                                                {classItem.name} ({classItem.class_code})
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Chưa có lớp nào được phân công</p>
                                    )}
                                </div>
                            </div>
                            
                            <Separator />

                            <div className="space-y-3">
                                <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                                    <Award className="h-4 w-4" /> Môn học đang dạy
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {isFetchCoursesLoading ? (
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map((i) => (
                                                <Skeleton key={i} className="h-8 w-28 rounded-full" />
                                            ))}
                                        </div>
                                    ) : courses && courses.length > 0 ? (
                                        courses.map((course: any, index: number) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1">
                                                {course.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Chưa có môn học nào</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AvatarChangeDialog
                open={avatarDialogOpen}
                oldAvatar={user.avatar as string}
                onChangeAvatar={handleChangeAvatar}
                onOpenChange={setAvatarDialogOpen}
            />

            <PasswordChangeDialog open={passwordDialogOpen} userId={user.id} onOpenChange={setPasswordDialogOpen} />
        </div>
    );
}
