'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './SockerProvider';
import ReduxProvider from './ReduxProvider';
import { UserProvider } from './UserProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000 * 30, // 30 minutes
            refetchOnWindowFocus: false,
        },
    },
});

export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <SocketProvider>
            <ReduxProvider>
                <QueryClientProvider client={queryClient}>
                    <UserProvider>{children}</UserProvider>
                </QueryClientProvider>
            </ReduxProvider>
        </SocketProvider>
    );
}
