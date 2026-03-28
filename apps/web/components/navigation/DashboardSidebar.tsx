'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    TrendingUp,
    Calendar,
    Settings as SettingsIcon,
    LogOut,
    Shield,
    BarChart3,
    Target,
    Calculator,
    Users,
    Import,
    Flame,
    Gavel,
    Menu,
    ChevronLeft,
    ChevronRight,
    LayoutGrid
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function DashboardSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { icon: <Home size={isCollapsed ? 22 : 18} />, label: 'OVERVIEW', href: '/dashboard', id: 'sidebar-overview' },
        { icon: <Import size={isCollapsed ? 22 : 18} />, label: 'PORTFOLIO X-RAY', href: '/dashboard/portfolio', id: 'sidebar-portfolio' },
        { icon: <Shield size={isCollapsed ? 22 : 18} />, label: 'MONEY HEALTH', href: '/dashboard/health', id: 'sidebar-health' },
        { icon: <TrendingUp size={isCollapsed ? 22 : 18} />, label: 'ANALYTICS', href: '/dashboard/analytics', id: 'sidebar-analytics' },
        { icon: <BarChart3 size={isCollapsed ? 22 : 18} />, label: 'MARKET TRENDS', href: '/dashboard/market', id: 'sidebar-market' },
        { icon: <Target size={isCollapsed ? 22 : 18} />, label: 'LIFE PLANNER', href: '/dashboard/life-planner', id: 'sidebar-life-planner' },
        { icon: <Calculator size={isCollapsed ? 22 : 18} />, label: 'TAX WIZARD', href: '/dashboard/tax-wizard', id: 'sidebar-tax-wizard' },
        { icon: <Calendar size={isCollapsed ? 22 : 18} />, label: 'REPORTS', href: '/dashboard/reports', id: 'sidebar-reports' },
        { icon: <Flame size={isCollapsed ? 22 : 18} />, label: 'FIRE PROTOCOL', href: '/dashboard/fire', id: 'sidebar-fire' },
        { icon: <Gavel size={isCollapsed ? 22 : 18} />, label: 'LEGAL ARCHIVES', href: '/disclaimer', id: 'sidebar-legal' },
        { icon: <Users size={isCollapsed ? 22 : 18} />, label: 'SUPPORT', href: '/dashboard/support', id: 'sidebar-support' },
    ];


    return (
        <aside className="hidden md:flex flex-col h-screen sticky top-0 bg-background border-r border-border/50 transition-all duration-500 z-30 group" style={{ width: isCollapsed ? '80px' : '280px' }}>
            {/* Logo/Header Section */}
            <div id="sidebar-oracle" className={`p-6 border-b border-border/50 flex items-center transition-all ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_20px_rgba(212,175,55,0.1)] shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <img src="/logo.png" alt="NiveshIQ" className="w-6 h-6 object-contain" />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                        <span className="text-lg font-black font-barlow-condensed tracking-widest text-accent uppercase leading-none">NIVESHIQ</span>
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mt-1">Sovereign Layer 01</span>
                    </div>
                )}
            </div>

            {/* Collapse Trigger - Only visible on hover */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-accent rounded-full text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg border border-background/20 z-50 invisible md:visible"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Menu Items */}
            <nav className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent py-6 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`} id="sidebar-nav">
            <AnimatePresence>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            id={item.id}
                            title={isCollapsed ? item.label : ''}
                            className={`
                                flex items-center gap-4 py-3.5 rounded-xl transition-all duration-500 group relative
                                ${isActive 
                                    ? 'bg-accent/10 text-accent border border-accent/20' 
                                    : 'text-muted-foreground/60 hover:bg-white/[0.03] hover:text-white border border-transparent'
                                }
                                ${isCollapsed ? 'justify-center px-0' : 'px-4'}
                            `}
                        >
                            {isActive && !isCollapsed && (
                                <motion.div 
                                    layoutId="active-indicator"
                                    className="absolute left-0 w-1 h-6 bg-accent rounded-r-full shadow-[4px_0_15px_rgba(212,175,55,0.5)]" 
                                />
                            )}
                            <div className={`transition-all duration-500 ${isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <span className="text-[11px] font-black font-barlow-condensed tracking-[0.2em] uppercase transition-all duration-500 animate-in fade-in slide-in-from-left-2 whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
                </AnimatePresence>
            </nav>

            {/* Footer Profiling */}
            {!isCollapsed && (
                <div id="sidebar-profile" className="p-6 border-t border-border/10 bg-white/[0.01]">

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-accent text-sm">
                            OP
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Operator Node</span>
                            <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Active Link Established</span>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
