"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: "/window.svg", active: true },
  { name: "Courses", href: "/courses", icon: "/file.svg", active: false },
  { name: "Resources", href: "#", icon: "/globe.svg", active: false },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open menu</span>
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navbar */}
      <nav className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-background border-r
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo & Brand */}
          <div className="p-6 flex items-center gap-2">
            <Image src="/window.svg" alt="Logo" width={24} height={24} className="dark:invert" />
            <span className="text-xl font-semibold">E-Learning</span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={20}
                  height={20}
                  className="dark:invert"
                />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle at bottom */}
          <div className="p-6 border-t">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}