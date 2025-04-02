'use client';

import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { setMajors } from '@/redux/slices/major.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { majorService } from '@/services/majorService';
import { IMajor, IResponseList } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Loader2, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MajorSelectProps {
    value: string;
    onSelectValue: (value: string) => void;
    facultyId?: string;
}

export default function MajorSelect({ value, onSelectValue, facultyId }: MajorSelectProps) {
    const [searchMajor, setSearchMajor] = useState('');
    const [searchMajorResult, setSearchMajorResult] = useState<IMajor[]>([]);
    const debouncedMajorSearch = useDebounce(searchMajor, 500);
    const { majorsStore } = useAppSelector((state) => state.localStorage.major);
    const dispatch = useAppDispatch();

    const {
        data: majorsData,
        isLoading: isFetchMajorsLoading,
        isSuccess: isFetchMajorsSuccess,
        refetch: refetchMajors,
    } = useQuery<IResponseList<IMajor>>({
        queryKey: ['majors', debouncedMajorSearch, facultyId],
        queryFn: () =>
            majorService.getAll({
                page_number: 1,
                page_size: 10,
                is_deleted: false,
                faculty_id: facultyId === 'all' || !facultyId ? undefined : facultyId,
                search: searchMajor ? searchMajor : undefined,
            }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: !!value || !!debouncedMajorSearch || majorsStore.total_records <= 0 || !!facultyId,
    });

    useEffect(() => {
        if (isFetchMajorsSuccess && majorsData && !debouncedMajorSearch) {
            dispatch(setMajors(majorsData));
        }

        if (debouncedMajorSearch && isFetchMajorsSuccess) {
            setSearchMajorResult(majorsData.data);
        }
    }, [isFetchMajorsSuccess, majorsData, debouncedMajorSearch, dispatch]);

    useEffect(() => {
        setSearchMajor('');
        refetchMajors();
    }, [facultyId, refetchMajors]);

    useEffect(() => {
        if (majorsStore.total_records > 0 && !debouncedMajorSearch) {
            setSearchMajorResult(majorsStore.data);
        }
    }, [majorsStore.data, majorsStore.total_records, debouncedMajorSearch]);

    return (
        <Select value={value} onValueChange={onSelectValue} disabled={isFetchMajorsLoading}>
            <SelectTrigger className="w-full md:w-48 bg-background py-5 h-10">
                <SelectValue placeholder="Chọn ngành" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-full max-h-80 overflow-auto">
                <div className="pb-0 sticky top-0 z-10">
                    <div className="relative">
                        {isFetchMajorsLoading && searchMajor && (
                            <div className="absolute left-2 top-2.5 animate-spin">
                                <Loader2 />
                            </div>
                        )}

                        {!isFetchMajorsLoading && <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />}

                        <Input
                            placeholder="Tìm kiếm ngành..."
                            value={searchMajor}
                            onChange={(e) => setSearchMajor(e.target.value)}
                            className="pl-8 h-9 faculty-search-input"
                        />
                    </div>
                </div>

                <SelectItem value="all" className="py-3 mt-2">
                    Tất cả ngành
                </SelectItem>

                <RenderWithCondition condition={isFetchMajorsLoading && searchMajor !== null}>
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin mr-2">
                            <Loader2 />
                        </div>
                        <span className="text-sm text-muted-foreground">Đang tìm kiếm...</span>
                    </div>
                </RenderWithCondition>

                <RenderWithCondition condition={searchMajorResult && searchMajorResult.length > 0 && !isFetchMajorsLoading}>
                    {searchMajorResult.map((major) => (
                        <SelectItem key={major.id} value={major.id}>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                    <span className="font-medium">{major.name}</span>
                                    <span className="text-xs text-muted-foreground">Mã: {major.code}</span>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </RenderWithCondition>

                <RenderWithCondition condition={searchMajorResult.length === 0 && searchMajor !== null && !isFetchMajorsLoading}>
                    <div className="flex items-center justify-center py-4">
                        <span className="text-sm text-muted-foreground">Không tìm thấy ngành nào</span>
                    </div>
                </RenderWithCondition>
            </SelectContent>
        </Select>
    );
}
