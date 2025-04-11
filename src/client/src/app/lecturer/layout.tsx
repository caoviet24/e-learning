'use client';
import React from 'react';
import Header from '@/components/layouts/header';
import { NavbarLecturer } from '@/components/layouts/navbar-lecturer';
import { ToastContainer } from 'react-toastify';

function LecturerLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="relative">
            <Header isOpen={isOpen} setIsOpen={setIsOpen} backHref='/lecturer'/>
            <NavbarLecturer isOpen={isOpen} setIsOpen={setIsOpen} />
            <main className="sm:pl-64">{children}</main>
            <ToastContainer />
        </div>
    );
}

export default LecturerLayout;