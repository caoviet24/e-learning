'use client';

import Link from 'next/link';
import { User, Home, Newspaper, FileText, Globe, ClipboardList, BookOpen, Bell, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { useEffect, useState } from 'react';
import { NotificationDrawer } from '../notification-drawer';
import { accountService } from '@/services/accountService';
import Cookies from 'js-cookie';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAppSelector } from '@/redux/store';
import RenderWithCondition from '@/components/RenderWithCondition/RenderWithCondition';

interface NavItem {
    name: string;
    href: string;
    icon: any;
    active: boolean;
    onClick?: () => void;
    showOnMobile?: boolean;
}

interface NavbarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function NavbarLecturer({ isOpen, setIsOpen }: NavbarProps) {
    const [username, setUsername] = useState<string | undefined>();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const unreadCount = 3; // This should come from your notification service/state
    const { my_account } = useAppSelector((state) => state.sessionStorage.account);

    useEffect(() => {
        const usernameCookie = Cookies.get('username');
        setUsername(usernameCookie);
    }, []);

    const handleLogout = () => {
        accountService.logout();
    };

    const navigationItems: NavItem[] = [
        { name: 'Trang chủ', href: '/lecturer/', icon: Home, active: true },
        { name: 'Tin tức', href: '/lecturer/news', icon: Newspaper, active: false },
        { name: 'Quản lý khoá học ', href: '/lecturer/courses', icon: FileText, active: false },
        { name: 'Lớp học của tôi', href: '/lecturer/classes', icon: Globe, active: false },
        { name: 'Quản lý bài thi', href: '/lecturer/exams', icon: ClipboardList, active: false },
        { name: 'Bài tập', href: '/lecturer/homeworks', icon: BookOpen, active: false },
        {
            name: 'Thông báo',
            href: '#',
            icon: Bell,
            active: false,
            onClick: () => setNotificationOpen(true),
            showOnMobile: true,
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
                    <RenderWithCondition condition={!!my_account}>
                        <div className="px-8 py-4 border-b md:hidden">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={my_account?.user?.avatar} alt="Avatar" />
                                    <AvatarFallback>{my_account?.username}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{my_account?.username}</div>
                                    <div className="text-sm text-muted-foreground">Sinh viên</div>
                                </div>
                            </div>
                        </div>
                    </RenderWithCondition>

                    <div className="flex-1 px-4 py-2 relative">
                        {/* Navigation Items */}
                        {navigationItems.map((item) =>
                            item.showOnMobile ? (
                                <Link
                                    key={item.name}
                                    href={item.onClick ? '#' : item.href}
                                    className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors md:hidden relative"
                                    onClick={(e) => {
                                        if (item.onClick) {
                                            e.preventDefault();
                                            item.onClick();
                                        }
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="relative">
                                        <item.icon className="w-5 h-5" />
                                        {item.name === 'Thông báo' && unreadCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 rounded-full text-[10px]"
                                            >
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                    {item.name}
                                </Link>
                            ) : (
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
                            ),
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t space-y-4">
                        <RenderWithCondition condition={!!my_account}>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-red-500 rounded-lg hover:bg-accent hover:text-red-600 transition-colors w-full md:hidden"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Đăng xuất</span>
                            </button>
                        </RenderWithCondition>
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
            <NotificationDrawer open={notificationOpen} onOpenChange={setNotificationOpen} />
        </div>
    );
}
