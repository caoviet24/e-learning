'use client';

import { Homework } from "@/content/homework-data";
import { CalendarIcon, Clock, FileText, ListChecks } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HomeworkCardProps {
    homework: Homework;
}

export function HomeworkCard({ homework }: HomeworkCardProps) {
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'text-yellow-500 border-yellow-500',
                    text: 'Chưa nộp'
                };
            case 'submitted':
                return {
                    color: 'text-blue-500 border-blue-500',
                    text: 'Đã nộp'
                };
            case 'graded':
                return {
                    color: 'text-green-500 border-green-500',
                    text: homework.grade ? `Đã chấm: ${homework.grade} điểm` : 'Đã chấm'
                };
            default:
                return {
                    color: 'text-gray-500 border-gray-500',
                    text: 'Không xác định'
                };
        }
    };

    const statusInfo = getStatusInfo(homework.status);
    const isOverdue = new Date(homework.dueDate) < new Date();

    return (
        <Link href={`/homeworks/${homework.id.toString()}`} className="block">
            <div className="py-4 -mx-6 px-6 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                            {homework.type === 'file' ? (
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" />
                                    <span>Nộp file</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <ListChecks className="w-4 h-4" />
                                    <span>Trắc nghiệm</span>
                                </div>
                            )}
                        </div>
                        
                        <h3 className="font-medium truncate">{homework.title}</h3>

                        <div className="flex items-center gap-3 mt-2 text-sm">
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                <span className={cn(
                                    "text-muted-foreground",
                                    isOverdue && homework.status === 'pending' && "text-destructive"
                                )}>
                                    Hạn nộp: {new Date(homework.dueDate).toLocaleDateString('vi-VN')}
                                    {isOverdue && homework.status === 'pending' && ' (Quá hạn)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Badge 
                        variant="outline" 
                        className={cn(
                            "shrink-0 h-auto py-1",
                            statusInfo.color
                        )}
                    >
                        {statusInfo.text}
                    </Badge>
                </div>
            </div>
        </Link>
    );
}