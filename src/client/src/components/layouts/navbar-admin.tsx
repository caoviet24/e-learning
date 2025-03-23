"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, GraduationCap, Newspaper, Users } from "lucide-react";

const routes = [
  {
    label: "Khoa",
    icon: Building2,
    href: "/admin/faculty",
    color: "text-sky-500",
  },
  {
    label: "Giảng viên",
    icon: GraduationCap,
    href: "/admin/teachers",
    color: "text-violet-500",
  },
  {
    label: "Sinh viên",
    icon: Users,
    href: "/admin/students",
    color: "text-emerald-500",
  },
  {
    label: "Tin tức",
    icon: Newspaper,
    href: "/admin/news",
    color: "text-pink-500",
  },
];

const NavbarAdmin = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;