'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { courseService, CourseStatistics } from '@/services/courseService';
import Spinner from '@/components/spinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface CourseStatisticsProps {
  courseId: string;
}

export function CourseStatisticsComponent({ courseId }: CourseStatisticsProps) {
  const [statistics, setStatistics] = useState<CourseStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await courseService.getStatistics(courseId);
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="md" />
        <span className="ml-2">Đang tải dữ liệu thống kê...</span>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg font-medium">{error || 'Không có dữ liệu thống kê'}</p>
        <p className="mt-2">Vui lòng thử lại sau</p>
      </div>
    );
  }

  // Prepare data for completion rate doughnut chart
  const completionRateData = {
    labels: ['Đã hoàn thành', 'Chưa hoàn thành'],
    datasets: [
      {
        data: [statistics.completionRate, 100 - statistics.completionRate],
        backgroundColor: ['#10b981', '#e5e7eb'],
        borderColor: ['#059669', '#d1d5db'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for weekly progress chart
  const weeklyProgressData = {
    labels: statistics.completionByWeek.map((item) => item.week),
    datasets: [
      {
        label: 'Số bài học hoàn thành',
        data: statistics.completionByWeek.map((item) => item.completions),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  // Prepare data for student progress chart
  const studentProgressData = {
    labels: statistics.studentProgress.map((item) => item.name),
    datasets: [
      {
        label: 'Tiến độ hoàn thành (%)',
        data: statistics.studentProgress.map((item) => item.progress),
        backgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số học sinh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tỉ lệ hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số bài học đã hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.lessonsCompleted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số bài học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalLessons}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tỉ lệ hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="w-48 h-48">
                <Doughnut
                  data={completionRateData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                          }
                        }
                      }
                    },
                    cutout: '70%',
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiến độ theo tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line
                data={weeklyProgressData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Số bài học hoàn thành',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Tuần',
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tiến độ của học sinh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={studentProgressData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Tiến độ (%)',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Học sinh',
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}