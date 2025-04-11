'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { courseService } from '@/services/courseService';
import { useQuery } from '@tanstack/react-query';
import { Plus, Video } from 'lucide-react';
import Link from 'next/link';

interface Course {
    id: string | number;
    title: string;
    description: string;
    totalLessons: number;
    totalVideos: number;
    totalStudents: number;
}

export default function CoursesPage() {
    const { user } = useUser();

    const { data: coursesData } = useQuery({
        queryKey: ['courses', user?.id],
        queryFn: () => courseService.getByLecturerId(user?.id || ''),
        enabled: !!user?.id,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
                <Link href="/lecturer/courses/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm khóa học
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!coursesData?.data?.length && (
                    <div className="col-span-3 text-center py-10">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                        <p className="text-muted-foreground mt-3">Đang tải...</p>
                    </div>
                )}

                {coursesData?.data?.map((course: Course) => (
                    <Card key={course.id}>
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Tổng số bài học:</span>
                                    <span className="font-medium">{course.totalLessons}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Videos đã tải lên:</span>
                                    <span className="font-medium">{course.totalVideos}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Sinh viên đăng ký:</span>
                                    <span className="font-medium">{course.totalStudents}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Link href={`/lecturer/courses/${course.id.toString()}`} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        Chỉnh sửa
                                    </Button>
                                </Link>
                                <Link href={`/lecturer/courses/${course.id.toString()}/videos`} className="flex-1">
                                    <Button variant="secondary" className="w-full">
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
