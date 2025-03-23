'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setMyAcount } from '@/redux/slices/account.slice';
import { useAppDispatch } from '@/redux/store';
import { accountService } from '@/services/accountService';
import { useQuery } from '@tanstack/react-query';
import { Building2, GraduationCap, Newspaper } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminPage() {
    const stats = [
        {
            title: 'Tổng số khoa',
            value: '12',
            icon: Building2,
            color: 'text-sky-500',
        },
        {
            title: 'Tổng số giáo viên',
            value: '120',
            icon: GraduationCap,
            color: 'text-violet-500',
        },
        {
            title: 'Tổng số tin tức',
            value: '45',
            icon: Newspaper,
            color: 'text-pink-500',
        },
    ];

    const dispatch = useAppDispatch();

    const {
        data: authData,
        isError: isAuthError,
        isSuccess: isAuthSuccess,
        error
    } = useQuery<{account: any}>({
        queryKey: ['auth'],
        queryFn: accountService.auth,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    useEffect(() => {
        if (error) {
            console.error('Auth error:', error);
        }
    }, [error]);

    useEffect(() => {
        if (isAuthSuccess) {
            dispatch(setMyAcount(authData.account));
        }
    }, [isAuthSuccess, isAuthError]);

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Tổng quan về khoa, giáo viên và tin tức</p>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
