'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const notifications = [
  {
    id: 1,
    title: "Nhắc nhở nộp bài tập",
    message: "Bài tập môn Công nghệ Web sẽ hết hạn trong 2 ngày",
    date: "2024-03-19",
    type: "warning"
  },
  {
    id: 2,
    title: "Điểm danh thành công",
    message: "Bạn đã điểm danh thành công môn học Công nghệ Web ngày 19/03/2024",
    date: "2024-03-19",
    type: "success"
  },
  {
    id: 3,
    title: "Lịch thi cập nhật",
    message: "Lịch thi môn Công nghệ Web đã được cập nhật, vui lòng kiểm tra",
    date: "2024-03-18",
    type: "info"
  }
];

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90%] sm:w-[440px]">
          <SheetHeader>
            <SheetTitle>Thông báo</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{notification.title}</h3>
                  <Badge variant={
                    notification.type === "warning" ? "destructive" :
                    notification.type === "success" ? "default" :
                    "secondary"
                  }>
                    {notification.type === "warning" ? "Cảnh báo" :
                     notification.type === "success" ? "Thành công" :
                     "Thông tin"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.message}
                </p>
                <time className="text-xs text-muted-foreground">
                  {notification.date}
                </time>
              </div>
            ))}
          </div>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetContent>
    </Sheet>
  );
}