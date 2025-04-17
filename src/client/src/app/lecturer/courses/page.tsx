'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useDebounce from '@/hooks/useDebounce';
import { useUser } from '@/hooks/useUser';
import { courseService } from '@/services/courseService';
import { ICourse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Filter, Plus, Search, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CoursesPage() {
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const debounceSearchTerm = useDebounce(searchTerm, 800);

    const { data: coursesData, refetch, isSuccess: isFetchGetCourseSuccess } = useQuery({
        queryKey: ['courses', user?.id, statusFilter, debounceSearchTerm],
        queryFn: () =>
            courseService.getAll({
                pageNumber: 1,
                pageSize: 100,
                lecturer_id: user?.id,
                search: debounceSearchTerm || undefined,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                type: 'basic'
            }),
        enabled: !!user?.id,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý khóa học</h1>
                    <p className="text-muted-foreground mt-1">Quản lý và tạo mới các khóa học của bạn</p>
                </div>
                <Link href="/lecturer/courses/new">
                    <Button className="shadow-sm hover:shadow transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm khóa học
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Tìm kiếm khóa học..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="w-full md:w-64">
                    <Select value={statusFilter} onValueChange={(e) => setStatusFilter(e)} defaultValue="ALL">
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Trạng thái khóa học" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                            <SelectItem value="PUBLIC">Công khai</SelectItem>
                            <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {!coursesData?.data?.length && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        </div>
                        <p className="text-muted-foreground mt-4 font-medium">Đang tải khóa học...</p>
                        <p className="text-sm text-muted-foreground mt-1">Vui lòng đợi trong giây lát</p>
                    </div>
                )}

                {
                    isFetchGetCourseSuccess && coursesData?.data?.length === 0 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16">
                            <p className="text-muted-foreground mt-4 font-medium">Không tìm thấy khóa học nào</p>
                            <p className="text-sm text-muted-foreground mt-1">Hãy tạo khóa học mới để bắt đầu</p>
                        </div>
                    )
                }

                {/* {coursesData?.data?.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center p-10 border border-dashed rounded-lg bg-gray-50">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="rounded-full bg-gray-100 p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold">Chưa có khóa học nào</h3>
                            <p className="text-sm text-muted-foreground">Bạn chưa có khóa học nào. Tạo khóa học mới để bắt đầu.</p>
                            <Link href="/lecturer/courses/new" className="mt-4">
                                <Button variant="default" className="mt-2">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo khóa học mới
                                </Button>
                            </Link>
                        </div>
                    </div>
                )} */}

                {coursesData?.data?.map((course: ICourse) => (
                    <Card
                        key={course.id}
                        className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                    >
                        <CardHeader className="relative p-0">
                            <div className="absolute top-3 right-3 z-10">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        course.status === 'PUBLIC'
                                            ? 'bg-green-100 text-green-800'
                                            : course.status === 'PRIVATE'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {course.status}
                                </span>
                            </div>
                            {course.thumbNail ? (
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={course.thumbNail}
                                        alt={course.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 w-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500">No thumbnail</span>
                                </div>
                            )}
                            <div className="p-4">
                                <CardTitle className="text-lg font-semibold line-clamp-1 hover:line-clamp-none transition-all">{course.title}</CardTitle>
                                <CardDescription className="text-sm mt-1 line-clamp-2 h-10 overflow-hidden">
                                    {course.description || 'No description provided'}
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-between">
                            <div className="space-y-3 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                        Tổng số bài học:
                                    </span>
                                    <span className="font-medium text-foreground">100</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                        Videos đã tải lên:
                                    </span>
                                    <span className="font-medium text-foreground">100</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                        </svg>
                                        Sinh viên đăng ký:
                                    </span>
                                    <span className="font-medium text-foreground">100</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <Link href={`/lecturer/courses/${course.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full hover:bg-gray-100 transition-colors">
                                        Chỉnh sửa
                                    </Button>
                                </Link>
                                <Link href={`/lecturer/courses/${course.id}/videos`} className="flex-1">
                                    <Button variant="secondary" className="w-full hover:opacity-90 transition-opacity">
                                        <Video className="w-4 h-4 mr-2" />
                                        Videos
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
