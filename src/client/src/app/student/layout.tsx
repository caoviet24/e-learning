'use client';
import React from 'react';
import Header from '@/components/layouts/header';
import { NavbarStudent } from '@/components/layouts/navbar-student';

function StudentLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="relative min-h-screen">
            <Header isOpen={isOpen} setIsOpen={setIsOpen} backHref='/student' />
            <NavbarStudent isOpen={isOpen} setIsOpen={setIsOpen} />
            <main className="sm:pl-64">{children}</main>
        </div>
    );
}

export default StudentLayout;
