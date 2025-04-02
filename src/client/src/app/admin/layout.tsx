'use client';

import NavbarAdmin from '@/components/layouts/navbar-admin';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import React from 'react';
import { ToastContainer } from 'react-toastify';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex">
            <div className="hidden md:flex">
                <NavbarAdmin />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-50">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <NavbarAdmin />
                </SheetContent>
            </Sheet>
            <div className="flex-1 overflow-y-auto">{children}</div>
            <ToastContainer />
        </div>
    );
}
