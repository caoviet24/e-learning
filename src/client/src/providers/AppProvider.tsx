'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './SockerProvider';
import ReduxProvider from './ReduxProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, //1 phút cache
            refetchOnWindowFocus: false,
        },
    },
});
export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <SocketProvider>
            <ReduxProvider>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </ReduxProvider>
        </SocketProvider>
    );
}
