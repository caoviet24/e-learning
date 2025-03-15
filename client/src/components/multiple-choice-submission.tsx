'use client';

import { useState, useEffect } from 'react';
import { MultipleChoiceHomework } from "@/content/homework-data";
import { Button } from "@/components/ui/button";
import { Timer, AlertCircle, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultipleChoiceSubmissionProps {
    homework: MultipleChoiceHomework;
}

export function MultipleChoiceSubmission({ homework }: MultipleChoiceSubmissionProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(homework.timeLimit * 60); // Convert minutes to seconds
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0 || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted]);

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = () => {
        if (isSubmitted) return;
        // TODO: Implement submission logic
        console.log('Submitting answers:', selectedAnswers);
        setIsSubmitted(true);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Timer and Progress */}
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Timer className={cn(
                            "w-5 h-5",
                            timeLeft < 60 && "text-destructive animate-pulse"
                        )} />
                        <span className={cn(
                            "font-medium",
                            timeLeft < 60 && "text-destructive"
                        )}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        Đã trả lời: {Object.keys(selectedAnswers).length}/{homework.questions.length}
                    </span>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
                {homework.questions.map((question, index) => (
                    <div key={question.id} className="p-4 rounded-lg border">
                        <h3 className="font-medium mb-4">
                            Câu {index + 1}: {question.question}
                        </h3>
                        <div className="space-y-3">
                            {question.options.map((option, optionIndex) => (
                                <button
                                    key={optionIndex}
                                    onClick={() => handleOptionSelect(question.id, optionIndex)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                                        selectedAnswers[question.id] === optionIndex
                                            ? "bg-primary/10 text-primary"
                                            : "hover:bg-muted",
                                        isSubmitted && "cursor-default"
                                    )}
                                    disabled={isSubmitted}
                                >
                                    {selectedAnswers[question.id] === optionIndex ? (
                                        <CheckCircle className="w-5 h-5 shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 shrink-0" />
                                    )}
                                    <span>{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Warning and Submit button */}
            {!isSubmitted && (
                <>
                    <div className="bg-muted rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Bạn chỉ được phép nộp bài một lần duy nhất</li>
                                <li>Bài làm sẽ tự động nộp khi hết thời gian</li>
                                <li>Hãy kiểm tra kỹ các câu trả lời trước khi nộp bài</li>
                            </ul>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={Object.keys(selectedAnswers).length === 0}
                    >
                        Nộp bài
                    </Button>
                </>
            )}
        </div>
    );
}