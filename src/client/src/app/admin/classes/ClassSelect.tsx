'use client';

import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { classService } from '@/services/classService';
import { IClass } from '@/types';

interface ClassSelectProps {
    value: string;
    onSelectValue: (value: string) => void;
    facultyId?: string;
    majorId?: string;
    lecturerId?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function ClassSelect({
    value,
    onSelectValue,
    facultyId,
    majorId,
    lecturerId,
    placeholder = 'Chọn lớp học',
    disabled = false,
}: ClassSelectProps) {
    const {
        data: classes,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['classes-options', facultyId, majorId, lecturerId],
        queryFn: () =>
            classService.getAll({
                page_number: 1,
                page_size: 100,
                faculty_id: facultyId,
                major_id: majorId,
                lecturer_id: lecturerId,
                is_deleted: false,
            }),
        enabled: false,
    });

    useEffect(() => {
        refetch();
    }, [facultyId, majorId, lecturerId, refetch]);

    return (
        <Select value={value} onValueChange={onSelectValue} disabled={disabled || isLoading}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tất cả lớp học</SelectItem>
                {classes?.data?.map((cls: IClass) => (
                    <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} ({cls.class_code})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}