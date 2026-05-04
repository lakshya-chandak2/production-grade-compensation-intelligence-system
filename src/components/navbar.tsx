"use client";

import Link from "next/link";
import { Scale, Home, Building2, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/compare", label: "Compare", icon: Scale },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white">C</div>
            <span className="font-black tracking-tighter text-white">COMP_INTEL</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${pathname === link.href ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Online</span>
        </div>
      </div>
    </nav>
  );
}
