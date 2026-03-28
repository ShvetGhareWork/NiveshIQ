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
    Inbox,
    Flame,
    Gavel,
    ChevronLeft,
    ChevronRight,
    CircleDot
} from 'lucide-react';
import { useState } from 'react';

export function DashboardSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { icon: <Home size={20} />, label: 'Overview', href: '/dashboard', id: 'sidebar-overview' },
        { icon: <Inbox size={20} />, label: 'Portfolio X-Ray', href: '/dashboard/portfolio', id: 'sidebar-portfolio' },
        { icon: <Shield size={20} />, label: 'Money Health', href: '/dashboard/health', id: 'sidebar-health' },
        { icon: <TrendingUp size={20} />, label: 'Analytics', href: '/dashboard/analytics', id: 'sidebar-analytics' },
        { icon: <BarChart3 size={20} />, label: 'Market Trends', href: '/dashboard/market', id: 'sidebar-market' },
        { icon: <CircleDot size={20} />, label: 'Life Planner', href: '/dashboard/life-planner', id: 'sidebar-life-planner' },
        { icon: <Calculator size={20} />, label: 'Tax Wizard', href: '/dashboard/tax-wizard', id: 'sidebar-tax-wizard' },
        { icon: <Calendar size={20} />, label: 'Reports', href: '/dashboard/reports', id: 'sidebar-reports' },
        { icon: <BarChart3 size={20} />, label: 'FIRE Protocol', href: '/dashboard/fire', id: 'sidebar-fire' },
    ];

    return (
        <aside 
            className="hidden md:flex flex-col h-screen sticky top-0 bg-[#0A0F1E] border-r border-white/5 transition-all duration-500 z-30 group" 
            style={{ width: isCollapsed ? '80px' : '280px' }}
        >
            {/* Header / Logo Section */}
            <div id="sidebar-oracle" className={`p-8 pb-10 flex items-center transition-all ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.03)] group-hover:border-accent/40 transition-all">
                        <img src="/logo.png" alt="NiveshIQ" className="w-6 h-6 object-contain" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex items-baseline gap-1 animate-in fade-in duration-700">
                                            <span className="text-xl font-black font-barlow-condensed tracking-tight text-accent uppercase leading-none">NIVESHIQ</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapse Trigger */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 w-6 h-6 bg-accent rounded-full text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg border border-background/20 z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation Nodes */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar py-2" id="sidebar-nav">
                <AnimatePresence>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                id={item.id}
                                className={`
                                    flex items-center gap-4 py-3.5 rounded-xl transition-all duration-300 relative group/item
                                    ${isActive 
                                        ? 'bg-white/[0.04] text-accent border border-accent/30 shadow-[0_0_25px_rgba(212,175,55,0.1)]' 
                                        : 'text-white/40 hover:bg-white/[0.02] hover:text-white/90 border border-transparent'
                                    }
                                    ${isCollapsed ? 'justify-center px-0' : 'px-5'}
                                `}
                            >
                                <div className={`transition-all duration-300 ${isActive ? 'text-accent' : 'group-hover/item:text-white'}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && (
                                    <span className="text-[12px] font-bold font-barlow tracking-tight transition-all duration-500 whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </AnimatePresence>
            </nav>

            {/* Footer Profiling */}
            <div className={`mt-auto p-4 border-t border-white/5 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <Link 
                    id="sidebar-settings"
                    href="/dashboard/settings"
                    className={`flex items-center gap-4 py-3.5 rounded-xl transition-all duration-300 ${pathname === '/dashboard/settings' ? 'text-accent' : 'text-white/40 hover:text-white/90'} ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}
                >
                    <SettingsIcon size={20} />
                    {!isCollapsed && <span className="text-[12px] font-bold font-barlow tracking-tight">Settings</span>}
                </Link>
                <Link 
                    href="/auth/login"
                    className={`flex items-center gap-4 py-3.5 rounded-xl text-white/40 hover:text-rose-400 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}
                >
                    <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 font-black text-[10px] text-white/60 group-hover:border-rose-400/30 transition-all">
                        N
                    </div>
                    {!isCollapsed && <span className="text-[12px] font-bold font-barlow tracking-tight">Logout</span>}
                </Link>
            </div>
        </aside>
    );
}

