'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Edit, Layers, Plus, Repeat, Search, Trash, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { facultyService } from '@/services/facultyService';
import { setCreateFaculty, setDeleteSoftFaculty, setFaculties } from '@/redux/slices/faculty.slice';
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

const PAGE_SIZE_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

export default function FacultyPage() {
    const dispatch = useAppDispatch();
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabOpened, setTabOpened] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearch = useDebounce(searchValue, 500);
    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);
    const [formFaculty, setFormFaculty] = useState<Partial<IFaculty>>({ name: '', code: '' });

    const {
        data: facultiesData,
        isLoading,
        refetch,
    } = useQuery<{
        data: IFaculty[];
        total_records: number;
        page_number: string;
        page_size: string;
    }>({
        placeholderData: (previousData) => previousData,
        queryKey: ['faculties', currentPage, pageSize, tabOpened, debouncedSearch],
        queryFn: async () => {
            const result = await facultyService.getAll({
                page_number: currentPage,
                page_size: pageSize,
                search: debouncedSearch,
                is_deleted: tabOpened === 0 ? false : true,
            });
            dispatch(setFaculties(result.data));
            return result;
        },
    });

    const createFaculty = useMutation<IResponse<IFaculty>, Error, { name: string; code: string }>({
        mutationFn: (data) => facultyService.create(data),
        onSuccess: (res) => {
            toast.success(`Thêm khoa ${res.data?.name} thành công`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            setOptionDialog(null);
            setFormFaculty({ name: '', code: '' });
            dispatch(setCreateFaculty(res.data));
            refetch();
        },
        onError: (error) => {
            toast.error('Thêm khoa thất bại');
            console.error('Thêm khoa thất bại:', error);
        },
    });

    const handleAddFaculty = () => {
        if (!formFaculty?.name || !formFaculty?.code) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        createFaculty.mutate({
            name: formFaculty.name,
            code: formFaculty.code,
        });
    };

    const updateFaculty = useMutation({
        mutationFn: (data: any) => {
            if (!data.is_deleted) {
                return facultyService.restore(data.id);
            }
            return facultyService.update(data.id, {
                name: data.name,
                code: data.code,
                is_deleted: data.is_deleted,
            });
        },
        onSuccess: (res: IResponse<IFaculty>) => {
            toast.success(`${res?.data?.is_deleted ? 'Khôi phục' : 'Cập nhật'} khoa ${res.data?.name} thành công`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            setOptionDialog(null);
            setFormFaculty({ name: '', code: '' });
            dispatch(setDeleteSoftFaculty(res.data?.id));
            refetch();
        },
        onError: (error) => {
            toast.error('Xóa khoa thất bại');
            console.error('Xóa khoa thất bại:', error);
        },
    });

    const deleteFaculty = useMutation({
        mutationFn: (data: any) => {
            if (data?.delete) {
                return facultyService.delete(data.id);
            }
            return facultyService.deleteSoft(data.id);
        },
        onSuccess: (res: IResponse<IFaculty>) => {
            toast.success(`Xóa khoa ${res.data?.name} thành công`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            setOptionDialog(null);
            setFormFaculty({ name: '', code: '' });
            dispatch(setDeleteSoftFaculty(res.data?.id));
            refetch();
        },
        onError: (error) => {
            toast.error('Xóa khoa thất bại');
            console.error('Xóa khoa thất bại:', error);
        },
    });

    const handleEditFaculty = (faculty: IFaculty) => {
        updateFaculty.mutate({
            id: faculty.id,
            name: faculty.name,
            code: faculty.code,
        });
    };

    const handleDeleteSoftFaculty = (faculty: IFaculty) => {
        deleteFaculty.mutate({
            id: faculty.id,
            delete: false,
        });
    };

    const handleRestoreFaculty = (faculty: IFaculty) => {
        updateFaculty.mutate({
            id: faculty.id,
            is_deleted: false,
        });
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const renderPaginationItems = () => {
        const items = [];
        const totalRecords = facultiesData?.total_records ?? 0;
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

        console.log('renderPaginationItems', { start, end, totalPages });

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
                <Button
                    onClick={() =>
                        setOptionDialog({
                            option: 'create',
                            title: 'Thêm khoa',
                        })
                    }
                    disabled={createFaculty.isPending}
                >
                    <Plus className="w-6 h-6" />
                    <span className="ml-2">Thêm khoa</span>
                </Button>
            </div>

            <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex gap-2">
                    <Button
                        className={`bg-blue-500 hover:bg-blue-600 text-white p-2 ${tabOpened === 0 && '!opacity-100'} opacity-60 `}
                        size="icon"
                        onClick={() => setTabOpened(0)}
                    >
                        <Layers className="h-16 w-16" />
                    </Button>
                    <Button
                        className={`bg-red-500 hover:bg-red-600 text-white p-2 ${tabOpened === 1 && '!opacity-100'} opacity-60 `}
                        size="icon"
                        onClick={() => setTabOpened(1)}
                    >
                        <Trash2 className="h-16 w-16" />
                    </Button>
                    <div className="relative">
                        <Input placeholder="Tìm kiếm tên khoa" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Hiển thị:</span>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange} disabled={isLoading}>
                        <SelectTrigger className="w-[140px]">
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

            <div className="rounded-md border">
                <Table>
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
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6">
                                    <div className="flex justify-center items-center space-x-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                        <span>Đang tải...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : facultiesData?.data && facultiesData.data.length > 0 ? (
                            facultiesData.data.map((faculty: IFaculty, index: number) => (
                                <TableRow key={faculty.id}>
                                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>{faculty.name}</TableCell>
                                    <TableCell>{faculty.code}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            className="bg-green-500"
                                            size="icon"
                                            onClick={() => {
                                                setFormFaculty(faculty);
                                                setOptionDialog({
                                                    option: 'edit',
                                                    title: `Chỉnh sửa khoa ${faculty.name}`,
                                                });
                                            }}
                                            disabled={updateFaculty.isPending}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-red-500"
                                            onClick={() => {
                                                setFormFaculty(faculty);
                                                setOptionDialog({
                                                    option: 'delete',
                                                    title: `Xóa khoa ${faculty.name}`,
                                                });
                                            }}
                                            disabled={updateFaculty.isPending}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>

                                        {faculty.is_deleted && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="bg-orange-500"
                                                onClick={() => {
                                                    setFormFaculty(faculty);
                                                    setOptionDialog({
                                                        option: 'restore',
                                                        title: `Khôi phục khoa ${faculty.name}`,
                                                    });
                                                }}
                                                disabled={updateFaculty.isPending}
                                            >
                                                <Repeat className="w-4 h-4" />
                                            </Button>
                                        )}
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

            <div className="flex items-center mt-4">
                <div className="text-sm text-muted-foreground">
                    {!isLoading && facultiesData?.total_records !== undefined && <span>Tổng số: {facultiesData.total_records} bản ghi</span>}
                </div>

                {facultiesData && facultiesData.total_records > pageSize && (
                    <div className="flex justify-center flex-1">
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
                                            const totalPages = Math.ceil((facultiesData?.total_records ?? 0) / pageSize);
                                            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                                        }}
                                        className={
                                            currentPage === Math.ceil((facultiesData?.total_records ?? 0) / pageSize) ? 'pointer-events-none opacity-50' : ''
                                        }
                                        aria-label="Go to next page"
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
            <Dialog open={!!optionDialog} onOpenChange={() => setOptionDialog(null)}>
                <DialogContent className="p-4">
                    <DialogHeader>
                        <DialogTitle>{optionDialog?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label>Tên khoa</label>
                            <Input
                                placeholder="Nhập tên khoa"
                                value={formFaculty?.name}
                                onChange={(e) => setFormFaculty({ ...formFaculty, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Mã code khoa</label>
                            <Input
                                placeholder="Nhập mã khoa"
                                value={formFaculty?.code}
                                onChange={(e) => setFormFaculty({ ...formFaculty, code: e.target.value })}
                            />
                        </div>
                        <Button
                            onClick={() => {
                                const actions = {
                                    create: handleAddFaculty,
                                    edit: () => handleEditFaculty(formFaculty as IFaculty),
                                    delete: () => handleDeleteSoftFaculty(formFaculty as IFaculty),
                                    restore: () => handleRestoreFaculty(formFaculty as IFaculty),
                                };

                                const action = optionDialog?.option && actions[optionDialog.option as keyof typeof actions];
                                action && action();
                            }}
                            className="w-full"
                            disabled={createFaculty.isPending || updateFaculty.isPending}
                        >
                            {createFaculty.isPending || updateFaculty.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <ToastContainer />
        </div>
    );
}
