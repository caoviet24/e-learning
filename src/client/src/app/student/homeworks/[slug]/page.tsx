'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { FileUploadSubmission } from '@/components/file-upload-submission';
import { MultipleChoiceSubmission } from '@/components/multiple-choice-submission';
import { Homework, homeworks } from '@/content/homework-data';
import { CalendarIcon, Clock, ArrowLeft, FileText, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params;
    const hwId = parseInt(slug, 10);
    const [homework, setHomework] = useState<Homework | null>(null);

    useEffect(() => {
        const hw = homeworks.find((h) => h.id.toString() === hwId.toString());
        if (hw) {
            setHomework(hw);
        }
    }, [hwId]);

    if (!homework) {
        return notFound();
    }

    const isOverdue = new Date(homework.dueDate) < new Date();
    const canSubmit = !isOverdue && homework.status === 'pending';

    const getStatusInfo = () => {
        switch (homework.status) {
            case 'pending':
                return {
                    color: 'text-yellow-500 border-yellow-500',
                    text: 'Chưa nộp',
                };
            case 'submitted':
                return {
                    color: 'text-blue-500 border-blue-500',
                    text: 'Đã nộp',
                };
            case 'graded':
                return {
                    color: 'text-green-500 border-green-500',
                    text: 'Đã chấm điểm',
                };
            default:
                return {
                    color: 'text-gray-500 border-gray-500',
                    text: 'Không xác định',
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="border-b">
                <div className="container max-w-4xl mx-auto py-6 px-4">
                    <div className="space-y-4">
                        <Link
                            href="/homeworks"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại danh sách bài tập
                        </Link>

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    {homework.type === 'file' ? (
                                        <Badge variant="outline" className="gap-1">
                                            <FileText className="w-3 h-3" />
                                            Nộp file
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="gap-1">
                                            <ListChecks className="w-3 h-3" />
                                            Trắc nghiệm
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className={statusInfo.color}>
                                        {statusInfo.text}
                                    </Badge>
                                </div>
                                <h1 className="text-2xl font-bold">{homework.title}</h1>
                                <p className="text-muted-foreground mt-1">{homework.courseName}</p>
                            </div>

                            {homework.grade !== undefined && (
                                <div className="bg-primary/10 px-4 py-2 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Điểm số</p>
                                    <p className="text-2xl font-bold text-primary">{homework.grade}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Hạn nộp: {new Date(homework.dueDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            {homework.type === 'multiple_choice' && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Thời gian làm bài: {homework.timeLimit} phút</span>
                                </div>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none">
                            <p>{homework.description}</p>
                        </div>

                        {isOverdue && homework.status === 'pending' && (
                            <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
                                Đã quá hạn nộp bài
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submission form */}
            <div className="container max-w-4xl mx-auto py-6 px-4">
                {homework.status === 'pending' ? (
                    canSubmit ? (
                        homework.type === 'file' ? (
                            <FileUploadSubmission homework={homework} />
                        ) : (
                            <MultipleChoiceSubmission homework={homework} />
                        )
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Bạn không thể nộp bài vì đã quá hạn.</p>
                        </div>
                    )
                ) : (
                    <div className="py-8">
                        <div className="max-w-xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 text-primary mb-4">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Bạn đã nộp bài tập này</span>
                            </div>
                            {homework.grade !== undefined ? (
                                <p className="text-muted-foreground">
                                    Bài tập đã được chấm điểm. Điểm số của bạn là: {homework.grade}
                                </p>
                            ) : (
                                <p className="text-muted-foreground">Bài tập đang chờ giảng viên chấm điểm</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
