'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    User,
    Home,
    Newspaper,
    FileText,
    Globe,
    ClipboardList,
    BookOpen,
    Bell
} from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';

const navigationItems = [
    { name: 'Trang chủ', href: '/', icon: Home, active: true },
    { name: 'Tin tức', href: '#', icon: Newspaper, active: false },
    { name: 'Khóa học của tôi', href: '/learning', icon: FileText, active: false },
    { name: 'Quản lý lớp học', href: '/classes', icon: Globe, active: false },
    { name: 'Làm bài thi', href: '/exams', icon: ClipboardList, active: false },
    { name: 'Bài tập', href: '/homeworks', icon: BookOpen, active: false },
    { name: 'Thông báo', href: '#', icon: Bell, active: false },
];

interface NavbarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function Navbar({ isOpen, setIsOpen }: NavbarProps) {
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

                        <div className="absolute left-0 bottom-0 w-full px-4 py-2 md:hidden">
                            <Link
                                href="/sign-in"
                                className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <User className="w-5 h-5" />
                                <span>Sign In</span>
                            </Link>
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
