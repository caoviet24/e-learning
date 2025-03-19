'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const newsItems = [
  {
    id: 1,
    title: "Thông báo lịch thi cuối kỳ học kỳ 2 năm học 2024-2025",
    description: "Phòng Đào tạo thông báo lịch thi cuối kỳ học kỳ 2 năm học 2024-2025 cho sinh viên các khoa...",
    date: "2024-03-19",
    author: "Phòng Đào tạo",
    image: "/images/utehy-logo.png"
  },
  {
    id: 2,
    title: "Thông báo về việc nghỉ lễ Giỗ tổ Hùng Vương 2024",
    description: "Trường thông báo lịch nghỉ lễ Giỗ tổ Hùng Vương năm 2024 cho toàn thể cán bộ, giảng viên và sinh viên...",
    date: "2024-03-15",
    author: "Phòng Hành chính",
    image: "/images/utehy-logo.png"
  },
  {
    id: 3,
    title: "Thông báo đăng ký học phần học kỳ 1 năm học 2024-2025",
    description: "Phòng Đào tạo thông báo kế hoạch đăng ký học phần học kỳ 1 năm học 2024-2025...",
    date: "2024-03-10",
    author: "Phòng Đào tạo",
    image: "/images/utehy-logo.png"
  }
];

export default function NewsPage() {
  return (
    <div className="container py-6 space-y-4">
      <h1 className="text-3xl font-bold">Tin tức & Thông báo</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((news) => (
          <Card key={news.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{news.title}</CardTitle>
              <CardDescription>{news.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {news.description}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Người đăng: {news.author}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}