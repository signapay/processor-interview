"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center p-2 rounded ${isActive ? 'bg-blue-100' : 'hover:bg-blue-100'}`}
        >
            {children}
        </Link>
    );
}
