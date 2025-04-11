'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { NotificationDrawer } from '../notification-drawer';
import { Badge } from '@/components/ui/badge';
import UserProfile from '../user-profile';
import { useUser } from '@/hooks/useUser';

interface HeaderProps {
    backHref?: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function Header({ isOpen, setIsOpen, backHref }: HeaderProps) {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const unreadCount = 3;
    const { user } = useUser();

    console.log('Header user', user);
    

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b h-16 px-8">
            <div className="flex items-center justify-between h-full gap-4">
                <Link href={backHref || '/'} className="flex items-center gap-2">
                    <Image src="/images/utehy-logo.png" alt="UTEHY Logo" width={40} height={40} className="object-contain" />
                    <span className="font-semibold text-xl hidden md:block">UTEHY E-Learning</span>
                </Link>

                <div className="flex-1 max-w-screen-md">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Notification button - only show when signed in */}
                    {user && (
                        <div className="hidden md:flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => setNotificationOpen(true)} className="relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 rounded-full text-[10px]"
                                    >
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* User Profile component */}
                    <div className="hidden md:flex">
                        <UserProfile />
                    </div>

                    {/* Mobile menu button */}
                    <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            <NotificationDrawer open={notificationOpen} onOpenChange={setNotificationOpen} />
        </header>
    );
}
