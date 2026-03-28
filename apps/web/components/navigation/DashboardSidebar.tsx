'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    TrendingUp,
    Calendar,
    Settings as SettingsIcon,
    LogOut,
    Flame,
    Users,
    Calculator,
    Target,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    Shield,
    Gavel,
    Import
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

export function DashboardSidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Persist sidebar state
    useEffect(() => {
        const stored = localStorage.getItem('sidebar-collapsed');
        if (stored === 'true') setIsCollapsed(true);
        setIsLoaded(true);
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', String(newState));
    };

    const menuItems = [
        { icon: Home, label: 'OVERVIEW', href: '/dashboard' },
        { icon: Import, label: 'PORTFOLIO X-RAY', href: '/dashboard/portfolio' },
        { icon: Shield, label: 'MONEY HEALTH', href: '/dashboard/health' },
        { icon: TrendingUp, label: 'ANALYTICS', href: '/dashboard/analytics' },
        { icon: Target, label: 'LIFE PLANNER', href: '/dashboard/life-planner' },
        { icon: Calculator, label: 'TAX WIZARD', href: '/dashboard/tax-wizard' },
        { icon: Calendar, label: 'REPORTS', href: '/dashboard/reports' },
        { icon: Flame, label: 'FIRE PROTOCOL', href: '/dashboard/fire' },
        { icon: Gavel, label: 'LEGAL ARCHIVES', href: '/disclaimer' },
        { icon: Users, label: 'SUPPORT', href: '/dashboard/support' },
    ];

    return (
        <aside
            className={`hidden md:flex flex-col sticky top-0 h-screen bg-[#0A0F1E] border-r border-white/5 transition-all duration-300 ease-in-out group/sidebar ${isCollapsed ? 'w-20' : 'w-64'
                } ${!isLoaded ? 'duration-0 transition-none' : ''}`}
        >
            {/* Collapse Toggle Button - Subtle on hover */}
            <button
                onClick={toggleSidebar}
                className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 rounded-full bg-accent text-background flex items-center justify-center transition-all z-[60] shadow-lg scale-0 group-hover/sidebar:scale-100 duration-300`}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo Section */}
            <div className={`relative py-2.5 px-8 border-b border-white/5 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center p-0' : 'justify-start gap-4'}`}>
                {/* Logo Image */}
                <div className={`relative shrink-0 transition-all duration-700 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden hover:border-accent/50 group/logo ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
                    <img
                        src="/logo.png"
                        alt="NiveshIQ Logo"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover/logo:scale-105 transition-transform duration-700 p-1"
                    />
                </div>

                {!isCollapsed && (
                    <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="relative group/text">
                            <h1 className="text-2xl font-black font-barlow-condensed tracking-[0.1em] text-white leading-none uppercase select-none">
                                NIVESHIQ
                            </h1>
                            {/* Subtle Glitch Shadow */}

                        </div>
                        <p className="text-[10px] font-black font-barlow-condensed tracking-[0.4em] text-muted-foreground uppercase mt-2.5 opacity-30 select-none">
                            ORACLE SYSTEM
                        </p>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 py-8 space-y-2 overflow-y-auto custom-scrollbar min-h-0">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : ''}
                            className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-accent/10 text-accent border border-accent/20'
                                : 'text-muted-foreground/60 hover:bg-white/[0.04] hover:text-foreground border border-transparent hover:border-white/5'
                                } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                        >
                            <Icon size={18} className={`${isActive ? 'text-accent' : 'group-hover:text-accent'} transition-colors shrink-0`} />
                            {!isCollapsed && (
                                <span className="text-[11px] font-black font-barlow-condensed tracking-[0.15em] uppercase animate-in fade-in slide-in-from-left-2 lg:block whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-3 pb-8 pt-4 border-t border-white/5 space-y-2 relative">
                <Link
                    href="/dashboard/settings"
                    title={isCollapsed ? 'Settings' : ''}
                    className={`flex items-center gap-3 py-3 rounded-xl transition-all group ${pathname === '/dashboard/settings' ? 'bg-accent/10 text-accent' : 'text-muted-foreground/60 hover:text-foreground'} ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                >
                    <SettingsIcon size={18} className="group-hover:text-accent transition-colors shrink-0" />
                    {!isCollapsed && <span className="text-[11px] font-black font-barlow-condensed tracking-[0.15em] uppercase animate-in fade-in slide-in-from-left-2 whitespace-nowrap">SETTINGS</span>}
                </Link>
                <button
                    onClick={logout}
                    title={isCollapsed ? 'Logout' : ''}
                    className={`w-full flex items-center gap-3 py-3 rounded-xl text-muted-foreground/60 hover:bg-rose-500/10 hover:text-rose-500 transition-all group ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                >
                    <LogOut size={18} className="group-hover:text-rose-500 transition-colors shrink-0" />
                    {!isCollapsed && <span className="text-[11px] font-black font-barlow-condensed tracking-[0.15em] uppercase animate-in fade-in slide-in-from-left-2 whitespace-nowrap">LOGOUT</span>}
                </button>

            </div>
        </aside>
    );
}
