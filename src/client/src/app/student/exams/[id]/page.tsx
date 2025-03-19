'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer?: number;
}

export default function ExamPage() {
    const params = useParams();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
    const [examStatus, setExamStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');

    // Mock exam data - replace with API call
    const examData = {
        id: params.id,
        title: 'Giữa kỳ Toán cao cấp A1',
        course: 'MATH101',
        duration: 60,
        totalQuestions: 3,
        questions: [
            {
                id: 1,
                text: 'Đạo hàm của hàm số f(x) = x² là?',
                options: ['f\'(x) = x', 'f\'(x) = 2x', 'f\'(x) = 2', 'f\'(x) = 0'],
            },
            {
                id: 2,
                text: 'Tích phân của hàm số f(x) = 2x là?',
                options: ['x²', 'x² + C', '2x² + C', 'x'],
            },
            {
                id: 3,
                text: 'Giới hạn của hàm số f(x) = 1/x khi x tiến đến 0 là?',
                options: ['0', '1', 'Không tồn tại', 'Vô cùng'],
            },
        ],
    };

    useEffect(() => {
        if (examStatus === 'in_progress') {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmitExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [examStatus]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleStartExam = () => {
        setExamStatus('in_progress');
        setSelectedAnswers(new Array(examData.questions.length).fill(-1));
    };

    const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
        setSelectedAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[questionIndex] = answerIndex;
            return newAnswers;
        });
    };

    const handleSubmitExam = () => {
        setExamStatus('completed');
        // Here you would typically send the answers to the server
    };

    if (examStatus === 'not_started') {
        return (
            <div className="container py-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{examData.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-gray-600">Môn học: {examData.course}</p>
                            <p className="text-gray-600">Thời gian: {examData.duration} phút</p>
                            <p className="text-gray-600">Số câu hỏi: {examData.totalQuestions}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">Hướng dẫn làm bài:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Đọc kỹ câu hỏi trước khi trả lời</li>
                                <li>Thời gian làm bài sẽ bắt đầu ngay khi bấm nút bắt đầu</li>
                                <li>Bài thi sẽ tự động nộp khi hết thời gian</li>
                            </ul>
                        </div>
                        <Button onClick={handleStartExam}>Bắt đầu làm bài</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (examStatus === 'completed') {
        return (
            <div className="container py-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Bài thi đã hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Cảm ơn bạn đã hoàn thành bài thi. Kết quả sẽ được thông báo sau.</p>
                        {/* Add more details about results here */}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{examData.title}</h1>
                <div className="text-xl font-semibold">
                    Thời gian còn lại: {formatTime(timeRemaining)}
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="text-lg font-medium">
                            Câu {currentQuestion + 1}/{examData.questions.length}:
                        </div>
                        <div className="text-lg">
                            {examData.questions[currentQuestion].text}
                        </div>
                        <div className="space-y-3">
                            {examData.questions[currentQuestion].options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                        selectedAnswers[currentQuestion] === index
                                            ? 'border-blue-500 bg-blue-50'
                                            : ''
                                    }`}
                                    onClick={() => handleSelectAnswer(currentQuestion, index)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                >
                    Câu trước
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.min(examData.questions.length - 1, prev + 1))}
                    disabled={currentQuestion === examData.questions.length - 1}
                >
                    Câu tiếp theo
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {examData.questions.map((_, index) => (
                            <button
                                key={index}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                    selectedAnswers[index] !== -1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white'
                                } ${currentQuestion === index ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => setCurrentQuestion(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSubmitExam}>Nộp bài</Button>
            </div>
        </div>
    );
}