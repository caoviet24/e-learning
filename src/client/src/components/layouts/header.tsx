import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/store';
import RenderWithCondition from '../RenderWithCondition/RenderWithCondition';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NotificationDrawer } from '../notification-drawer';
import { Badge } from '@/components/ui/badge';
import { accountService } from '@/services/accountService';

interface HeaderProps {
    backHref?: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function Header({ isOpen, setIsOpen, backHref }: HeaderProps) {
    const { my_account } = useAppSelector((state) => state.sessionStorage.account);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const unreadCount = 3; // This should come from your notification service/state

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b h-16 px-8">
            <div className="flex items-center justify-between h-full gap-4">
                <Link href={backHref || '/'} className="flex items-center gap-2">
                    <Image
                        src="/images/utehy-logo.png"
                        alt="UTEHY Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
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
                    <RenderWithCondition condition={!my_account}>
                        <div className="hidden sm:flex gap-2">
                            <Button variant="outline">
                                <Link href="/sign-in">Đăng nhập</Link>
                            </Button>
                        </div>
                    </RenderWithCondition>

                    <RenderWithCondition condition={!!my_account} className="hidden md:flex gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setNotificationOpen(true)}
                                className="relative"
                            >
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

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar className="cursor-pointer hover:opacity-80">
                                            <AvatarImage src={my_account?.user?.avatar} alt="Avatar" />
                                            <AvatarFallback>{my_account?.username}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start flex"
                                                
                                            >
                                                <User />
                                                <Link href="/profile">{my_account?.user?.full_name} Nguyen Van Anhh</Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start flex"
                                                onClick={() => accountService.logout()}
                                            >
                                                <ArrowLeft />
                                                <span>Đăng xuất</span>
                                            </Button>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </RenderWithCondition>

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
