'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Edit, Layers, Plus, Search, Trash, Trash2 } from 'lucide-react';
import { JSX, useRef, useState } from 'react';
import { IMajor, IFaculty } from '@/types/models';
import { facultyService } from '@/services/facultyService';
import { IResponse, IResponseList } from '@/types/response';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { majorService } from '@/services/majorService';
import { setCreateMajor, setDeleteSoftMajor, setMajors } from '@/redux/slices/major.slice';
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

const PAGE_SIZE_OPTIONS = [
    { value: '1', label: '1 bản ghi' },
    { value: '5', label: '5 bản ghi' },
    { value: '10', label: '10 bản ghi' },
    { value: '20', label: '20 bản ghi' },
    { value: '30', label: '30 bản ghi' },
    { value: '50', label: '50 bản ghi' },
    { value: '100', label: '100 bản ghi' },
];

export default function MajorsPage() {
    const dispatch = useAppDispatch();
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [facultyPageSize] = useState(5);
    const [facultyPage, setFacultyPage] = useState(1);
    const [faculties, setFaculties] = useState<IFaculty[]>([]);
    const [hasMoreFaculties, setHasMoreFaculties] = useState(true);
    const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
    const [isFetchingFaculties, setIsFetchingFaculties] = useState(false);
    const [tabOpened, setTabOpened] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearch = useDebounce(searchValue, 500);
    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);
    const [formMajor, setFormMajor] = useState<Partial<IMajor> | null>(null);

    const { data: facultiesData, refetch: refetchFaculties } = useQuery<IResponseList<IFaculty>>({
        queryKey: ['faculties', facultyPage, facultyPageSize],
        queryFn: () => facultyService.getAll({
            page_number: 1,
            page_size: 10,
            is_deleted: false,
        })
    });

    const handleFacultyScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const bottom = Math.floor(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) === e.currentTarget.clientHeight;
        if (bottom && !isFetchingFaculties && hasMoreFaculties) {
            setFacultyPage((prev) => prev + 1);
        }
    };

    const {
        data: majorsData,
        isLoading,
        refetch,
    } = useQuery<{
        data: IMajor[];
        total_records: number;
        page_number: string;
        page_size: string;
    }>({
        placeholderData: (previousData) => previousData,
        queryKey: ['majors', currentPage, pageSize, tabOpened, debouncedSearch, selectedFaculty],
        queryFn: async () => {
            const result = await majorService.getAll({
                page_number: currentPage,
                page_size: pageSize,
                search: debouncedSearch,
                is_deleted: tabOpened === 0 ? false : true,
                faculty_id: selectedFaculty === 'all' ? undefined : selectedFaculty,
            });
            dispatch(setMajors(result.data));
            return result;
        },
    });

    const createMajor = useMutation<IResponse<IMajor>, Error, { name: string; code: string; faculty_id: string }>({
        mutationFn: (data) => majorService.create(data),
        onSuccess: (res) => {
            toast.success(`Thêm ngành ${res.data?.name} thành công`, {
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
            setFormMajor({ name: '', code: '' });
            dispatch(setCreateMajor(res.data));
            refetch();
        },
        onError: (error) => {
            toast.error('Thêm ngành thất bại');
            console.error('Thêm ngành thất bại:', error);
        },
    });

    const handleAddMajor = () => {
        if (!formMajor?.name || !formMajor?.code || !formMajor?.faculty_id) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        createMajor.mutate({
            name: formMajor.name,
            code: formMajor.code,
            faculty_id: formMajor.faculty_id,
        });
    };

    const updateMajor = useMutation({
        mutationFn: (data: any) => (optionDialog?.option === 'delete' ? majorService.deleteSoft(data.id) : majorService.update(data.id, data)),
        onSuccess: (res: IResponse<IMajor>) => {
            toast.success(`${res?.data?.is_deleted ? 'Xóa' : 'Cập nhật'} ngành ${res.data?.name} thành công`, {
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
            setFormMajor(null);
            dispatch(setDeleteSoftMajor(res.data?.id));
            refetch();
        },
        onError: (error) => {
            toast.error('Xóa ngành thất bại');
            console.error('Xóa ngành thất bại:', error);
        },
    });

    const handleEditMajor = (major: IMajor) => {
        updateMajor.mutate({
            id: major.id,
            name: major.name,
            code: major.code,
            faculty_id: major.faculty_id,
        });
    };

    const handleDeleteSoftMajor = (major: IMajor) => {
        updateMajor.mutate({
            id: major.id,
            is_deleted: true,
        });
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const renderPaginationItems = () => {
        const items = [];
        const totalRecords = majorsData?.total_records ?? 0;
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
                <h2 className="text-2xl font-bold">Quản lý ngành</h2>
                <Button
                    onClick={() =>
                        setOptionDialog({
                            option: 'create',
                            title: 'Thêm ngành',
                        })
                    }
                    disabled={createMajor.isPending}
                >
                    <Plus className="w-6 h-6" />
                    <span className="ml-2">Thêm ngành</span>
                </Button>
            </div>

            <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex items-center gap-4">
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
                            <Input placeholder="Tìm kiếm tên ngành" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn khoa" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]" onScroll={handleFacultyScroll}>
                            <SelectItem value="all">Tất cả khoa</SelectItem>
                            {faculties.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.id.toString()}>
                                    {faculty.name}
                                </SelectItem>
                            ))}
                            {isFetchingFaculties && (
                                <div className="flex justify-center p-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                </div>
                            )}
                        </SelectContent>
                    </Select>
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
                            <TableHead>Tên ngành</TableHead>
                            <TableHead>Mã ngành</TableHead>
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
                        ) : majorsData?.data && majorsData.data.length > 0 ? (
                            majorsData.data.map((major: IMajor, index: number) => (
                                <TableRow key={major.id}>
                                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>{major.name}</TableCell>
                                    <TableCell>{major.code}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            className="bg-green-500"
                                            size="icon"
                                            onClick={() => {
                                                setFormMajor(major);
                                                setOptionDialog({
                                                    option: 'edit',
                                                    title: 'Sửa ngành',
                                                });
                                            }}
                                            disabled={updateMajor.isPending}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-red-500"
                                            onClick={() => {
                                                setFormMajor(major);
                                                setOptionDialog({
                                                    option: 'delete',
                                                    title: 'Xóa ngành',
                                                });
                                            }}
                                            disabled={updateMajor.isPending}
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

            <div className="flex items-center mt-4">
                <div className="text-sm text-muted-foreground">
                    {!isLoading && majorsData?.total_records !== undefined && <span>Tổng số: {majorsData.total_records} bản ghi</span>}
                </div>

                {majorsData && majorsData.total_records > pageSize && (
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
                                            const totalPages = Math.ceil((majorsData?.total_records ?? 0) / pageSize);
                                            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                                        }}
                                        className={
                                            currentPage === Math.ceil((majorsData?.total_records ?? 0) / pageSize) ? 'pointer-events-none opacity-50' : ''
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
                            <label>Tên ngành</label>
                            <Input
                                placeholder="Nhập tên ngành"
                                value={formMajor?.name}
                                onChange={(e) => setFormMajor({ ...formMajor, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Mã ngành</label>
                            <Input placeholder="Nhập mã ngành" value={formMajor?.code} onChange={(e) => setFormMajor({ ...formMajor, code: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label>Khoa</label>
                            <Select value={formMajor?.faculty_id || ''} onValueChange={(value) => setFormMajor({ ...formMajor, faculty_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn khoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {faculties.map((faculty) => (
                                        <SelectItem key={faculty.id} value={faculty.id.toString()}>
                                            {faculty.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => {
                                if (optionDialog?.option === 'create') {
                                    handleAddMajor();
                                } else if (optionDialog?.option === 'edit') {
                                    handleEditMajor(formMajor as IMajor);
                                } else if (optionDialog?.option === 'delete') {
                                    handleDeleteSoftMajor(formMajor as IMajor);
                                }
                            }}
                            className="w-full"
                            disabled={createMajor.isPending || updateMajor.isPending}
                        >
                            {createMajor.isPending || updateMajor.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <ToastContainer />
        </div>
    );
}
