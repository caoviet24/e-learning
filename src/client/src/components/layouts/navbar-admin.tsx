'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, GraduationCap, Newspaper, Users, BookOpen, LayoutGrid, BookText, Home, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';

const routes = [
    {
        label: 'Dashboard',
        icon: Home,
        href: '/admin',
        color: 'text-sky-500',
    },
    {
        label: 'Khoa',
        icon: Building2,
        href: '/admin/faculty',
        color: 'text-sky-500',
    },
    {
        label: 'Chuyên ngành',
        icon: BookOpen,
        href: '/admin/majors',
        color: 'text-orange-500',
    },
    {
        label: 'Khóa học',
        icon: BookText,
        href: '/admin/courses',
        color: 'text-blue-500',
    },
    {
        label: 'Giảng viên',
        icon: GraduationCap,
        href: '/admin/lecturers',
        color: 'text-violet-500',
    },
    {
        label: 'Lớp học',
        icon: LayoutGrid,
        href: '/admin/classes',
        color: 'text-green-500',
    },
    {
        label: 'Sinh viên',
        icon: Users,
        href: '/admin/students',
        color: 'text-emerald-500',
    },
    {
        label: 'Tin tức',
        icon: Newspaper,
        href: '/admin/news',
        color: 'text-pink-500',
    },
    {
        label: 'Đăng xuất',
        icon: LogOut,
        color: 'text-red-500',
        isLogout: true,
    },
];

const NavbarAdmin = () => {
    const pathname = usePathname();

    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/auth/sign-in';
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => {
                        const isActive = pathname === route.href;

                        if (route.isLogout) {
                            return (
                                <button
                                    key={route.label}
                                    onClick={handleLogout}
                                    className={cn(
                                        'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                                        'text-zinc-400',
                                    )}
                                >
                                    <div className="flex items-center flex-1">
                                        <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                                        {route.label}
                                    </div>
                                </button>
                            );
                        }

                        if (!route.href) return null;

                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                                    isActive ? 'text-white bg-white/10' : 'text-zinc-400',
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NavbarAdmin;
