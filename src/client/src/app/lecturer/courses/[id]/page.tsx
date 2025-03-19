'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditCoursePage() {
  const { id } = useParams();
  const isNewCourse = id === 'new';

  // Mock data for existing course
  const course = !isNewCourse ? {
    id: parseInt(id as string),
    title: "Lập trình web nâng cao",
    description: "ReactJS, NodeJS, MongoDB",
    detailedDescription: "Khóa học này sẽ giúp bạn nắm vững các công nghệ web hiện đại...",
    requirements: "Có kiến thức cơ bản về HTML, CSS, JavaScript",
    outcomes: "- Xây dựng được ứng dụng web fullstack\n- Triển khai ứng dụng lên cloud\n- Làm việc với cơ sở dữ liệu",
  } : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save course
    console.log('Save course');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/lecturer/courses">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isNewCourse ? 'Thêm khóa học mới' : 'Chỉnh sửa khóa học'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tên khóa học</Label>
              <Input
                id="title"
                defaultValue={course?.title}
                placeholder="Nhập tên khóa học"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả ngắn</Label>
              <Input
                id="description"
                defaultValue={course?.description}
                placeholder="Nhập mô tả ngắn về khóa học"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Mô tả chi tiết</Label>
              <Textarea
                id="detailedDescription"
                defaultValue={course?.detailedDescription}
                placeholder="Nhập mô tả chi tiết về khóa học"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Yêu cầu</Label>
              <Textarea
                id="requirements"
                defaultValue={course?.requirements}
                placeholder="Nhập các yêu cầu để tham gia khóa học"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcomes">Kết quả đạt được</Label>
              <Textarea
                id="outcomes"
                defaultValue={course?.outcomes}
                placeholder="Nhập những kết quả học viên sẽ đạt được"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/lecturer/courses">
                <Button variant="outline" type="button">
                  Hủy
                </Button>
              </Link>
              <Button type="submit">
                {isNewCourse ? 'Thêm khóa học' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}