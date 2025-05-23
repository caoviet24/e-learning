'use client';

import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { facultyService } from '@/services/facultyService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Loader2, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface FacultyProps {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
}

interface FacultyResponseProps {
    items: FacultyProps[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface FacultySelectProps {
    value: string;
    onSelectValue: (value: string) => void;
}

export default function FacultySelect({ value, onSelectValue }: FacultySelectProps) {
    const [searchFaculty, setSearchFaculty] = useState('');
    const [searchFacultyResult, setSearchFacultyResult] = useState<FacultyProps[]>([]);
    const debouncedFacultySearch = useDebounce(searchFaculty, 500);

    const {
        data: facultiesData,
        isLoading: isFetchFacultiesLoading,
        isSuccess: isFetchFacultiesSuccess,
    } = useQuery<FacultyResponseProps>({
        queryKey: ['faculties', debouncedFacultySearch],
        queryFn: () =>
            facultyService.getAll({
                pageNumber: 1,
                pageSize: 10,
                isDeleted: false,
                search: debouncedFacultySearch,
            }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isFetchFacultiesSuccess && facultiesData) {
            setSearchFacultyResult(facultiesData.items);
        }
    }, [isFetchFacultiesSuccess, facultiesData, debouncedFacultySearch]);

    return (
        <Select
            value={value}
            onValueChange={onSelectValue}
            disabled={isFetchFacultiesLoading}
        >
            <SelectTrigger className="w-full md:w-48 bg-background py-5 h-10">
                <SelectValue placeholder="Chọn khoa" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-full max-h-80 overflow-auto">
                <div className="pb-0 sticky top-0 z-10">
                    <div className="relative">
                        {isFetchFacultiesLoading && searchFaculty && (
                            <div className="absolute left-2 top-2.5 animate-spin">
                                <Loader2 />
                            </div>
                        )}

                        {!isFetchFacultiesLoading && <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />}

                        <Input
                            placeholder="Tìm kiếm khoa..."
                            value={searchFaculty}
                            onChange={(e) => setSearchFaculty(e.target.value)}
                            className="pl-8 h-9 faculty-search-input"
                        />
                    </div>
                </div>

                <SelectItem value="all" className="py-3 mt-2">
                    Tất cả khoa
                </SelectItem>

                <RenderWithCondition condition={isFetchFacultiesLoading && searchFaculty !== ''}>
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin mr-2">
                            <Loader2 />
                        </div>
                        <span className="text-sm text-muted-foreground">Đang tìm kiếm...</span>
                    </div>
                </RenderWithCondition>

                <RenderWithCondition condition={searchFacultyResult && searchFacultyResult.length > 0 && !isFetchFacultiesLoading}>
                    {searchFacultyResult.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                    <span className="font-medium">{faculty.name}</span>
                                    <span className="text-xs text-muted-foreground">Mã: {faculty.code}</span>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </RenderWithCondition>

                <RenderWithCondition condition={searchFacultyResult.length === 0 && searchFaculty !== '' && !isFetchFacultiesLoading}>
                    <div className="flex items-center justify-center py-4">
                        <span className="text-sm text-muted-foreground">Không tìm thấy khoa nào</span>
                    </div>
                </RenderWithCondition>
            </SelectContent>
        </Select>
    );
}
