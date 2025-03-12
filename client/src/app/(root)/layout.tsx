'use client'

import Header from '@/components/layouts/header'
import { Navbar } from '@/components/layouts/navbar'
import React, { useState } from 'react'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative min-h-screen">
            <Header isOpen={isOpen} setIsOpen={setIsOpen} />
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
            <main className="mt-4 md:pl-64">
                {children}
            </main>
        </div>
    )
}
