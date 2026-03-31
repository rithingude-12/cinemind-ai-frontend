'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { usePathname } from 'next/navigation';
import { LogOut, User, Home, Bookmark, BarChart2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { name: 'Discover', href: '/modes', icon: Sparkles },
        { name: 'Home', href: '/', icon: Home },
        { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
        { name: 'Insights', href: '/insights', icon: BarChart2 },
    ];

    if (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/onboarding') {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 bg-black/60 backdrop-blur-md border-b border-white/10 shadow-md shadow-black/30">
            <div className="max-w-[1240px] mx-auto w-full flex items-center justify-between">
                <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-80 transition-all flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-black" />
                    </div>
                    <span className="hidden sm:inline italic">CineMind<span className="text-gray-500 font-medium">AI</span></span>
                </Link>

                <div className="flex items-center gap-2">
                    {navItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className={`relative px-4 py-2 text-sm font-bold transition-all rounded-full group ${
                                pathname === item.href ? 'text-white' : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            {pathname === item.href && (
                                <motion.div 
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <item.icon size={14} className={pathname === item.href ? "text-purple-400" : ""} />
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link href="/profile" className={`p-2 rounded-lg transition-all ${pathname === '/profile' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                <User size={18} />
                            </Link>
                            <button 
                                onClick={logout} 
                                title="Logout"
                                className="p-2 text-gray-500 hover:text-red-400 transition-all"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="text-xs font-black text-white px-5 py-2 border border-white/20 rounded-xl hover:bg-white/10 transition-all uppercase tracking-[0.2em]">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
