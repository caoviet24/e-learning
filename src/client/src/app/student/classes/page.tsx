'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClassesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Mock data for classes - replace with real API calls later
    const mockClasses = [
        { id: 1, name: 'Toán cao cấp A1', code: 'MATH101', teacher: 'Nguyễn Văn A' },
        { id: 2, name: 'Lập trình C++', code: 'IT102', teacher: 'Trần Thị B' },
        { id: 3, name: 'Tiếng Anh cơ bản', code: 'ENG101', teacher: 'Phạm Văn C' },
    ];

    const enrolledClasses = mockClasses.slice(0, 2); // Mock enrolled classes

    const filteredClasses = mockClasses.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleJoinClass = (id: string | number) => {
        // classes/{id}
        router.push(`/classes/${id}`);

    };

    return (
        <div className="container py-6 space-y-6">

          
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
                <Button>Thêm lớp học mới</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tìm kiếm lớp học</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Tìm theo tên lớp hoặc mã lớp..."
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="max-w-xl"
                    />

                    <div className="mt-4 space-y-4">
                        {filteredClasses.map((cls) => (
                            <Card key={cls.id}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{cls.name}</h3>
                                        <p className="text-sm text-gray-500">Mã lớp: {cls.code}</p>
                                        <p className="text-sm text-gray-500">Giảng viên: {cls.teacher}</p>
                                    </div>
                                    <Button variant="outline">Tham gia</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lớp học đã tham gia</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {enrolledClasses.map((cls) => (
                            <Card key={cls.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{cls.name}</h3>
                                            <p className="text-sm text-gray-500">Mã lớp: {cls.code}</p>
                                            <p className="text-sm text-gray-500">Giảng viên: {cls.teacher}</p>
                                        </div>
                                        <div>
                                        <Button variant="outline" className="mr-2" onClick={() => handleJoinClass(cls.id)}>
                                            Tham gia
                                        </Button>
                                        <Button variant="ghost" className="text-red-500">
                                            Rời lớp
                                        </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
