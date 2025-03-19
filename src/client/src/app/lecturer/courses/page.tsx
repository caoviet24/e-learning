'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Video } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Lập trình web nâng cao",
      description: "ReactJS, NodeJS, MongoDB",
      totalLessons: 12,
      totalVideos: 8,
      totalStudents: 45
    },
    {
      id: 2,  
      title: "Cơ sở dữ liệu",
      description: "SQL, Database Design",
      totalLessons: 10,
      totalVideos: 6,
      totalStudents: 32
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
        <Link href="/lecturer/courses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm khóa học
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tổng số bài học:</span>
                  <span className="font-medium">{course.totalLessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Videos đã tải lên:</span>
                  <span className="font-medium">{course.totalVideos}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Sinh viên đăng ký:</span>
                  <span className="font-medium">{course.totalStudents}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Link href={`/lecturer/courses/${course.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Chỉnh sửa
                  </Button>
                </Link>
                <Link href={`/lecturer/courses/${course.id}/videos`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Videos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}