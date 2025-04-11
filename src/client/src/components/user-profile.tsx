'use client';

import { useUser } from '@/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';

export default function UserProfile() {
    const { user } = useUser();
    if (!user) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (!user) {
        return (
            <Button asChild variant="ghost" size="sm" className="rounded-full">
                <a href="/auth/sign-in">Đăng nhập</a>
            </Button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Avatar>
                            <AvatarImage src={user.avatar} alt="User Avatar" />
                            <AvatarFallback>{user?.full_name?.split(' ')[user.full_name.split(' ').length - 1].charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex flex-col">
                            <Button asChild size="sm" className="text-black">
                                <Link href="/lecturer/profile" className="font-semibold">
                                    {user.full_name}
                                </Link>
                            </Button>
                            <Button asChild size="sm" className="text-black">
                                <Link href="/auth/sign-out">Đăng xuất</Link>
                            </Button>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
