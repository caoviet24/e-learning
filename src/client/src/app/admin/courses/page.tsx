'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Edit, FileInput, FileOutput, Loader2, Plus, Repeat, Search, Trash, Trash2 } from 'lucide-react';
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
import { useAppDispatch } from '@/redux/store';
import useDebounce from '@/hooks/useDebounce';
import { IResponseList } from '@/types';
import TableRowSkeleton from '@/components/table-row-skeleton';
import ButtonHover from '@/components/ButtonHover';
import FacultySelect from '../../../components/FacultySelect';
import MajorSelect from '../../../components/MajorSelect';
import convertTimeVN from '@/utils/ConvertTimeVN';
import { courseService } from '@/services/courseService';
import Image from 'next/image';
import CourseDiaLog from './CourseDiaLog';

// Define a type for ICourse
interface ICourse {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    status: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    faculty: {
        id: string;
        name: string;
    };
    major: {
        id: string;
        name: string;
    };
    lecturer?: {
        id: string;
        user: {
            fullName: string;
        }
    };
    views: number;
    rating: number;
}

const pageSize_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

const STATUS_OPTIONS = {
    DRAFT: 'Bản nháp',
    PUBLISHED: 'Đã xuất bản',
    ARCHIVED: 'Đã lưu trữ',
    PENDING: 'Chờ duyệt',
} as const;

type StatusKey = keyof typeof STATUS_OPTIONS;

export default function CoursesPage() {
    const [prevPageSize, setPrevPageSize] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabOpened, setTabOpened] = useState(0);
    const [searchCourse, setSearchCourse] = useState('');
    const debouncedCourseSearch = useDebounce(searchCourse, 500);
    const [facultySeleted, setFacultySelected] = useState('all');
    const [majorSeleted, setMajorSelected] = useState('all');
    useAppDispatch(); // Keep the import but don't use the variable if not needed
    const [courseSelected, setCourseSelected] = useState<ICourse | null>(null);
    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);

    // Add state for courses
    const [coursesData, setCoursesData] = useState<IResponseList<ICourse> | null>(null);
    const [deletedCoursesData, setDeletedCoursesData] = useState<IResponseList<ICourse> | null>(null);

    const {
        data: fetchedCoursesData,
        isLoading: isFetchCoursesLoading,
        isSuccess: isFetchCoursesSuccess,
        refetch: refetchCourses,
    } = useQuery<IResponseList<ICourse>>({
        queryKey: ['courses', currentPage, pageSize, tabOpened, debouncedCourseSearch, facultySeleted, majorSeleted],
        queryFn: () =>
            courseService.getAll({
                pageNumber: currentPage,
                pageSize: pageSize,
                search: debouncedCourseSearch,
                facultyId: facultySeleted === 'all' ? undefined : facultySeleted,
                majorId: majorSeleted === 'all' ? undefined : majorSeleted,
                isDeleted: tabOpened === 0 ? false : true,
                type: 'with-author'
            }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isFetchCoursesSuccess && fetchedCoursesData) {
            if (tabOpened === 0) {
                setCoursesData(fetchedCoursesData);
            } else {
                setDeletedCoursesData(fetchedCoursesData);
            }
        }
    }, [isFetchCoursesSuccess, fetchedCoursesData, tabOpened]);

    useEffect(() => {
        if (prevPageSize < pageSize) {
            refetchCourses();
        }
    }, [pageSize]);

    const handlePageSizeChange = (value: string) => {
        setPrevPageSize(pageSize);
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const dataDisplayed = useMemo(() => {
        const currentData = tabOpened === 0 ? coursesData : deletedCoursesData;
        
        if (!currentData?.data) return [];

        return currentData.data.map((course, index) => ({
            ...course,
            index: (currentPage - 1) * pageSize + index + 1,
        }));
    }, [coursesData, deletedCoursesData, tabOpened, currentPage, pageSize]);

    const getIsLastPage = () => {
        const currentData = tabOpened === 0 ? coursesData : deletedCoursesData;
        if (!currentData) return true;

        const totalCount = currentData.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        return currentPage === totalPages;
    };

    const renderPaginationItems = () => {
        const items = [];
        const currentData = tabOpened === 0 ? coursesData : deletedCoursesData;
        if (!currentData) return [];

        const totalCount = currentData.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
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

    // Mutations for course operations
    const deleteSoftMutation = useMutation({
        mutationFn: (id: string) => courseService.deleteSoft(id),
        onSuccess: () => {
            toast.success('Xóa khóa học thành công', {
                position: 'top-right',
                autoClose: 2000,
            });
            refetchCourses();
        },
        onError: () => {
            toast.error('Xóa khóa học thất bại', {
                position: 'top-right',
                autoClose: 2000,
            });
        },
    });

    const restoreMutation = useMutation({
        mutationFn: (id: string) => courseService.restore(id),
        onSuccess: () => {
            toast.success('Khôi phục khóa học thành công', {
                position: 'top-right',
                autoClose: 2000,
            });
            refetchCourses();
        },
        onError: () => {
            toast.error('Khôi phục khóa học thất bại', {
                position: 'top-right',
                autoClose: 2000,
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => courseService.deleteCourse(id),
        onSuccess: () => {
            toast.success('Xóa vĩnh viễn khóa học thành công', {
                position: 'top-right',
                autoClose: 2000,
            });
            refetchCourses();
        },
        onError: () => {
            toast.error('Xóa vĩnh viễn khóa học thất bại', {
                position: 'top-right',
                autoClose: 2000,
            });
        },
    });

    const handleDialogConfirm = async () => {
        if (!courseSelected) return;

        switch (optionDialog?.option) {
            case 'delete-soft':
                await deleteSoftMutation.mutateAsync(courseSelected.id);
                break;
            case 'restore':
                await restoreMutation.mutateAsync(courseSelected.id);
                break;
            case 'delete':
                await deleteMutation.mutateAsync(courseSelected.id);
                break;
        }

        setOptionDialog(null);
        setCourseSelected(null);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý khóa học</h2>
                <div className="flex items-center gap-2">
                    <ButtonHover
                        title="Thêm khóa học"
                        variant="default"
                        leftIcon={<Plus className="w-6 h-6" />}
                        onClick={() => {
                            setOptionDialog({
                                option: 'create',
                                title: 'Thêm khóa học',
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
                            <span>Khóa học</span>
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
                            {isFetchCoursesLoading && searchCourse ? (
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin">
                                    <Loader2 />
                                </div>
                            ) : (
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            )}
                            <Input
                                className="pl-10 pr-4 w-full md:w-60"
                                placeholder="Tìm kiếm..."
                                value={searchCourse}
                                onChange={(e) => setSearchCourse(e.target.value)}
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
                                <TableHead>Ảnh</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Giảng viên</TableHead>
                                <TableHead>Khoa</TableHead>
                                <TableHead>Chuyên ngành</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Lượt xem</TableHead>
                                <TableHead>Đánh giá</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetchCoursesLoading ? (
                                <TableRowSkeleton row={4} cell={11} />
                            ) : dataDisplayed && dataDisplayed.length > 0 ? (
                                dataDisplayed.map((course: ICourse & { index: number }) => (
                                    <TableRow key={course.id}>
                                        <TableCell>{course.index}</TableCell>
                                        <TableCell>
                                            <div className="relative h-12 w-16 overflow-hidden rounded">
                                                <Image 
                                                    src={course.thumbnail || '/images/placeholder.jpg'} 
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>{course.title}</TableCell>
                                        <TableCell>{course.lecturer?.user.fullName || 'N/A'}</TableCell>
                                        <TableCell>{course.faculty.name}</TableCell>
                                        <TableCell>{course.major.name}</TableCell>
                                        <TableCell>{course.status && (STATUS_OPTIONS[course.status as StatusKey] || course.status)}</TableCell>
                                        <TableCell>{course.views}</TableCell>
                                        <TableCell>{course.rating}/5</TableCell>
                                        <TableCell>{convertTimeVN(course.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-center gap-2">
                                                {tabOpened === 0 && (
                                                    <React.Fragment>
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Edit className="w-6 h-6 text-blue-500" />}
                                                            suggestText={`Chỉnh sửa`}
                                                            onClick={() => {
                                                                setCourseSelected(course);
                                                                setOptionDialog({
                                                                    option: 'update',
                                                                    title: `Chỉnh sửa khóa học`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa tạm thời`}
                                                            onClick={() => {
                                                                setCourseSelected(course);
                                                                setOptionDialog({
                                                                    option: 'delete-soft',
                                                                    title: `Xóa khóa học`,
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
                                                                setCourseSelected(course);
                                                                setOptionDialog({
                                                                    option: 'restore',
                                                                    title: `Khôi phục khóa học`,
                                                                });
                                                            }}
                                                        />
                                                        <ButtonHover
                                                            variant="ghost"
                                                            leftIcon={<Trash2 className="w-6 h-6 text-red-500" />}
                                                            suggestText={`Xóa vĩnh viễn`}
                                                            onClick={() => {
                                                                setCourseSelected(course);
                                                                setOptionDialog({
                                                                    option: 'delete',
                                                                    title: `Xóa vĩnh viễn khóa học`,
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
                                    <TableCell colSpan={11} className="text-center py-6">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {!isFetchCoursesLoading && ((tabOpened === 0 ? coursesData?.totalCount : deletedCoursesData?.totalCount) ?? 0) > 0 && (
                    <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0 flex items-center">
                            <span className="text-sm text-gray-500 text-nowrap">
                                Tổng số bản ghi: {(tabOpened === 0 ? coursesData?.totalCount : deletedCoursesData?.totalCount) ?? 0}
                            </span>
                            <div className="ml-2 inline-block">
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange} disabled={isFetchCoursesLoading}>
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

                        {((tabOpened === 0 ? coursesData?.totalCount : deletedCoursesData?.totalCount) ?? 0) > pageSize && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                                            disabled={currentPage === 1}
                                            aria-disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    {renderPaginationItems()}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => {
                                                if (!getIsLastPage()) {
                                                    setCurrentPage((old) => old + 1);
                                                }
                                            }}
                                            disabled={getIsLastPage()}
                                            aria-disabled={getIsLastPage()}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog for Delete/Restore */}
            {optionDialog && ['delete-soft', 'delete', 'restore'].includes(optionDialog.option) && courseSelected && (
                <Dialog open={true} onOpenChange={() => setOptionDialog(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{optionDialog.title}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            {optionDialog.option === 'delete-soft' && (
                                <p>Bạn có chắc chắn muốn xóa khóa học <strong>{courseSelected.title}</strong> không?</p>
                            )}
                            {optionDialog.option === 'delete' && (
                                <p>Bạn có chắc chắn muốn xóa vĩnh viễn khóa học <strong>{courseSelected.title}</strong> không? Hành động này không thể hoàn tác.</p>
                            )}
                            {optionDialog.option === 'restore' && (
                                <p>Bạn có chắc chắn muốn khôi phục khóa học <strong>{courseSelected.title}</strong> không?</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setOptionDialog(null)}>
                                Hủy
                            </Button>
                            <Button
                                variant={optionDialog.option.includes('delete') ? 'destructive' : 'default'}
                                onClick={handleDialogConfirm}
                                disabled={deleteSoftMutation.isPending || deleteMutation.isPending || restoreMutation.isPending}
                            >
                                {(deleteSoftMutation.isPending || deleteMutation.isPending || restoreMutation.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {optionDialog.option === 'delete-soft' && 'Xóa'}
                                {optionDialog.option === 'delete' && 'Xóa vĩnh viễn'}
                                {optionDialog.option === 'restore' && 'Khôi phục'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Dialog for Create/Edit Course */}
            {optionDialog && ['create', 'update'].includes(optionDialog.option) && (
                <CourseDiaLog
                    open={true}
                    onOpenChange={() => setOptionDialog(null)}
                    option={optionDialog.option}
                    title={optionDialog.title}
                    courseData={optionDialog.option === 'update' ? courseSelected : null}
                    onSuccess={() => {
                        refetchCourses();
                        setOptionDialog(null);
                    }}
                />
            )}

            <ToastContainer />
        </div>
    );
}