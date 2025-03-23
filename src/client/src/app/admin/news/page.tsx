"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface News {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([
    {
      id: 1,
      title: "Thông báo tuyển sinh năm 2024",
      content: "Trường Đại học Sư phạm Kỹ thuật Hưng Yên thông báo tuyển sinh...",
      image: "/news/tuyen-sinh-2024.jpg",
      author: "Admin",
      createdAt: "2024-03-22",
    },
    {
      id: 2,
      title: "Hội thảo khoa học công nghệ",
      content: "Hội thảo khoa học công nghệ với chủ đề...",
      image: "/news/hoi-thao.jpg",
      author: "Admin",
      createdAt: "2024-03-21",
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newNews, setNewNews] = useState<Omit<News, "id" | "createdAt">>({
    title: "",
    content: "",
    image: "",
    author: "",
  });

  const handleAdd = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    setNews([
      ...news,
      {
        id: news.length + 1,
        ...newNews,
        createdAt: currentDate,
      },
    ]);
    setNewNews({ title: "", content: "", image: "", author: "" });
    setIsAddOpen(false);
  };

  const handleDelete = (id: number) => {
    setNews(news.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý tin tức</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm tin tức mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm tin tức mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label>Tiêu đề</label>
                <Input
                  placeholder="Nhập tiêu đề"
                  value={newNews.title}
                  onChange={(e) =>
                    setNewNews({ ...newNews, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Nội dung</label>
                <Textarea
                  placeholder="Nhập nội dung"
                  className="min-h-[100px]"
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Hình ảnh</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // In a real app, you would upload the file to a server
                      setNewNews({ ...newNews, image: URL.createObjectURL(file) });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label>Tác giả</label>
                <Input
                  placeholder="Nhập tên tác giả"
                  value={newNews.author}
                  onChange={(e) =>
                    setNewNews({ ...newNews, author: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Thêm mới
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {item.content}
              </TableCell>
              <TableCell>{item.author}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}