'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { facultyService } from '@/services/facultyService';
import { setCreateFaculty, setDeleteSoftFaculty, setFaculties } from '@/redux/slices/faculty.slice';
import { useDispatch, useSelector } from 'react-redux';
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


const PAGE_SIZE_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

export default function DepartmentsPage() {
    const dispatch = useAppDispatch();
    const { faculties } = useAppSelector((state) => state.localStorage.faculty);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newDepartment, setNewDepartment] = useState({ name: '', code: '' });

    const { data, isLoading, refetch } = useQuery<{
        data: IFaculty[];
        pagination: {
            page_number: number;
            page_size: number;
            totalItems: number;
            totalPages: number;
        };
    }>({
        queryKey: ['faculties', currentPage, pageSize],
        queryFn: async () => {
            const result = await facultyService.getAll({
                page_number: currentPage,
                page_size: pageSize,
            });
            dispatch(setFaculties(result.data));
            return result;
        },
    });


    const createFaculty = useMutation<{ data: IFaculty }, Error, { name: string; code: string }>({
        mutationFn: (data) => facultyService.create(data),
        onSuccess: (response) => {
            toast.success(`Thêm khoa ${response.data.code} thành công`, {
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
            dispatch(setCreateFaculty(response.data));
            refetch();
            setIsAddOpen(false);
        },
        onError: (error) => {
            toast.error('Thêm khoa thất bại');
            console.error('Thêm khoa thất bại:', error);
        },
    });

    const deleteFaculty = useMutation({
        mutationFn: (id : string) => facultyService.deleteSoft(id),
        onSuccess: (_, deletedId) => {
            toast.success('Xóa khoa thành công');
            dispatch(setDeleteSoftFaculty(deletedId));
            refetch();
        },
        onError: (error) => {
            toast.error('Xóa khoa thất bại');
            console.error('Xóa khoa thất bại:', error);
        },
    });

    const handleAdd = () => {
        if (!newDepartment.name || !newDepartment.code) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        createFaculty.mutate(newDepartment);
        setNewDepartment({ name: '', code: '' });
    };

    const handleDelete = (id: string) => {
        deleteFaculty.mutate(id);
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const renderPaginationItems = () => {
        const items = [];
        const totalPages = data?.pagination?.totalPages || 1;
        const current = currentPage;
        const delta = 2; // Number of pages to show before and after current page

        let start = Math.max(1, current - delta);
        let end = Math.min(totalPages, current + delta);

        // Always show first page
        items.push(
            <PaginationItem key={1}>
                <PaginationLink onClick={() => setCurrentPage(1)} isActive={current === 1}>
                    1
                </PaginationLink>
            </PaginationItem>,
        );

        // Add ellipsis after first page
        if (start > 2) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>,
            );
        }

        // Add pages between ellipsis
        for (let i = Math.max(2, start); i <= Math.min(end, totalPages - 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i)} isActive={current === i}>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        // Add ellipsis before last page
        if (end < totalPages - 1) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>,
            );
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={current === totalPages}>
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
                <h2 className="text-2xl font-bold tracking-tight">Quản lý khoa</h2>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm khoa mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-4">
                        <DialogHeader>
                            <DialogTitle>Thêm khoa mới</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label>Tên khoa</label>
                                <Input
                                    placeholder="Nhập tên khoa"
                                    value={newDepartment.name}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label>Mã code khoa</label>
                                <Input
                                    placeholder="Nhập mã khoa"
                                    value={newDepartment.code}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleAdd} className="w-full" disabled={createFaculty.isPending}>
                                {createFaculty.isPending ? 'Đang thêm...' : 'Thêm mới'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                    {!isLoading && data?.pagination && (
                        <span>
                            Tổng số: {data.pagination.totalItems} bản ghi
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Hiển thị:</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
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
                        ) : faculties && faculties.length > 0 ? (
                            faculties.map((faculty, index) => (
                                <TableRow key={faculty.id}>
                                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>{faculty.name}</TableCell>
                                    <TableCell>{faculty.code}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(faculty.id)}
                                            disabled={deleteFaculty.isPending}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
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

            {(data?.pagination?.totalPages ?? 0) > 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data?.pagination?.totalPages ?? 1))}
                                    className={currentPage === (data?.pagination?.totalPages ?? 1) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
