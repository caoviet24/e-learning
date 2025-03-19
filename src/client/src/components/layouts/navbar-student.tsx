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
    Bell,
    LogOut
} from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { useEffect, useState } from 'react';
import { NotificationDrawer } from '../notification-drawer';
import { accountService } from '@/services/accountService';
import Cookies from 'js-cookie';

interface NavItem {
    name: string;
    href: string;
    icon: any;
    active: boolean;
    onClick?: () => void;
}

interface NavbarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function NavbarStudent({ isOpen, setIsOpen }: NavbarProps) {
    const [username, setUsername] = useState<string | undefined>();
    const [notificationOpen, setNotificationOpen] = useState(false);
    
    useEffect(() => {
        const usernameCookie = Cookies.get('username');
        setUsername(usernameCookie);
    }, []);

    const handleLogout = () => {
        accountService.logout();
    };

    const navigationItems: NavItem[] = [
        { name: 'Trang chủ', href: '/student/', icon: Home, active: true },
        { name: 'Tin tức', href: '/student/news', icon: Newspaper, active: false },
        { name: 'Khóa học của tôi', href: '/student/learning', icon: FileText, active: false },
        { name: 'Lớp học của tôi', href: '/student/classes', icon: Globe, active: false },
        { name: 'Làm bài thi', href: '/student/exams', icon: ClipboardList, active: false },
        { name: 'Bài tập', href: '/student/homeworks', icon: BookOpen, active: false },
        {
            name: 'Thông báo',
            href: '#',
            icon: Bell,
            active: false,
            onClick: () => setNotificationOpen(true)
        },
    ];

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
                                href={item.onClick ? '#' : item.href}
                                className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                                onClick={(e) => {
                                    if (item.onClick) {
                                        e.preventDefault();
                                        item.onClick();
                                    }
                                    setIsOpen(false);
                                }}
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
                                    className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
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
            <NotificationDrawer
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
            />
        </div>
    );
}
