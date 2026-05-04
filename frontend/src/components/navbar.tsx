"use client";

import Link from "next/link";
import { Scale, Home, Building2, LayoutDashboard, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/compare", label: "Compare", icon: Scale },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white">C</div>
              <span className="font-black tracking-tighter text-white">COMPENSATION_INTELLIGENCE_SYSTEM</span>
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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">System Online</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden pt-20 px-6"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border ${pathname === link.href ? 'bg-primary/10 border-primary/20 text-primary' : 'border-white/5 text-slate-400'}`}
                >
                  <link.icon size={20} />
                  <span className="font-bold">{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
