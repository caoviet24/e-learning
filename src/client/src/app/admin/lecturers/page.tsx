'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Edit, Layers, Plus, Repeat, Search, Trash, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ILecturer, IFaculty, IMajor } from '@/types/models';
import { facultyService } from '@/services/facultyService';
import { majorService } from '@/services/majorService';
import { IResponse, IResponseList } from '@/types/response';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { lecturerService } from '@/services/lecturerService';
import { setCreateLecturer, setDeleteSoftLecturer, setLecturers } from '@/redux/slices/lecturer.slice';
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

const GENDER_OPTIONS = [
    { value: '0', label: 'Nam' },
    { value: '1', label: 'Nữ' },
    { value: '2', label: 'Khác' },
];

export default function LecturersPage() {
    const dispatch = useAppDispatch();
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabOpened, setTabOpened] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearch = useDebounce(searchValue, 500);
    
    // Faculty and major filtering
    const [facultyPageSize] = useState(10);
    const [facultyPage, setFacultyPage] = useState(1);
    const [faculties, setFaculties] = useState<IFaculty[]>([]);
    const [hasMoreFaculties, setHasMoreFaculties] = useState(true);
    const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
    const [isFetchingFaculties, setIsFetchingFaculties] = useState(false);
    
    const [majorPageSize] = useState(10);
    const [majorPage, setMajorPage] = useState(1);
    const [majors, setMajors] = useState<IMajor[]>([]);
    const [hasMoreMajors, setHasMoreMajors] = useState(true);
    const [selectedMajor, setSelectedMajor] = useState<string>('all');
    const [isFetchingMajors, setIsFetchingMajors] = useState(false);
    const [filteredMajors, setFilteredMajors] = useState<IMajor[]>([]);

    const [optionDialog, setOptionDialog] = useState<{
        option: string;
        title: string;
    } | null>(null);
    
    const [formLecturer, setFormLecturer] = useState<{
        id?: string;
        username: string;
        password: string;
        full_name: string;
        gender?: number;
        email?: string;
        phone_number?: string;
        original_address?: string;
        current_address?: string;
        faculty_id: string;
        major_id: string;
        id_card: string;
    }>({
        username: '',
        password: '',
        full_name: '',
        gender: 0,
        email: '',
        phone_number: '',
        original_address: '',
        current_address: '',
        faculty_id: '',
        major_id: '',
        id_card: '',
    });

    const { data: facultiesData, isFetching: isFetchingFacultiesData } = useQuery<IResponseList<IFaculty>>({
        queryKey: ['faculties', facultyPage, facultyPageSize],
        queryFn: async () => {
            setIsFetchingFaculties(true);
            try {
                const response = await facultyService.getAll({
                    page_number: facultyPage,
                    page_size: facultyPageSize,
                    is_deleted: false,
                });
                if (facultyPage === 1) {
                    setFaculties(response.data);
                } else {
                    setFaculties((prev) => [...prev, ...response.data]);
                }
                setHasMoreFaculties(response.data.length === facultyPageSize);
                return response;
            } finally {
                setIsFetchingFaculties(false);
            }
        },
        refetchOnWindowFocus: false,
    });

    const { data: majorsData, isFetching: isFetchingMajorsData } = useQuery<IResponseList<IMajor>>({
        queryKey: ['majors', majorPage, majorPageSize, selectedFaculty],
        queryFn: async () => {
            setIsFetchingMajors(true);
            try {
                const response = await majorService.getAll({
                    page_number: majorPage,
                    page_size: majorPageSize,
                    faculty_id: selectedFaculty !== 'all' ? selectedFaculty : undefined,
                    is_deleted: false,
                });
                
                if (majorPage === 1) {
                    setMajors(response.data);
                    setFilteredMajors(response.data);
                } else {
                    setMajors((prev) => [...prev, ...response.data]);
                    setFilteredMajors((prev) => [...prev, ...response.data]);
                }
                
                setHasMoreMajors(response.data.length === majorPageSize);
                return response;
            } finally {
                setIsFetchingMajors(false);
            }
        },
        refetchOnWindowFocus: false,
    });

    const handleFacultyScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50 && !isFetchingFaculties && hasMoreFaculties) {
            setFacultyPage((prev) => prev + 1);
        }
    };

    const handleMajorScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50 && !isFetchingMajors && hasMoreMajors) {
            setMajorPage((prev) => prev + 1);
        }
    };

    const handleFacultyChange = (value: string) => {
        setSelectedFaculty(value);
        setSelectedMajor('all');
        setMajorPage(1);
        
        if (value === 'all') {
            setFilteredMajors(majors);
        } else {
            const filtered = majors.filter(major => major.faculty_id === value);
            setFilteredMajors(filtered);
        }
    };

    const handleFormFacultyChange = (value: string) => {
        setFormLecturer(prev => ({
            ...prev,
            faculty_id: value,
            major_id: '', // Reset major when faculty changes
        }));
    };

    const {
        data: lecturersData,
        isLoading,
        refetch,
    } = useQuery<{
        data: ILecturer[];
        total_records: number;
        page_number: string;
        page_size: string;
    }>({
        placeholderData: (previousData) => previousData,
        queryKey: ['lecturers', currentPage, pageSize, tabOpened, debouncedSearch, selectedFaculty, selectedMajor],
        queryFn: async () => {
            const result = await lecturerService.getAll({
                page_number: currentPage,
                page_size: pageSize,
                search: debouncedSearch,
                is_deleted: tabOpened === 0 ? false : true,
                faculty_id: selectedFaculty === 'all' ? undefined : selectedFaculty,
                major_id: selectedMajor === 'all' ? undefined : selectedMajor,
            });
            dispatch(setLecturers(result.data));
            return result;
        },
    });

    const createLecturer = useMutation<
        IResponse<ILecturer>, 
        Error, 
        {
            username: string;
            password: string;
            full_name: string;
            gender?: number;
            email?: string;
            phone_number?: string;
            original_address?: string;
            current_address?: string;
            faculty_id: string;
            major_id: string;
            id_card: string;
        }
    >({
        mutationFn: (data) => lecturerService.create(data),
        onSuccess: (res) => {
            toast.success(`Thêm giảng viên ${res.data?.user?.full_name} thành công`, {
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
            setFormLecturer({
                username: '',
                password: '',
                full_name: '',
                gender: 0,
                email: '',
                phone_number: '',
                original_address: '',
                current_address: '',
                faculty_id: '',
                major_id: '',
                id_card: '',
            });
            dispatch(setCreateLecturer(res.data));
            refetch();
        },
        onError: (error) => {
            toast.error(`Thêm giảng viên thất bại: ${error.message}`);
            console.error('Thêm giảng viên thất bại:', error);
        },
    });

    const handleAddLecturer = () => {
        if (!formLecturer.username || !formLecturer.password || !formLecturer.full_name || 
            !formLecturer.faculty_id || !formLecturer.major_id || !formLecturer.id_card) {
            toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }

        createLecturer.mutate({
            username: formLecturer.username,
            password: formLecturer.password,
            full_name: formLecturer.full_name,
            gender: formLecturer.gender,
            email: formLecturer.email,
            phone_number: formLecturer.phone_number,
            original_address: formLecturer.original_address,
            current_address: formLecturer.current_address,
            faculty_id: formLecturer.faculty_id,
            major_id: formLecturer.major_id,
            id_card: formLecturer.id_card,
        });
    };

    const updateLecturer = useMutation({
        mutationFn: (data: any) => {
            // Only use restore API when explicitly asked to restore
            if (data.restore === true) {
                return lecturerService.restore(data.id);
            }
            
            // Build update object with only fields that are provided
            const updateData: any = {};
            if (data.username) updateData.username = data.username;
            if (data.password) updateData.password = data.password;
            if (data.full_name) updateData.full_name = data.full_name;
            if (data.gender !== undefined) updateData.gender = data.gender;
            if (data.email) updateData.email = data.email;
            if (data.phone_number) updateData.phone_number = data.phone_number;
            if (data.original_address) updateData.original_address = data.original_address;
            if (data.current_address) updateData.current_address = data.current_address;
            if (data.faculty_id) updateData.faculty_id = data.faculty_id;
            if (data.major_id) updateData.major_id = data.major_id;
            if (data.id_card) updateData.id_card = data.id_card;
            
            // Otherwise use normal update API
            return lecturerService.update(data.id, updateData);
        },
        onSuccess: (res: IResponse<ILecturer>) => {
            toast.success(`${res?.data?.user?.is_deleted ? 'Khôi phục' : 'Cập nhật'} giảng viên ${res?.data?.user?.full_name} thành công`, {
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
            setFormLecturer({
                username: '',
                password: '',
                full_name: '',
                gender: 0,
                email: '',
                phone_number: '',
                original_address: '',
                current_address: '',
                faculty_id: '',
                major_id: '',
                id_card: '',
            });
            dispatch(setDeleteSoftLecturer(res.data?.id));
            refetch();
        },
        onError: (error) => {
            toast.error(`Cập nhật giảng viên thất bại: ${error.message}`);
            console.error('Cập nhật giảng viên thất bại:', error);
        },
    });

    const deleteLecturer = useMutation({
        mutationFn: (data: any) => {
            if (data.delete) {
                return lecturerService.delete(data.id);
            }
            return lecturerService.deleteSoft(data.id);
        },
        onSuccess: (res: IResponse<any>) => {
            toast.success(`Xóa giảng viên ${res.data?.full_name || ''} thành công`, {
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
            setFormLecturer({
                username: '',
                password: '',
                full_name: '',
                gender: 0,
                email: '',
                phone_number: '',
                original_address: '',
                current_address: '',
                faculty_id: '',
                major_id: '',
                id_card: '',
            });
            dispatch(setDeleteSoftLecturer(res.data?.id));
            refetch();
        },
        onError: (error) => {
            toast.error(`Xóa giảng viên thất bại: ${error.message}`);
            console.error('Xóa giảng viên thất bại:', error);
        },
    });

    const handleEditLecturer = (lecturer: ILecturer) => {
        if (!lecturer?.user) return;
        
        updateLecturer.mutate({
            id: lecturer.id,
            username: formLecturer.username,
            password: formLecturer.password,
            full_name: formLecturer.full_name,
            gender: formLecturer.gender,
            email: formLecturer.email,
            phone_number: formLecturer.phone_number,
            original_address: formLecturer.original_address,
            current_address: formLecturer.current_address,
            faculty_id: formLecturer.faculty_id,
            major_id: formLecturer.major_id,
            id_card: formLecturer.id_card,
        });
    };

    const handleDeleteSoftLecturer = (lecturer: ILecturer) => {
        deleteLecturer.mutate({
            id: lecturer.id,
            delete: false,
        });
    };

    const handleRestoreLecturer = (lecturer: ILecturer) => {
        updateLecturer.mutate({
            id: lecturer.id,
            restore: true, // Explicitly flag as restore operation
        });
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const renderPaginationItems = () => {
        const items = [];
        const totalRecords = lecturersData?.total_records ?? 0;
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
                <Button
                    onClick={() =>
                        setOptionDialog({
                            option: 'create',
                            title: 'Thêm giảng viên',
                        })
                    }
                    disabled={createLecturer.isPending}
                >
                    <Plus className="w-6 h-6" />
                    <span className="ml-2">Thêm giảng viên</span>
                </Button>
            </div>

            <div className="flex items-center justify-between mb-4 w-full flex-wrap gap-2">
                <div className="flex items-center gap-4 flex-wrap">
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
                            <Input placeholder="Tìm kiếm tên giảng viên" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <Select value={selectedFaculty} onValueChange={handleFacultyChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn khoa" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]" onScroll={handleFacultyScroll}>
                            <SelectItem value="all">Tất cả khoa</SelectItem>
                            {faculties.length > 0 &&
                                faculties.map((faculty) => (
                                    <SelectItem key={faculty.id} value={faculty.id.toString()}>
                                        {faculty.name}
                                    </SelectItem>
                                ))}
                            {isFetchingFaculties && hasMoreFaculties && (
                                <div className="flex justify-center p-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                    
                    <Select value={selectedMajor} onValueChange={setSelectedMajor} disabled={selectedFaculty === 'all'}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn ngành" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]" onScroll={handleMajorScroll}>
                            <SelectItem value="all">Tất cả ngành</SelectItem>
                            {filteredMajors.length > 0 &&
                                filteredMajors.map((major) => (
                                    <SelectItem key={major.id} value={major.id.toString()}>
                                        {major.name}
                                    </SelectItem>
                                ))}
                            {isFetchingMajors && hasMoreMajors && (
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
                            <TableHead>Tên giảng viên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Khoa</TableHead>
                            <TableHead>Ngành</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    <div className="flex justify-center items-center space-x-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                        <span>Đang tải...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : lecturersData?.data && lecturersData.data.length > 0 ? (
                            lecturersData.data.map((lecturer: ILecturer, index: number) => (
                                <TableRow key={lecturer.id}>
                                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>{lecturer.user?.full_name}</TableCell>
                                    <TableCell>{lecturer.user?.email || '–'}</TableCell>
                                    <TableCell>{lecturer.faculty?.name}</TableCell>
                                    <TableCell>{lecturer.major?.name}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            className="bg-green-500"
                                            size="icon"
                                            onClick={() => {
                                                setFormLecturer({
                                                    id: lecturer.id,
                                                    username: lecturer.user?.username || '',
                                                    password: '', // Don't set password for edit
                                                    full_name: lecturer.user?.full_name || '',
                                                    gender: lecturer.user?.gender,
                                                    email: lecturer.user?.email || '',
                                                    phone_number: lecturer.user?.phone_number || '',
                                                    original_address: lecturer.user?.original_address || '',
                                                    current_address: lecturer.user?.current_address || '',
                                                    faculty_id: lecturer.faculty_id,
                                                    major_id: lecturer.major_id,
                                                    id_card: lecturer.lecturer_id,
                                                });
                                                setOptionDialog({
                                                    option: 'edit',
                                                    title: `Chỉnh sửa giảng viên ${lecturer.user?.full_name}`,
                                                });
                                            }}
                                            disabled={updateLecturer.isPending}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-red-500"
                                            onClick={() => {
                                                setFormLecturer({
                                                    id: lecturer.id,
                                                    username: lecturer.user?.username || '',
                                                    password: '',
                                                    full_name: lecturer.user?.full_name || '',
                                                    gender: lecturer.user?.gender,
                                                    email: lecturer.user?.email || '',
                                                    phone_number: lecturer.user?.phone_number || '',
                                                    original_address: lecturer.user?.original_address || '',
                                                    current_address: lecturer.user?.current_address || '',
                                                    faculty_id: lecturer.faculty_id,
                                                    major_id: lecturer.major_id,
                                                    id_card: lecturer.lecturer_id,
                                                });
                                                setOptionDialog({
                                                    option: 'delete',
                                                    title: `Xóa giảng viên ${lecturer.user?.full_name}`,
                                                });
                                            }}
                                            disabled={updateLecturer.isPending}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>

                                        {lecturer.user?.is_deleted && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="bg-orange-500"
                                                onClick={() => {
                                                    setFormLecturer({
                                                        id: lecturer.id,
                                                        username: lecturer.user?.username || '',
                                                        password: '',
                                                        full_name: lecturer.user?.full_name || '',
                                                        gender: lecturer.user?.gender,
                                                        email: lecturer.user?.email || '',
                                                        phone_number: lecturer.user?.phone_number || '',
                                                        original_address: lecturer.user?.original_address || '',
                                                        current_address: lecturer.user?.current_address || '',
                                                        faculty_id: lecturer.faculty_id,
                                                        major_id: lecturer.major_id,
                                                        id_card: lecturer.lecturer_id,
                                                    });
                                                    setOptionDialog({
                                                        option: 'restore',
                                                        title: `Khôi phục giảng viên ${lecturer.user?.full_name}`,
                                                    });
                                                }}
                                                disabled={updateLecturer.isPending}
                                            >
                                                <Repeat className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center mt-4">
                <div className="text-sm text-muted-foreground">
                    {!isLoading && lecturersData?.total_records !== undefined && <span>Tổng số: {lecturersData.total_records} bản ghi</span>}
                </div>

                {lecturersData && lecturersData.total_records > pageSize && (
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
                                            const totalPages = Math.ceil((lecturersData?.total_records ?? 0) / pageSize);
                                            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                                        }}
                                        className={
                                            currentPage === Math.ceil((lecturersData?.total_records ?? 0) / pageSize) ? 'pointer-events-none opacity-50' : ''
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
                <DialogContent className="p-4 max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{optionDialog?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        {optionDialog?.option !== 'delete' && optionDialog?.option !== 'restore' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label>Tên đăng nhập <span className="text-red-500">*</span></label>
                                        <Input
                                            placeholder="Nhập tên đăng nhập"
                                            value={formLecturer.username}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, username: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Mật khẩu {optionDialog?.option === 'edit' && '(để trống nếu không thay đổi)'} {optionDialog?.option === 'create' && <span className="text-red-500">*</span>}</label>
                                        <Input
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            value={formLecturer.password}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Họ tên <span className="text-red-500">*</span></label>
                                        <Input
                                            placeholder="Nhập họ tên"
                                            value={formLecturer.full_name}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Giới tính</label>
                                        <Select value={formLecturer.gender?.toString()} onValueChange={(value) => setFormLecturer({ ...formLecturer, gender: parseInt(value) })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn giới tính" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {GENDER_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label>Email</label>
                                        <Input
                                            type="email"
                                            placeholder="Nhập email"
                                            value={formLecturer.email}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Số điện thoại</label>
                                        <Input
                                            placeholder="Nhập số điện thoại"
                                            value={formLecturer.phone_number}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, phone_number: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Mã giảng viên <span className="text-red-500">*</span></label>
                                        <Input
                                            placeholder="Nhập mã giảng viên"
                                            value={formLecturer.id_card}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, id_card: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Khoa <span className="text-red-500">*</span></label>
                                        <Select value={formLecturer.faculty_id} onValueChange={handleFormFacultyChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn khoa" />
                                            </SelectTrigger>
                                            <SelectContent onScroll={handleFacultyScroll}>
                                                {faculties.map((faculty) => (
                                                    <SelectItem key={faculty.id} value={faculty.id.toString()}>
                                                        {faculty.name}
                                                    </SelectItem>
                                                ))}
                                                {isFetchingFaculties && hasMoreFaculties && (
                                                    <div className="flex justify-center p-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label>Ngành <span className="text-red-500">*</span></label>
                                        <Select value={formLecturer.major_id} onValueChange={(value) => setFormLecturer({ ...formLecturer, major_id: value })} disabled={!formLecturer.faculty_id}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn ngành" />
                                            </SelectTrigger>
                                            <SelectContent onScroll={handleMajorScroll}>
                                                {filteredMajors.filter(major => !formLecturer.faculty_id || major.faculty_id === formLecturer.faculty_id).map((major) => (
                                                    <SelectItem key={major.id} value={major.id.toString()}>
                                                        {major.name}
                                                    </SelectItem>
                                                ))}
                                                {isFetchingMajors && hasMoreMajors && (
                                                    <div className="flex justify-center p-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label>Địa chỉ gốc</label>
                                        <Input
                                            placeholder="Nhập địa chỉ gốc"
                                            value={formLecturer.original_address}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, original_address: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Địa chỉ hiện tại</label>
                                        <Input
                                            placeholder="Nhập địa chỉ hiện tại"
                                            value={formLecturer.current_address}
                                            onChange={(e) => setFormLecturer({ ...formLecturer, current_address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {(optionDialog?.option === 'delete' || optionDialog?.option === 'restore') && (
                            <div className="py-4 text-center">
                                <p>
                                    {optionDialog.option === 'delete'
                                        ? `Bạn có chắc chắn muốn xóa giảng viên ${formLecturer.full_name} không?`
                                        : `Bạn có chắc chắn muốn khôi phục giảng viên ${formLecturer.full_name} không?`}
                                </p>
                            </div>
                        )}
                        
                        <Button
                            onClick={() => {
                                const actions = {
                                    create: handleAddLecturer,
                                    edit: () => handleEditLecturer(formLecturer as unknown as ILecturer),
                                    delete: () => handleDeleteSoftLecturer(formLecturer as unknown as ILecturer),
                                    restore: () => handleRestoreLecturer(formLecturer as unknown as ILecturer),
                                };

                                const action = optionDialog?.option && actions[optionDialog.option as keyof typeof actions];
                                action && action();
                            }}
                            className={`w-full ${optionDialog?.option === 'delete' ? 'bg-red-500 hover:bg-red-600' : optionDialog?.option === 'restore' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                            disabled={createLecturer.isPending || updateLecturer.isPending || deleteLecturer.isPending}
                        >
                            {(createLecturer.isPending || updateLecturer.isPending || deleteLecturer.isPending) ? 'Đang xử lý...' : (
                                optionDialog?.option === 'create' ? 'Thêm giảng viên' :
                                optionDialog?.option === 'edit' ? 'Cập nhật' :
                                optionDialog?.option === 'delete' ? 'Xóa' : 'Khôi phục'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <ToastContainer />
        </div>
    );
}
