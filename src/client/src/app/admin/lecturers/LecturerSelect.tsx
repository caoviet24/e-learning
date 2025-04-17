'use client';

import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { lecturerService } from '@/services/lecturerService';
import { ILecturer } from '@/types';

interface LecturerSelectProps {
    value: string;
    onSelectValue: (value: string) => void;
    facultyId?: string;
    majorId?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function LecturerSelect({
    value,
    onSelectValue,
    facultyId,
    majorId,
    placeholder = 'Chọn giảng viên',
    disabled = false,
}: LecturerSelectProps) {
    const {
        data: lecturers,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['lecturers-options', facultyId, majorId],
        queryFn: () =>
            lecturerService.getAll({
                pageNumber: 1,
                pageSize: 100,
                facultyId: facultyId,
                majorId: majorId,
                isDeleted: false,
            }),
        enabled: false,
    });

    useEffect(() => {
        refetch();
    }, [facultyId, majorId, refetch]);

    return (
        <Select value={value} onValueChange={onSelectValue} disabled={disabled || isLoading}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="">Không chọn</SelectItem>
                {lecturers?.data?.map((lecturer: ILecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.user?.fullName} - {lecturer.cardId}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}