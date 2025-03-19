'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

export default function ExamsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openModalAddExam, setOpenModalAddExam] = useState(false);
    const [examId, setExamId] = useState<string | null>(null);
    const router = useRouter();

    // Mock data for exams - replace with real API calls later
    const mockExams = [
        {
            id: 1,
            title: 'Giữa kỳ Toán cao cấp A1',
            course: 'MATH101',
            date: '2025-03-20',
            time: '09:00',
            duration: 90,
            status: 'upcoming',
        },
        {
            id: 2,
            title: 'Cuối kỳ Lập trình C++',
            course: 'IT102',
            date: '2025-03-25',
            time: '14:00',
            duration: 120,
            status: 'upcoming',
        },
        {
            id: 3,
            title: 'Quiz Tiếng Anh cơ bản',
            course: 'ENG101',
            date: '2025-03-15',
            time: '10:00',
            duration: 45,
            status: 'completed',
        },
    ];

    const filteredExams = mockExams.filter(
        (exam) =>
            exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.course.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const upcomingExams = filteredExams.filter((exam) => exam.status === 'upcoming');
    const completedExams = filteredExams.filter((exam) => exam.status === 'completed');

    const handleStartExam = (id: number) => {
        router.push(`/exams/${id}`);
    };

    return (
        <div className="container py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý bài thi</h1>
                <Button onClick={() => setOpenModalAddExam(true)}>Thêm bài thi mới</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tìm kiếm bài thi</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Tìm theo tên bài thi hoặc mã môn học..."
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="max-w-xl"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Bài thi sắp tới</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {upcomingExams.map((exam) => (
                            <Card key={exam.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{exam.title}</h3>
                                            <p className="text-sm text-gray-500">Mã môn: {exam.course}</p>
                                            <p className="text-sm text-gray-500">
                                                Thời gian: {exam.date} {exam.time}
                                            </p>
                                            <p className="text-sm text-gray-500">Thời lượng: {exam.duration} phút</p>
                                        </div>
                                        <Button onClick={() => handleStartExam(exam.id)} variant="outline">
                                            Bắt đầu thi
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Bài thi đã hoàn thành</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {completedExams.map((exam) => (
                            <Card key={exam.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{exam.title}</h3>
                                            <p className="text-sm text-gray-500">Mã môn: {exam.course}</p>
                                            <p className="text-sm text-gray-500">
                                                Thời gian: {exam.date} {exam.time}
                                            </p>
                                            <p className="text-sm text-gray-500">Thời lượng: {exam.duration} phút</p>
                                        </div>
                                        <Button onClick={() => handleStartExam(exam.id)} variant="outline">
                                            Xem kết quả
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={openModalAddExam} onOpenChange={setOpenModalAddExam}>
                <DialogTrigger asChild>
                    <Button variant="outline">Thêm bài thi</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-4">
                    <DialogHeader>
                        <DialogTitle>Thêm bài thi</DialogTitle>
                    </DialogHeader>

                    <Input
                        placeholder="Mã bài thi"
                        value={examId ?? ''}
                        className='mt-2'
                        onChange={(e) => setExamId(e.target.value)}
                    />
                    <DialogFooter>
                        <Button>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
