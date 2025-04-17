'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Edit, FileInput, FileOutput, Layers, Loader2, Plus, Repeat, Search, SearchIcon, Trash, Trash2 } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { IClass, IFaculty, IResponse, IResponseList } from '@/types';
import TableRowSkeleton from '@/components/table-row-skeleton';
import ButtonHover from '@/components/ButtonHover';
import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';
import FacultySelect from '../../../components/FacultySelect';
import MajorSelect from '../../../components/MajorSelect';
import LecturerSelect from '../lecturers/LecturerSelect';
import ClassDiaLog from './ClassDiaLog';
import { classService } from '@/services/classService';
import { setClasses, setClassesDeleted, setCreateClass, setDeleteSoftClass, setRestoreClass } from '@/redux/slices/class.slice';

const pageSize_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

export default function ClassesPage() {
    const [prevPageSize, setPrevPageSize] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabOpened, setTabOpened] = useState(0);
    const [searchClass, setSearchClass] = useState('');
    const debouncedClassSearch = useDebounce(searchClass, 500);
    const [facultySeleted, setFacultySelected] = useState('all');
    const [majorSeleted, setMajorSelected] = useState('all');
    const [lecturerSeleted, setLecturerSelected] = useState('all');
    const dispatch = useAppDispatch();
    const { classesStore, classesStoreDeleted } = useAppSelector((state) => {
        return state.localStorage.class || {
            classesStore: { data: [], totalRecords: 0, pageNumber: 0, pageSize: 0 },
            classesStoreDeleted: { data: [], totalRecords: 0, pageNumber: 0, pageSize: 0 }
        };
    });
    const [classSelected, setClassSelected] = useState<IClass | null>(null);
    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);

    const {
        data: classesData,
        isLoading: isFetchClassesLoading,
        isSuccess: isFetchClassesSuccess,
        refetch: refetchClasses,
    } = useQuery<IResponseList<IClass>>({
        queryKey: ['classes', currentPage, pageSize, tabOpened, debouncedClassSearch, facultySeleted, majorSeleted, lecturerSeleted],
        queryFn: () =>
            classService.getAll({
                pageNumber: currentPage,
                pageSize: pageSize,
                search: debouncedClassSearch,
                isDeleted: tabOpened === 0 ? false : true,
                facultyId: facultySeleted === 'all' ? undefined : facultySeleted,
                majorId: majorSeleted === 'all' ? undefined : majorSeleted,
                lecturer_id: lecturerSeleted === 'all' ? undefined : lecturerSeleted,
            }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled:
            !!debouncedClassSearch ||
            (tabOpened === 0 && classesStore?.totalRecords <= 0) ||
            (tabOpened === 1 && classesStoreDeleted?.totalRecords <= 0) ||
            facultySeleted !== 'all' ||
            majorSeleted !== 'all' ||
            lecturerSeleted !== 'all',
    });

    useEffect(() => {
        if (isFetchClassesSuccess) {
            if (tabOpened === 0) {
                dispatch(
                    setClasses({
                        ...classesData,
                        filtered: facultySeleted !== 'all' || majorSeleted !== 'all' || lecturerSeleted !== 'all',
                    }),
                );
            } else {
                dispatch(setClassesDeleted(classesData));
            }
        }
    }, [isFetchClassesSuccess, classesData, debouncedClassSearch, facultySeleted, majorSeleted, lecturerSeleted]);

    useEffect(() => {
        if (prevPageSize < pageSize) {
            if (pageSize > classesStore?.totalRecords || pageSize > classesStoreDeleted?.totalRecords) {
                refetchClasses();
            }
        }
    }, [pageSize]);

    const handlePageSizeChange = (value: string) => {
        setPrevPageSize(pageSize);
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const dataDisplayed = useMemo(() => {
        if (facultySeleted !== 'all' || majorSeleted !== 'all' || lecturerSeleted !== 'all' || debouncedClassSearch) {
            if (classesData?.data) {
                if (classesData.data.length === 0) {
                    return [];
                }

                return classesData.data.map((cls, index) => ({
                    ...cls,
                    index: (currentPage - 1) * pageSize + index + 1,
                }));
            }
            return [];
        }

        const currentData = tabOpened === 0 ? classesStore : classesStoreDeleted;
        if (!isFetchClassesLoading && currentData?.data && currentData.data.length > 0) {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, currentData.data.length);
            return currentData.data.slice(startIndex, endIndex).map((cls: IClass, index: number) => ({
                ...cls,
                index: startIndex + index + 1,
            }));
        }

        if (classesData?.data) {
            if (classesData.data.length === 0) {
                return [];
            }

            return classesData.data.map((cls, index) => ({
                ...cls,
                index: (currentPage - 1) * pageSize + index + 1,
            }));
        }

        return [];
    }, [classesData, classesStore, classesStoreDeleted, tabOpened, currentPage, pageSize, debouncedClassSearch, isFetchClassesLoading]);

    const getIsLastPage = () => {
        const currentData = tabOpened === 0 ? classesStore : classesStoreDeleted;
        const totalRecords =
            debouncedClassSearch || pageSize > (currentData?.totalRecords ?? 0)
                ? classesData?.totalRecords ?? currentData?.totalRecords ?? 0
                : currentData?.totalRecords ?? 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return currentPage === totalPages;
    };

    const renderPaginationItems = () => {
        const items = [];
        const currentData = tabOpened === 0 ? classesStore : classesStoreDeleted;
        const totalRecords =
            debouncedClassSearch || pageSize > (currentData?.totalRecords ?? 0)
                ? classesData?.totalRecords ?? currentData?.totalRecords ?? 0
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
                <h2 className="text-2xl font-bold">Quản lý lớp học</h2>
                <div className="flex items-center gap-2">
                    <ButtonHover
                        title="Thêm lớp học"
                        variant="default"
                        leftIcon={<Plus className="w-6 h-6" />}
                        onClick={() => {
                            setOptionDialog({
                                option: 'create',
                                title: 'Thêm lớp học',
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
                            <span>Lớp học</span>
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
                            {isFetchClassesLoading && searchClass ? (
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin">
                                    <Loader2 />
                                </div>
                            ) : (
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            )}
                            <Input
                                className="pl-10 pr-4 w-full md:w-60"
                                placeholder="Tìm kiếm..."
                                value={searchClass}
                                onChange={(e) => setSearchClass(e.target.value)}
                            />
                        </div>

                        <FacultySelect
                            value={facultySeleted}
                            onSelectValue={(value) => {
                                setFacultySelected(value);
                                setCurrentPage(1);
                                if (value !== facultySeleted) {
                                    setMajorSelected('all');
                                }
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

                        {/* <LecturerSelect
                            value={lecturerSeleted}
                            onSelectValue={(value) => {
                                setLecturerSelected(value);
                                setCurrentPage(1);
                            }}
                            facultyId={facultySeleted === 'all' ? undefined : facultySeleted}
                            majorId={majorSeleted === 'all' ? undefined : majorSeleted}
                        /> */}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table className="whitespace-nowrap">
                        <TableHeader>
                            <TableRow>
                                <TableHead>STT</TableHead>
                                <TableHead>Tên lớp</TableHead>
                                <TableHead>Mã lớp</TableHead>
                                <TableHead>Khoa</TableHead>
                                <TableHead>Chuyên ngành</TableHead>
                                <TableHead>Giảng viên phụ trách</TableHead>
                                <TableHead className="text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetchClassesLoading ? (
                                <TableRowSkeleton row={4} cell={7} />
                            ) : dataDisplayed && dataDisplayed.length > 0 ? (
                                dataDisplayed.map((cls: IClass, index: number) => (
                                    <TableRow key={cls.id}>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{cls.name}</TableCell>
                                        <TableCell>{cls.class_code}</TableCell>
                                        <TableCell>{cls.major?.faculty?.name}</TableCell>
                                        <TableCell>{cls.major?.name}</TableCell>
                                        <TableCell>{cls.lecturer?.user?.fullName || 'Chưa phân công'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-center gap-2">
                                                {tabOpened === 0 && (
                                                    <React.Fragment>
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Edit className="w-6 h-6 text-blue-500" />}
                                                            suggestText={`Chỉnh sửa`}
                                                            onClick={() => {
                                                                setClassSelected(cls);
                                                                setOptionDialog({
                                                                    option: 'update',
                                                                    title: `Chỉnh sửa lớp học`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa tạm thời`}
                                                            onClick={() => {
                                                                setClassSelected(cls);
                                                                setOptionDialog({
                                                                    option: 'delete-soft',
                                                                    title: `Xóa lớp học`,
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
                                                                setClassSelected(cls);
                                                                setOptionDialog({
                                                                    option: 'restore',
                                                                    title: `Khôi phục lớp học`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash2 className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa vĩnh viễn`}
                                                            onClick={() => {
                                                                setClassSelected(cls);
                                                                setOptionDialog({
                                                                    option: 'delete',
                                                                    title: `Xóa lớp học`,
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
                                    <TableCell colSpan={7} className="text-center py-6">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {!isFetchClassesLoading &&
                    ((debouncedClassSearch && (classesData?.totalRecords ?? 0) > 0) ||
                        (!debouncedClassSearch && ((tabOpened === 0 ? classesStore?.totalRecords : classesStoreDeleted?.totalRecords) ?? 0) > 0)) && (
                        <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0 flex items-center">
                                <span className="text-sm text-gray-500 text-nowrap">
                                    Tổng số bản ghi:{' '}
                                    {debouncedClassSearch ||
                                    pageSize > ((tabOpened === 0 ? classesStore?.totalRecords : classesStoreDeleted?.totalRecords) ?? 0)
                                        ? classesData?.totalRecords ??
                                          (tabOpened === 0 ? classesStore?.totalRecords : classesStoreDeleted?.totalRecords) ??
                                          0
                                        : (tabOpened === 0 ? classesStore?.totalRecords : classesStoreDeleted?.totalRecords) ?? 0}
                                </span>
                                <div className="ml-2 inline-block">
                                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange} disabled={isFetchClassesLoading}>
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

                            {((debouncedClassSearch && (classesData?.totalRecords ?? 0) > pageSize) ||
                                (!debouncedClassSearch &&
                                    ((tabOpened === 0 ? classesStore?.totalRecords : classesStoreDeleted?.totalRecords) ?? 0) > pageSize)) && (
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
                                                    if (!getIsLastPage()) {
                                                        setCurrentPage((prev) => prev + 1);
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
                <ClassDiaLog
                    open={!!optionDialog}
                    class={classSelected || undefined}
                    mode={optionDialog.option as any}
                    onClose={() => {
                        setOptionDialog(null);
                        setClassSelected(null);
                    }}
                />
            )}
        </div>
    );
}