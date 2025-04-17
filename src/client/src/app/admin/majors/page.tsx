'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, FileInput, Layers, Loader2, Plus, Repeat, Search, Trash, Trash2 } from 'lucide-react';
import { IFaculty, IMajor, IResponseList } from '@/types';
import React, { useState, useEffect, useMemo } from 'react';
import MajorDiaLog from './MajorDiaLog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { majorService } from '@/services/majorService';
import { setMajors, setMajorsDeleted } from '@/redux/slices/major.slice';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bounce, toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useDebounce from '@/hooks/useDebounce';
import TableRowSkeleton from '@/components/table-row-skeleton';
import ButtonHover from '@/components/ButtonHover';
import FacultySelect from '@/components/FacultySelect';

const pageSize_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

export default function MajorsPage() {
    const [prevPageSize, setPrevPageSize] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabOpened, setTabOpened] = useState(0);
    const [searchMajor, setSearchMajor] = useState('');
    const [facultySeleted, setFacultySelected] = useState<string>('all');
    const debouncedMajorSearch = useDebounce(searchMajor, 500);
    const dispatch = useAppDispatch();
    const { majorsStore, majorsStoreDeleted } = useAppSelector((state) => state.localStorage.major);
    const [majorSelected, setMajorSelected] = useState<IMajor | null>(null);
    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);

 

    const {
        data: majorsData,
        isLoading: isFetchMajorsLoading,
        isSuccess: isFetchMajorsSuccess,
        refetch: refetchMajors,
    } = useQuery<IResponseList<IFaculty>>({
        queryKey: ['majors', currentPage, pageSize, tabOpened, debouncedMajorSearch, facultySeleted],
        queryFn: () =>
            majorService.getAll({
                pageNumber: currentPage,
                pageSize: pageSize,
                search: debouncedMajorSearch,
                isDeleted: tabOpened === 0 ? false : true,
                facultyId: facultySeleted === 'all' ? undefined : facultySeleted,
            }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled:
            !!debouncedMajorSearch ||
            (tabOpened === 0 && majorsStore.totalRecords <= 0) ||
            (tabOpened === 1 && majorsStoreDeleted.totalRecords <= 0) ||
            facultySeleted !== 'all',
    });

    useEffect(() => {
        if (isFetchMajorsSuccess) {
            if (tabOpened === 0) {
                dispatch(
                    setMajors({
                        ...majorsData,
                        filtered: facultySeleted !== 'all',
                    }),
                );
            } else {
                dispatch(setMajorsDeleted(majorsData));
            }
        }
    }, [isFetchMajorsSuccess, majorsData, debouncedMajorSearch, facultySeleted]);

    useEffect(() => {
        if (prevPageSize < pageSize) {
            if (pageSize > majorsStore.totalRecords || pageSize > majorsStoreDeleted.totalRecords) {
                refetchMajors();
            }
        }
    }, [pageSize]);

    const handlePageSizeChange = (value: string) => {
        setPrevPageSize(pageSize);
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const dataDisplayed = useMemo(() => {
        if (facultySeleted !== 'all' || debouncedMajorSearch) {
            if (majorsData?.data) {
                if (majorsData.data.length === 0) {
                    return [];
                }

                return majorsData.data.map((major, index) => ({
                    ...major,
                    index: (currentPage - 1) * pageSize + index + 1,
                }));
            }
            return [];
        }

        const currentData = tabOpened === 0 ? majorsStore : majorsStoreDeleted;
        if (!isFetchMajorsLoading && currentData?.data && currentData.data.length > 0) {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, currentData.data.length);
            return currentData.data.slice(startIndex, endIndex).map((major, index) => ({
                ...major,
                index: startIndex + index + 1,
            }));
        }

        if (majorsData?.data) {
            if (majorsData.data.length === 0) {
                return [];
            }

            return majorsData.data.map((major, index) => ({
                ...major,
                index: (currentPage - 1) * pageSize + index + 1,
            }));
        }

        return [];
    }, [majorsData, majorsStore, majorsStoreDeleted, tabOpened, currentPage, pageSize, debouncedMajorSearch, isFetchMajorsLoading]);

    const getIsLastPage = () => {
        const currentData = tabOpened === 0 ? majorsStore : majorsStoreDeleted;
        const totalRecords =
            debouncedMajorSearch || pageSize > (currentData?.totalRecords ?? 0)
                ? majorsData?.totalRecords ?? currentData?.totalRecords ?? 0
                : currentData?.totalRecords ?? 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return currentPage === totalPages;
    };

    const renderPaginationItems = () => {
        const items = [];
        const currentData = tabOpened === 0 ? majorsStore : majorsStoreDeleted;
        const totalRecords =
            debouncedMajorSearch || pageSize > (currentData?.totalRecords ?? 0)
                ? majorsData?.totalRecords ?? currentData?.totalRecords ?? 0
                : currentData?.totalRecords ?? 0;
        const totalPages = Math.ceil(totalRecords / pageSize);
        const current = currentPage;
        const delta = 2;

        if (totalPages <= 1) return [];

        let start = Math.max(1, current - delta);
        let end = Math.min(totalPages, current + delta);

        items.push(
            <PaginationItem key={1}>
                <PaginationLink onClick={() => setCurrentPage(1)} isActive={current === 1} aria-label="Go to first page">
                    1
                </PaginationLink>
            </PaginationItem>,
        );

        if (start > 2) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>,
            );
        }

        for (let i = Math.max(2, start); i <= Math.min(end, totalPages - 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i)} isActive={current === i} aria-label={`Go to page ${i}`}>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        if (end < totalPages - 1) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>,
            );
        }
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={current === totalPages} aria-label="Go to last page">
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        return items;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý chuyên ngành</h2>
                <div className="flex items-center gap-2">
                    <ButtonHover
                        title="Thêm chuyên ngành"
                        variant="default"
                        leftIcon={<Plus className="w-6 h-6" />}
                        onClick={() => {
                            setOptionDialog({
                                option: 'create',
                                title: 'Thêm chuyên ngành',
                            });
                        }}
                    />

                    <ButtonHover
                        title="Xuất file"
                        variant="outline"
                        leftIcon={<FileInput className="w-6 h-6" />}
                        onClick={() => {
                            toast.info('Chức năng đang được phát triển', {
                                position: 'top-right',
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                transition: Bounce,
                            });
                        }}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Button
                            variant={tabOpened === 0 ? 'default' : 'outline'}
                            onClick={() => {
                                setTabOpened(0);
                                setCurrentPage(1);
                            }}
                            className="flex-1 md:flex-none"
                        >
                            <span>Ngành</span>
                        </Button>
                        <Button
                            variant={tabOpened === 1 ? 'default' : 'outline'}
                            onClick={() => {
                                setTabOpened(1);
                                setCurrentPage(1);
                            }}
                            className="flex-1 md:flex-none"
                        >
                            <span>Đã xóa</span>
                        </Button>
                    </div>

                    <div className="w-full md:w-auto flex flex-col items-center md:flex-row gap-2">
                        <div className="relative w-full md:w-auto">
                            {isFetchMajorsLoading && searchMajor ? (
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin">
                                    <Loader2 />
                                </div>
                            ) : (
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            )}
                            <Input
                                className="pl-10 pr-4 w-full md:w-60"
                                placeholder="Tìm kiếm..."
                                value={searchMajor}
                                onChange={(e) => setSearchMajor(e.target.value)}
                            />
                        </div>

                        <FacultySelect
                            value={facultySeleted}
                            onSelectValue={(value) => {
                                setFacultySelected(value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table className="whitespace-nowrap">
                        <TableHeader>
                            <TableRow>
                                <TableHead>STT</TableHead>
                                <TableHead>Tên chuyên ngành</TableHead>
                                <TableHead>Mã chuyên ngành</TableHead>
                                <TableHead>Khoa</TableHead>
                                <TableHead className="text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetchMajorsLoading ? (
                                <TableRowSkeleton row={4} cell={5} />
                            ) : dataDisplayed && dataDisplayed.length > 0 ? (
                                dataDisplayed.map((major: IMajor, index) => (
                                    <TableRow key={major.id}>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{major.name}</TableCell>
                                        <TableCell>{major.code}</TableCell>
                                        <TableCell>{major.faculty?.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-center gap-2">
                                                {tabOpened === 0 && (
                                                    <React.Fragment>
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Edit className="w-6 h-6 text-blue-500" />}
                                                            suggestText={`Chỉnh sửa`}
                                                            onClick={() => {
                                                                setMajorSelected(major);
                                                                setOptionDialog({
                                                                    option: 'edit',
                                                                    title: `Chỉnh sửa chuyên ngành`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa tạm thời`}
                                                            onClick={() => {
                                                                setMajorSelected(major);
                                                                setOptionDialog({
                                                                    option: 'delete-soft',
                                                                    title: `Xóa chuyên ngành`,
                                                                });
                                                            }}
                                                        />
                                                    </React.Fragment>
                                                )}
                                                {tabOpened === 1 && (
                                                    <React.Fragment>
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Repeat className="w-6 h-6 text-orange-500" />}
                                                            suggestText={`Khôi phục`}
                                                            onClick={() => {
                                                                setMajorSelected(major);
                                                                setOptionDialog({
                                                                    option: 'restore',
                                                                    title: `Khôi phục chuyên ngành`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash2 className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa vĩnh viễn`}
                                                            onClick={() => {
                                                                setMajorSelected(major);
                                                                setOptionDialog({
                                                                    option: 'delete',
                                                                    title: `Xóa chuyên ngành`,
                                                                });
                                                            }}
                                                        />
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {!isFetchMajorsLoading &&
                    ((debouncedMajorSearch && (majorsData?.totalRecords ?? 0) > 0) ||
                        (!debouncedMajorSearch && ((tabOpened === 0 ? majorsStore?.totalRecords : majorsStoreDeleted?.totalRecords) ?? 0) > 0)) && (
                        <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0 flex items-center">
                                <span className="text-sm text-gray-500 text-nowrap">
                                    Tổng số bản ghi:{' '}
                                    {debouncedMajorSearch ||
                                    pageSize > ((tabOpened === 0 ? majorsStore?.totalRecords : majorsStoreDeleted?.totalRecords) ?? 0)
                                        ? majorsData?.totalRecords ?? (tabOpened === 0 ? majorsStore?.totalRecords : majorsStoreDeleted?.totalRecords) ?? 0
                                        : (tabOpened === 0 ? majorsStore?.totalRecords : majorsStoreDeleted?.totalRecords) ?? 0}
                                </span>
                                <div className="ml-2 inline-block">
                                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange} disabled={isFetchMajorsLoading}>
                                        <SelectTrigger className="h-8 w-[100px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pageSize_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {((debouncedMajorSearch && (majorsData?.totalRecords ?? 0) > pageSize) ||
                                (!debouncedMajorSearch &&
                                    ((tabOpened === 0 ? majorsStore?.totalRecords : majorsStoreDeleted?.totalRecords) ?? 0) > pageSize)) && (
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                                aria-label="Go to previous page"
                                            />
                                        </PaginationItem>
                                        {renderPaginationItems()}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => {
                                                    const currentData = tabOpened === 0 ? majorsStore : majorsStoreDeleted;
                                                    const totalRecords =
                                                        debouncedMajorSearch || pageSize > (currentData?.totalRecords ?? 0)
                                                            ? majorsData?.totalRecords ?? currentData?.totalRecords ?? 0
                                                            : currentData?.totalRecords ?? 0;
                                                    const totalPages = Math.ceil(totalRecords / pageSize);
                                                    const nextPage = Math.min(currentPage + 1, totalPages);
                                                    const currentReduxData = tabOpened === 0 ? majorsStore.data : majorsStoreDeleted.data;

                                                    if (totalRecords > currentReduxData.length) {
                                                        setCurrentPage(nextPage);
                                                        setTimeout(() => {
                                                            refetchMajors();
                                                        }, 0);
                                                    } else {
                                                        setCurrentPage(nextPage);
                                                    }
                                                }}
                                                className={getIsLastPage() ? 'pointer-events-none opacity-50' : ''}
                                                aria-label="Go to next page"
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    )}
            </div>
            {optionDialog && (
                <MajorDiaLog
                    open={!!optionDialog}
                    major={majorSelected as IMajor}
                    mode={optionDialog.option as 'create' | 'edit' | 'delete' | 'delete-soft' | 'restore'}
                    onClose={() => setOptionDialog(null)}
                    onSuccess={() => {
                        setOptionDialog(null);
                    }}
                />
            )}
        </div>
    );
}
