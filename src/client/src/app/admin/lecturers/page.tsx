'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Edit, FileInput, FileOutput, Layers, Loader2, Plus, Repeat, Search, SearchIcon, Trash, Trash2 } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { facultyService } from '@/services/facultyService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { lecturerService } from '@/services/lecturerService';
import { setCreateLecturer, setDeleteSoftLecturer, setLecturers, setLecturersDeleted, setRestoreLecturer } from '@/redux/slices/lecturer.slice';
import LecturerDiaLog from './LecturerDiaLog';
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
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useDebounce from '@/hooks/useDebounce';
import { IFaculty, ILecturer, IResponse, IResponseList } from '@/types';
import { setFaculties } from '@/redux/slices/faculty.slice';
import TableRowSkeleton from '@/components/TableRowSkeleton';
import ButtonHover from '@/components/ButtonHover';
import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';
import FacultySelect from '../faculty/FacultySelect';
import MajorSelect from '../majors/MajorSelect';

const PAGE_SIZE_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

const GENDER_OPTIONS = [
    { value: '0', label: 'Nam' },
    { value: '1', label: 'Nữ' },
    { value: '2', label: 'Khác' },
];

export default function LecturersPage() {
    const [prevPageSize, setPrevPageSize] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabOpened, setTabOpened] = useState(0);
    const [searchLecturer, setSearchLecturer] = useState('');
    const debouncedLecturerSearch = useDebounce(searchLecturer, 500);
    const [facultySeleted, setFacultySelected] = useState('all');
    const [majorSeleted, setMajorSelected] = useState('all');
    const dispatch = useAppDispatch();
    const { lecturersStore, lecturersStoreDeleted } = useAppSelector((state) => state.localStorage.lecturer);
    const [lecturerSelected, setLecturerSelected] = useState<ILecturer | null>(null);
    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);

    const {
        data: lecturersData,
        isLoading: isFetchLecturersLoading,
        isSuccess: isFetchLecturersSuccess,
        refetch: refetchLecturers,
    } = useQuery<IResponseList<ILecturer>>({
        queryKey: ['lecturers', currentPage, pageSize, tabOpened, debouncedLecturerSearch, facultySeleted],
        queryFn: () =>
            lecturerService.getAll({
                page_number: currentPage,
                page_size: pageSize,
                search: debouncedLecturerSearch,
                is_deleted: tabOpened === 0 ? false : true,
                faculty_id: facultySeleted === 'all' ? undefined : facultySeleted,
                major_id: majorSeleted === 'all' ? undefined : majorSeleted,
            }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled:
            !!debouncedLecturerSearch ||
            (tabOpened === 0 && lecturersStore.total_records <= 0) ||
            (tabOpened === 1 && lecturersStoreDeleted.total_records <= 0) ||
            facultySeleted !== 'all',
    });

    useEffect(() => {
        if (isFetchLecturersSuccess) {
            if (tabOpened === 0) {
                dispatch(
                    setLecturers({
                        ...lecturersData,
                        filtered: facultySeleted !== 'all',
                    }),
                );
            } else {
                dispatch(setLecturersDeleted(lecturersData));
            }
        }
    }, [isFetchLecturersSuccess, lecturersData, debouncedLecturerSearch, facultySeleted]);

    useEffect(() => {
        if (prevPageSize < pageSize) {
            if (pageSize > lecturersStore.total_records || pageSize > lecturersStoreDeleted.total_records) {
                refetchLecturers();
            }
        }
    }, [pageSize]);

    const handlePageSizeChange = (value: string) => {
        setPrevPageSize(pageSize);
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const dataDisplayed = useMemo(() => {
        if (facultySeleted !== 'all' || debouncedLecturerSearch) {
            if (lecturersData?.data) {
                if (lecturersData.data.length === 0) {
                    return [];
                }

                return lecturersData.data.map((lecturer, index) => ({
                    ...lecturer,
                    index: (currentPage - 1) * pageSize + index + 1,
                }));
            }
            return [];
        }

        const currentData = tabOpened === 0 ? lecturersStore : lecturersStoreDeleted;
        if (!isFetchLecturersLoading && currentData?.data && currentData.data.length > 0) {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, currentData.data.length);
            return currentData.data.slice(startIndex, endIndex).map((lecturer, index) => ({
                ...lecturer,
                index: startIndex + index + 1,
            }));
        }

        if (lecturersData?.data) {
            if (lecturersData.data.length === 0) {
                return [];
            }

            return lecturersData.data.map((lecturer, index) => ({
                ...lecturer,
                index: (currentPage - 1) * pageSize + index + 1,
            }));
        }

        return [];
    }, [lecturersData, lecturersStore, lecturersStoreDeleted, tabOpened, currentPage, pageSize, debouncedLecturerSearch, isFetchLecturersLoading]);

    const getIsLastPage = () => {
        const currentData = tabOpened === 0 ? lecturersStore : lecturersStoreDeleted;
        const totalRecords =
            debouncedLecturerSearch || pageSize > (currentData?.total_records ?? 0)
                ? lecturersData?.total_records ?? currentData?.total_records ?? 0
                : currentData?.total_records ?? 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return currentPage === totalPages;
    };

    const renderPaginationItems = () => {
        const items = [];
        const currentData = tabOpened === 0 ? lecturersStore : lecturersStoreDeleted;
        const totalRecords =
            debouncedLecturerSearch || pageSize > (currentData?.total_records ?? 0)
                ? lecturersData?.total_records ?? currentData?.total_records ?? 0
                : currentData?.total_records ?? 0;
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
                <h2 className="text-2xl font-bold">Quản lý giảng viên</h2>
                <div className="flex items-center gap-2">
                    <ButtonHover
                        title="Thêm giảng viên"
                        variant="default"
                        leftIcon={<Plus className="w-6 h-6" />}
                        onClick={() => {
                            setOptionDialog({
                                option: 'create',
                                title: 'Thêm giảng viên',
                            });
                        }}
                    />

                    <ButtonHover
                        title="Nhập file"
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

                    <ButtonHover
                        title="Xuất file"
                        variant="outline"
                        leftIcon={<FileOutput className="w-6 h-6" />}
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
                            <span>Giảng viên</span>
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
                            {isFetchLecturersLoading && searchLecturer ? (
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin">
                                    <Loader2 />
                                </div>
                            ) : (
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            )}
                            <Input
                                className="pl-10 pr-4 w-full md:w-60"
                                placeholder="Tìm kiếm..."
                                value={searchLecturer}
                                onChange={(e) => setSearchLecturer(e.target.value)}
                            />
                        </div>

                        <FacultySelect
                            value={facultySeleted}
                            onSelectValue={(value) => {
                                setFacultySelected(value);
                                setCurrentPage(1);
                            }}
                        />

                        <MajorSelect
                            value={majorSeleted}
                            onSelectValue={(value) => {
                                setMajorSelected(value);
                                setCurrentPage(1);
                            }}
                            facultyId={facultySeleted === 'all' ? undefined : facultySeleted}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table className="whitespace-nowrap">
                        <TableHeader>
                            <TableRow>
                                <TableHead>STT</TableHead>
                                <TableHead>Tên giảng viên</TableHead>
                                <TableHead>Mã giảng viên</TableHead>
                                <TableHead>Khoa</TableHead>
                                <TableHead className="text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetchLecturersLoading ? (
                                <TableRowSkeleton />
                            ) : dataDisplayed && dataDisplayed.length > 0 ? (
                                dataDisplayed.map((lecturer: ILecturer, index) => (
                                    <TableRow key={lecturer.id}>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{lecturer.user?.full_name}</TableCell>
                                        <TableCell>{lecturer.lecturer_id}</TableCell>
                                        <TableCell>{lecturer.faculty?.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-center gap-2">
                                                {tabOpened === 0 && (
                                                    <React.Fragment>
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Edit className="w-6 h-6 text-blue-500" />}
                                                            suggestText={`Chỉnh sửa`}
                                                            onClick={() => {
                                                                setLecturerSelected(lecturer);
                                                                setOptionDialog({
                                                                    option: 'edit',
                                                                    title: `Chỉnh sửa giảng viên`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa tạm thời`}
                                                            onClick={() => {
                                                                setLecturerSelected(lecturer);
                                                                setOptionDialog({
                                                                    option: 'delete-soft',
                                                                    title: `Xóa giảng viên`,
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
                                                                setLecturerSelected(lecturer);
                                                                setOptionDialog({
                                                                    option: 'restore',
                                                                    title: `Khôi phục giảng viên`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash2 className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa vĩnh viễn`}
                                                            onClick={() => {
                                                                setLecturerSelected(lecturer);
                                                                setOptionDialog({
                                                                    option: 'delete',
                                                                    title: `Xóa giảng viên`,
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
                                    <TableCell colSpan={5} className="text-center py-6">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {!isFetchLecturersLoading &&
                    ((debouncedLecturerSearch && (lecturersData?.total_records ?? 0) > 0) ||
                        (!debouncedLecturerSearch && ((tabOpened === 0 ? lecturersStore?.total_records : lecturersStoreDeleted?.total_records) ?? 0) > 0)) && (
                        <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0 flex items-center">
                                <span className="text-sm text-gray-500 text-nowrap">
                                    Tổng số bản ghi:{' '}
                                    {debouncedLecturerSearch ||
                                    pageSize > ((tabOpened === 0 ? lecturersStore?.total_records : lecturersStoreDeleted?.total_records) ?? 0)
                                        ? lecturersData?.total_records ??
                                          (tabOpened === 0 ? lecturersStore?.total_records : lecturersStoreDeleted?.total_records) ??
                                          0
                                        : (tabOpened === 0 ? lecturersStore?.total_records : lecturersStoreDeleted?.total_records) ?? 0}
                                </span>
                                <div className="ml-2 inline-block">
                                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange} disabled={isFetchLecturersLoading}>
                                        <SelectTrigger className="h-8 w-[100px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAGE_SIZE_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {((debouncedLecturerSearch && (lecturersData?.total_records ?? 0) > pageSize) ||
                                (!debouncedLecturerSearch &&
                                    ((tabOpened === 0 ? lecturersStore?.total_records : lecturersStoreDeleted?.total_records) ?? 0) > pageSize)) && (
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
                                                    const currentData = tabOpened === 0 ? lecturersStore : lecturersStoreDeleted;
                                                    const totalRecords =
                                                        debouncedLecturerSearch || pageSize > (currentData?.total_records ?? 0)
                                                            ? lecturersData?.total_records ?? currentData?.total_records ?? 0
                                                            : currentData?.total_records ?? 0;
                                                    const totalPages = Math.ceil(totalRecords / pageSize);
                                                    const nextPage = Math.min(currentPage + 1, totalPages);
                                                    const currentReduxData = tabOpened === 0 ? lecturersStore.data : lecturersStoreDeleted.data;

                                                    if (totalRecords > currentReduxData.length) {
                                                        setCurrentPage(nextPage);
                                                        setTimeout(() => {
                                                            refetchLecturers();
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
                <LecturerDiaLog
                    open={!!optionDialog}
                    mode={optionDialog.option as 'create' | 'update' | 'delete' | 'view' | 'restore'}
                    lecturer={lecturerSelected || undefined}
                    onClose={() => setOptionDialog(null)}
                    onSuccess={refetchLecturers}
                />
            )}
            <ToastContainer />
        </div>
    );
}
