'use client';

import { Card, CardContent } from '@/components/ui/card';
import { setMyAccount } from '@/redux/slices/account.slice';
import { useAppDispatch } from '@/redux/store';
import { accountService } from '@/services/accountService';
import { useQuery } from '@tanstack/react-query';
import { Building2, GraduationCap, LayoutGrid, BookText, Users, School } from 'lucide-react';
import { useEffect } from 'react';
import StatisticCard from '@/components/StatisticCard';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import FilterableChart from '@/components/charts/FilterableChart';
import { 
  facultyStats, 
  majorStats, 
  studentStats, 
  classStats, 
  lecturerStats,
  courseStats
} from '@/content/stats-data';

export default function AdminPage() {
    // Define a type for the account
    interface AccountData {
        account: {
            id: string;
            username: string;
            email: string;
            role: string;
            fullName?: string;
            avatar?: string;
            status?: string;
            // Using more specific types instead of any
            settings?: Record<string, string | number | boolean>;
        };
    }

    const stats = [
        {
            title: 'Tổng số khoa',
            value: facultyStats.totalCount,
            icon: Building2,
            color: 'text-sky-500',
        },
        {
            title: 'Tổng số ngành học',
            value: majorStats.totalCount,
            icon: BookText,
            color: 'text-blue-500',
        },
        {
            title: 'Tổng số khóa học',
            value: courseStats.totalCount,
            icon: School,
            color: 'text-purple-500',
        },
        {
            title: 'Tổng số giảng viên',
            value: lecturerStats.totalCount,
            icon: GraduationCap,
            color: 'text-violet-500',
        },
        {
            title: 'Tổng số lớp học',
            value: classStats.totalCount,
            icon: LayoutGrid,
            color: 'text-green-500',
        },
        {
            title: 'Tổng số sinh viên',
            value: studentStats.totalCount.toLocaleString(),
            icon: Users,
            color: 'text-emerald-500',
        },
    ];

    const dispatch = useAppDispatch();

    const {
        data: authData,
        isError: isAuthError,
        isSuccess: isAuthSuccess,
        error
    } = useQuery<AccountData>({
        queryKey: ['auth'],
        queryFn: accountService.auth,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    useEffect(() => {
        if (error) {
            console.error('Auth error:', error);
        }
    }, [error]);

    useEffect(() => {
        if (isAuthSuccess) {
            dispatch(setMyAccount(authData.account));
        }
    }, [isAuthSuccess, isAuthError, authData, dispatch]);

    return (
        <div className="p-6 space-y-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Tổng quan số liệu thống kê của trường đại học</p>
            </div>

            {/* Statistic Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {stats.map((stat) => (
                    <StatisticCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        colorClass={stat.color}
                    />
                ))}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Thông tin chi tiết sinh viên</h3>
            
            {/* Filterable Student Charts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <FilterableChart
                    title="Phân bố sinh viên theo năm học"
                    chartType="bar"
                    entityType="students"
                    defaultData={{
                        labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
                        data: [615, 585, 555, 475, 170],
                    }}
                    facultyData={studentStats.facultyDetails}
                    majorData={studentStats.majorDetails}
                />
                
                <FilterableChart
                    title="Phân bố giới tính sinh viên"
                    chartType="pie"
                    entityType="students"
                    defaultData={{
                        labels: ['Nam', 'Nữ'],
                        data: [1845, 1260],
                        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
                    }}
                    facultyData={{
                        'Công nghệ thông tin': { labels: ['Nam', 'Nữ'], data: [615, 205] },
                        'Kỹ thuật điện tử': { labels: ['Nam', 'Nữ'], data: [490, 160] },
                        'Quản trị kinh doanh': { labels: ['Nam', 'Nữ'], data: [215, 325] },
                        'Ngoại ngữ': { labels: ['Nam', 'Nữ'], data: [160, 270] },
                        'Kinh tế': { labels: ['Nam', 'Nữ'], data: [175, 205] },
                        'Cơ khí': { labels: ['Nam', 'Nữ'], data: [190, 100] },
                    }}
                    majorData={{
                        'Kỹ thuật phần mềm': { labels: ['Nam', 'Nữ'], data: [145, 40] },
                        'Trí tuệ nhân tạo': { labels: ['Nam', 'Nữ'], data: [95, 25] },
                        'Điện tử viễn thông': { labels: ['Nam', 'Nữ'], data: [105, 25] },
                        'Quản trị kinh doanh': { labels: ['Nam', 'Nữ'], data: [95, 70] },
                        'Ngôn ngữ Anh': { labels: ['Nam', 'Nữ'], data: [40, 105] },
                        'Kế toán': { labels: ['Nam', 'Nữ'], data: [30, 95] },
                    }}
                />
            </div>
            
            <h3 className="text-xl font-bold mt-8 mb-4">Thông tin chi tiết giảng viên</h3>
            
            {/* Filterable Lecturer Charts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <FilterableChart
                    title="Phân bố học vị giảng viên"
                    chartType="pie"
                    entityType="lecturers"
                    defaultData={{
                        labels: ['Tiến sĩ', 'Thạc sĩ', 'Cử nhân', 'Giáo sư', 'Phó giáo sư'],
                        data: [65, 85, 15, 5, 10],
                    }}
                    facultyData={{
                        'Công nghệ thông tin': { 
                            labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
                            data: [2, 4, 12, 18, 2]
                        },
                        'Kỹ thuật điện tử': { 
                            labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
                            data: [1, 2, 10, 16, 3]
                        },
                        'Quản trị kinh doanh': { 
                            labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
                            data: [0, 1, 11, 15, 3]
                        },
                        'Ngoại ngữ': { 
                            labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
                            data: [0, 1, 9, 16, 2]
                        },
                        'Kinh tế': { 
                            labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
                            data: [1, 1, 8, 14, 2]
                        },
                        'Cơ khí': { 
                            labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
                            data: [1, 1, 7, 13, 2]
                        }
                    }}
                    majorData={lecturerStats.majorDetails}
                />

                <FilterableChart
                    title="Kinh nghiệm giảng viên"
                    chartType="bar"
                    entityType="lecturers"
                    defaultData={{
                        labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                        data: [35, 60, 45, 28, 12],
                    }}
                    facultyData={{
                        'Công nghệ thông tin': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [8, 12, 10, 6, 2]
                        },
                        'Kỹ thuật điện tử': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [6, 10, 9, 5, 2]
                        },
                        'Quản trị kinh doanh': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [7, 12, 7, 3, 1]
                        },
                        'Ngoại ngữ': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [5, 10, 8, 4, 1]
                        },
                        'Kinh tế': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [5, 9, 6, 4, 2]
                        },
                        'Cơ khí': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [4, 7, 5, 6, 4]
                        }
                    }}
                    majorData={{
                        'Kỹ thuật phần mềm': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [4, 6, 5, 2, 0]
                        },
                        'Trí tuệ nhân tạo': { 
                            labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
                            data: [3, 5, 3, 1, 0]
                        }
                    }}
                />
            </div>
            
            <h3 className="text-xl font-bold mt-8 mb-4">Thông tin chi tiết lớp học</h3>
            
            {/* Filterable Class Charts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <FilterableChart
                    title="Quy mô lớp học"
                    chartType="bar"
                    entityType="classes"
                    defaultData={{
                        labels: ['<20', '20-30', '31-40', '41-50', '>50'],
                        data: [15, 42, 35, 20, 8],
                    }}
                    facultyData={classStats.facultyDetails}
                    majorData={classStats.majorDetails}
                />
                
                <FilterableChart
                    title="Phân bố lớp theo năm học"
                    chartType="pie"
                    entityType="classes"
                    defaultData={{
                        labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
                        data: [32, 30, 28, 25, 5],
                    }}
                    facultyData={{
                        'Công nghệ thông tin': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
                            data: [8, 8, 7, 6, 3]
                        },
                        'Kỹ thuật điện tử': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
                            data: [6, 6, 5, 5, 2]
                        },
                        'Quản trị kinh doanh': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
                            data: [6, 5, 5, 4]
                        },
                        'Ngoại ngữ': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
                            data: [5, 5, 4, 4]
                        },
                        'Kinh tế': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
                            data: [4, 4, 4, 3]
                        },
                        'Cơ khí': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
                            data: [3, 2, 3, 3, 0]
                        }
                    }}
                    majorData={{
                        'Kỹ thuật phần mềm': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
                            data: [3, 3, 3, 2]
                        },
                        'Trí tuệ nhân tạo': { 
                            labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
                            data: [2, 2, 2, 1]
                        }
                    }}
                />
            </div>

            {/* Faculty Charts */}
            <h3 className="text-xl font-bold mt-8 mb-4">Thông tin chi tiết khoa</h3>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* Faculty Department Distribution */}
                <Card className="col-span-1">
                    <CardContent className="p-6">
                        <PieChart
                            title="Phân bố số lượng ngành theo khoa"
                            labels={facultyStats.byDepartment.labels}
                            data={facultyStats.byDepartment.data}
                        />
                    </CardContent>
                </Card>

                {/* Faculty Student Distribution */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardContent className="p-6">
                        <BarChart
                            title="Số lượng sinh viên theo khoa"
                            labels={facultyStats.studentDistribution.labels}
                            datasets={[
                                {
                                    label: 'Sinh viên',
                                    data: facultyStats.studentDistribution.data,
                                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                }
                            ]}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Trend Charts */}
            <h3 className="text-xl font-bold mt-8 mb-4">Phân tích xu hướng</h3>
            
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Student Enrollment Trend */}
                <Card>
                    <CardContent className="p-6">
                        <LineChart
                            title="Xu hướng tuyển sinh theo năm"
                            labels={studentStats.enrollmentTrend.labels}
                            datasets={[
                                {
                                    label: 'Số sinh viên',
                                    data: studentStats.enrollmentTrend.data,
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    fill: true,
                                }
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* Course Enrollment by Month */}
                <Card>
                    <CardContent className="p-6">
                        <LineChart
                            title="Số lượng đăng ký khóa học theo tháng"
                            labels={courseStats.enrollmentByMonth.labels}
                            datasets={courseStats.enrollmentByMonth.datasets}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
