'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { HomeworkCard } from "@/components/homework-card";
import { homeworks } from "@/content/homework-data";
import { Search, BookOpen, ChevronDown } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function HomeworksPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Group homeworks by course and filter based on search
    const groupedHomeworks = useMemo(() => {
        const filtered = homeworks.filter(homework =>
            homework.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            homework.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.reduce((groups, homework) => {
            if (!groups[homework.courseName]) {
                groups[homework.courseName] = [];
            }
            groups[homework.courseName].push(homework);
            return groups;
        }, {} as Record<string, typeof homeworks>);
    }, [searchQuery]);

    // Count assignments by status for each course
    const getStatusCounts = (assignments: typeof homeworks) => {
        return assignments.reduce(
            (counts, hw) => {
                counts[hw.status]++;
                return counts;
            },
            { pending: 0, submitted: 0, graded: 0 } as Record<string, number>
        );
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 space-y-6">
                <h1 className="text-3xl font-bold">Bài tập</h1>
                
                {/* Search bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm bài tập..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Display homeworks grouped by course in accordion */}
            <div className="space-y-4">
                <Accordion type="multiple" className="space-y-4">
                    {Object.entries(groupedHomeworks).map(([courseName, assignments]) => {
                        const statusCounts = getStatusCounts(assignments);
                        return (
                            <AccordionItem
                                key={courseName}
                                value={courseName}
                                className="border rounded-lg overflow-hidden bg-card"
                            >
                                <AccordionTrigger className="hover:no-underline [&[data-state=open]>div]:bg-muted">
                                    <div className="flex items-center w-full p-6 transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{courseName}</h3>
                                            <div className="flex gap-3 mt-1">
                                                {statusCounts.pending > 0 && (
                                                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                                                        {statusCounts.pending} chưa nộp
                                                    </Badge>
                                                )}
                                                {statusCounts.submitted > 0 && (
                                                    <Badge variant="outline" className="text-blue-500 border-blue-500">
                                                        {statusCounts.submitted} đã nộp
                                                    </Badge>
                                                )}
                                                {statusCounts.graded > 0 && (
                                                    <Badge variant="outline" className="text-green-500 border-green-500">
                                                        {statusCounts.graded} đã chấm
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="divide-y">
                                        {assignments.map((homework) => (
                                            <div key={homework.id} className="px-6">
                                                <HomeworkCard homework={homework} />
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>

                {/* No results message */}
                {Object.keys(groupedHomeworks).length === 0 && (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            Không tìm thấy bài tập nào
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}