'use client';

import Link from 'next/link';
import {
    User,
    Home,
    Users,
    FileText,
    BookOpen,
    ClipboardList,
    Bell,
    LogOut
} from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { useEffect, useState } from 'react';
import { accountService } from '@/services/accountService';
import Cookies from 'js-cookie';

const navigationItems = [
    { name: 'Trang chủ', href: '/lecturer', icon: Home, active: true },
    { name: 'Quản lý sinh viên', href: '/lecturer/students', icon: Users, active: false },
    { name: 'Quản lý khóa học', href: '/lecturer/courses', icon: FileText, active: false },
    { name: 'Bài tập', href: '/lecturer/homeworks', icon: BookOpen, active: false },
    { name: 'Đề thi', href: '/lecturer/exams', icon: ClipboardList, active: false },
    { name: 'Thông báo', href: '#', icon: Bell, active: false },
];

interface NavbarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function NavbarLecturer({ isOpen, setIsOpen }: NavbarProps) {
    const [username, setUsername] = useState<string | undefined>();
    
    useEffect(() => {
        const usernameCookie = Cookies.get('username');
        setUsername(usernameCookie);
    }, []);

    const handleLogout = () => {
        accountService.logout();
    };

    return (
        <div>
            <nav
                className={`
                fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-background border-r
                transition-transform duration-200 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:top-16
                `}
            >
                <div className="h-full flex flex-col">
                    <div className="flex-1 px-4 py-2 relative">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}

                        <div className="absolute left-0 bottom-0 w-full px-4 py-2">
                            {username ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground">
                                        <User className="w-5 h-5" />
                                        <span>{username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-red-500 rounded-lg hover:bg-accent hover:text-red-600 transition-colors w-full"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/sign-in"
                                    className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Đăng nhập</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
