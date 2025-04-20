'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, FileInput, Plus, Repeat, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import FacultyDiaLog from './FacultyDiaLog';
import useDebounce from '@/hooks/useDebounce';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { facultyService } from '@/services/facultyService';
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
import TableRowSkeleton from '@/components/table-row-skeleton';
import ButtonHover from '@/components/ButtonHover';

const pageSize_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

interface IFaculty {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
}

interface IPaginatedResponse {
    items: IFaculty[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export default function FacultyPage() {
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabOpened, setTabOpened] = useState(0); // 0: active faculties, 1: deleted faculties
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearch = useDebounce(searchValue, 500);
    const [formFaculty, setFormFaculty] = useState<IFaculty | undefined>(undefined);
    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);

    const {
        isLoading,
        data: facultiesData,
        refetch,
    } = useQuery<IPaginatedResponse>({
        queryKey: ['faculties', currentPage, pageSize, tabOpened, debouncedSearch],
        queryFn: () =>
            facultyService.getAll({
                pageNumber: currentPage,
                pageSize: pageSize,
                isDeleted: tabOpened === 1,
                search: debouncedSearch || undefined,
            }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const renderPaginationItems = () => {
        const items = [];
        const totalPages = facultiesData?.totalPages || 1;
        const current = currentPage;
        const delta = 2;

        if (totalPages <= 1) return [];

        const start = Math.max(1, current - delta);
        const end = Math.min(totalPages, current + delta);

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
                <h2 className="text-2xl font-bold">Quản lý khoa</h2>
                <div className="flex items-center gap-2">
                    <ButtonHover
                        title="Thêm khoa"
                        variant="default"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => {
                            setFormFaculty(undefined);
                            setOptionDialog({
                                option: 'create',
                                title: 'Thêm khoa mới',
                            });
                        }}
                    />
                    <ButtonHover
                        title="Xuất file"
                        variant="outline"
                        leftIcon={<FileInput className="h-4 w-4" />}
                        onClick={() => {
                            toast.info('Chức năng này đang được phát triển', {
                                position: 'top-right',
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: 'light',
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
                            <span>Khoa</span>
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

                    <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                className="pl-10 pr-4 w-full md:w-60"
                                placeholder="Tìm kiếm..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table className="whitespace-nowrap">
                        <TableHeader>
                            <TableRow>
                                <TableHead>STT</TableHead>
                                <TableHead>Tên khoa</TableHead>
                                <TableHead>Mã khoa</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRowSkeleton row={4} cell={4} />
                            ) : facultiesData?.items && facultiesData.items.length > 0 ? (
                                facultiesData.items.map((faculty: IFaculty, index: number) => (
                                    <TableRow key={faculty.id}>
                                        <TableCell>{(facultiesData.pageNumber - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{faculty.name}</TableCell>
                                        <TableCell>{faculty.code}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {tabOpened === 0 ? (
                                                    <React.Fragment>
                                                        <ButtonHover
                                                            suggestText="Chỉnh sửa"
                                                            variant="ghost"
                                                            leftIcon={<Edit className="h-4 w-4 text-blue-500" />}
                                                            onClick={() => {
                                                                setFormFaculty(faculty);
                                                                setOptionDialog({
                                                                    option: 'edit',
                                                                    title: `Chỉnh sửa khoa ${faculty.name}`,
                                                                });
                                                            }}
                                                        />

                                                        <ButtonHover
                                                            suggestText="Xoá tạm thời"
                                                            variant="ghost"
                                                            leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
                                                            onClick={() => {
                                                                setFormFaculty(faculty);
                                                                setOptionDialog({
                                                                    option: 'delete-soft',
                                                                    title: `Xóa khoa ${faculty.name}`,
                                                                });
                                                            }}
                                                        />
                                                    </React.Fragment>
                                                ) : (
                                                    <React.Fragment>
                                                        <ButtonHover
                                                            suggestText="Khôi phục"
                                                            variant="ghost"
                                                            leftIcon={<Repeat className="h-4 w-4 text-green-500" />}
                                                            onClick={() => {
                                                                setFormFaculty(faculty);
                                                                setOptionDialog({
                                                                    option: 'restore',
                                                                    title: `Khôi phục khoa ${faculty.name}`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            suggestText="Xoá vĩnh viễn"
                                                            variant="ghost"
                                                            leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
                                                            onClick={() => {
                                                                setFormFaculty(faculty);
                                                                setOptionDialog({
                                                                    option: 'delete',
                                                                    title: `Xóa khoa ${faculty.name}`,
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

                {!isLoading && facultiesData && facultiesData.totalCount > 0 && (
                    <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0 flex items-center">
                            <span className="text-sm text-gray-500 text-nowrap">
                                Tổng số bản ghi: {facultiesData.totalCount}
                            </span>
                            <div className="ml-2 inline-block">
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange} disabled={isLoading}>
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

                        {facultiesData.totalCount > pageSize && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className={!facultiesData.hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
                                            aria-label="Go to previous page"
                                        />
                                    </PaginationItem>
                                    {renderPaginationItems()}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                            className={!facultiesData.hasNextPage ? 'pointer-events-none opacity-50' : ''}
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
                <FacultyDiaLog
                    open={!!optionDialog}
                    faculty={formFaculty}
                    mode={optionDialog.option as 'create' | 'edit' | 'delete' | 'delete-soft' | 'restore'}
                    onClose={() => setOptionDialog(null)}
                    onSuccess={() => {
                        setOptionDialog(null);
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
