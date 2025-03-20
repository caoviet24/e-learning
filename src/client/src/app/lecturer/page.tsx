'use client';

import { accountService } from "@/services/accountService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function LecturerPage() {

    const {data: authData, isError: isAuthError, isSuccess: isAuthSuccess} = useQuery({
        queryKey: ['auth'],
        queryFn: accountService.auth,
        enabled: true
    });

    useEffect(() => {
        if (isAuthSuccess) {
            console.log(authData
            );
        }
    }, [isAuthSuccess, isAuthError]);


    
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Giảng Viên</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-2">Khóa học</h3>
                    <p className="text-muted-foreground">Quản lý các khóa học của bạn</p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-2">Sinh viên</h3>
                    <p className="text-muted-foreground">Quản lý danh sách sinh viên</p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-2">Bài tập & Đề thi</h3>
                    <p className="text-muted-foreground">Tạo và quản lý bài tập, đề thi</p>
                </div>
            </div>
        </div>
    );
}