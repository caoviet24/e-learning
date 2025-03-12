'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';

const navigationItems = [
    { name: 'Dashboard', href: '/', icon: '/window.svg', active: true },
    { name: 'Courses', href: '/courses', icon: '/file.svg', active: false },
    { name: 'Resources', href: '#', icon: '/globe.svg', active: false },
];

interface NavbarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function Navbar({ isOpen, setIsOpen }: NavbarProps) {
    return (
        <div>
            <nav
                className={`
                fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-background border-r
                transition-transform duration-200 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:top-16
                `}
            >
                <div className="h-full flex flex-col">
                    <div className="flex-1 px-4 py-2 relative">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Image src={item.icon} alt={item.name} width={20} height={20} className="dark:invert" />
                                {item.name}
                            </Link>
                        ))}

                        <div className="absolute left-0 bottom-0 w-full px-4 py-2 md:hidden">
                            <Link
                                href="/sign-in"
                                className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <User className="w-5 h-5" />
                                <span>Sign In</span>
                            </Link>
                        </div>
                    </div>

                    <div className="p-6 border-t">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
