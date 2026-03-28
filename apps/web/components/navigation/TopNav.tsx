'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Bell,
    Settings,
    User,
    Search,
    Menu,
    X,
    Home,
    TrendingUp,
    Target,
    Calculator,
    Calendar,
    BarChart3,
    Users,
    LogOut,
    Shield,
    Import
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';

interface TopNavProps {
    userName?: string;
    customLinks?: { label: string; href: string; icon?: React.ReactNode }[];
}

export function TopNav({ userName: propsUserName, customLinks }: TopNavProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const userName = propsUserName || user?.name || 'Operator';
    const pathname = usePathname();
    const [currentHash, setCurrentHash] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotiDropdown, setShowNotiDropdown] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleHash = () => setCurrentHash(window.location.hash);
        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    // Close menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowNotiDropdown(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
                setShowNotiDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: <Home size={18} />, label: 'Overview', href: '/dashboard' },
        { icon: <Import size={18} />, label: 'Portfolio X-Ray', href: '/dashboard/portfolio' },
        { icon: <Shield size={18} />, label: 'Money Health', href: '/dashboard/health' },
        { icon: <TrendingUp size={18} />, label: 'Analytics', href: '/dashboard/analytics' },
        { icon: <BarChart3 size={18} />, label: 'Market Trends', href: '/dashboard/market' },
        { icon: <Target size={18} />, label: 'Life Planner', href: '/dashboard/life-planner' },
        { icon: <Calculator size={18} />, label: 'Tax Wizard', href: '/dashboard/tax-wizard' },
        { icon: <Calendar size={18} />, label: 'Reports', href: '/dashboard/reports' },
        { icon: <BarChart3 size={18} />, label: 'FIRE Protocol', href: '/dashboard/fire' },
        { icon: <Shield size={18} />, label: 'Legal Archives', href: '/disclaimer' },
        { icon: <Users size={18} />, label: 'Support', href: '/dashboard/support' },
    ];

    return (
        <>
            {/* Reduced padding on mobile (px-4 py-3) to maximize space */}
            <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between gap-2 md:gap-4">

                    {/* Left - Mobile Menu Trigger & Navigation */}
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        <button
                            id="mobile-menu-trigger"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-all shrink-0"
                        >
                            <Menu size={20} />
                        </button>

                        <Link href="/dashboard" id="dashboard-logo" className="hidden sm:flex items-center gap-2 mr-4 group shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/10 group-hover:border-accent/40 transition-all p-1">
                                <img src="/logo.png" alt="NiveshIQ" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-sm font-black font-barlow-condensed tracking-widest text-accent uppercase group-hover:text-white transition-colors">NIVESHIQ</span>
                        </Link>

                        {/* Custom Links */}
                        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-w-0 mask-edges pb-1">
                            <div className="flex items-center gap-4 md:gap-8 min-w-max pr-4">
                                {customLinks?.map((item) => {
                                    const isHashLink = item.href.includes('#');
                                    const [basePath, hashPart] = item.href.split('#');

                                    const isActive = isHashLink
                                        ? (currentHash === `#${hashPart}` || (!currentHash && hashPart === 'account'))
                                        : (pathname === item.href && !currentHash);

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] font-barlow-condensed transition-all whitespace-nowrap border-b-2 py-1 ${isActive ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
                                        >
                                            {item.icon && (
                                                <span className="opacity-70 scale-90 md:scale-100">
                                                    {item.icon}
                                                </span>
                                            )}
                                            <span className="hidden sm:inline">{item.label}</span>
                                            <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right - Icons */}
                    <div className="flex items-center gap-1 sm:gap-4 shrink-0">
                        <div className="flex items-center gap-0.5 sm:gap-2 pr-2 sm:pr-4 border-r border-border/50">

                            <Link href="/dashboard/market/search" title="Search Node">
                                <button className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-all outline-none">
                                    <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                </button>
                            </Link>

                            <div className="relative" ref={notiRef}>
                                <button
                                    id="noti-trigger"
                                    onClick={() => setShowNotiDropdown(!showNotiDropdown)}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-all relative outline-none"
                                >
                                    <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-accent text-background text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotiDropdown && (
                                    <div className="fixed sm:absolute top-[60px] sm:top-full left-4 right-4 sm:left-auto sm:-right-2 sm:mt-4 w-auto sm:w-80 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-3 sm:p-4 border-b border-border/50 flex items-center justify-between">
                                            <h4 className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Live Intel Feed</h4>
                                            {notifications.length > 0 && (
                                                <button onClick={() => markAllAsRead()} className="text-[7px] sm:text-[8px] font-black text-accent uppercase tracking-widest hover:opacity-100 opacity-60">MUTE ALL</button>
                                            )}
                                        </div>
                                        <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`p-3 sm:p-4 border-b border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer ${!n.read ? 'bg-accent/5' : ''}`} onClick={() => {
                                                        markAsRead(n.id);
                                                        if (n.link) router.push(n.link);
                                                    }}>
                                                        <div className="flex items-start gap-2.5 sm:gap-3">
                                                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-accent animate-pulse' : 'bg-white/10'}`} />
                                                            <div className="space-y-1 pr-2">
                                                                <p className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-normal leading-none">{n.title}</p>
                                                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground leading-relaxed line-clamp-2 italic uppercase">{n.message}</p>
                                                                <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 sm:p-8 text-center">
                                                    <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase opacity-20 tracking-widest">No Intel Captured</p>
                                                </div>
                                            )}
                                        </div>
                                        <Link href="/dashboard/notifications" className="block p-2.5 sm:p-3 text-center border-t border-border/50 hover:bg-accent/10 transition-all rounded-b-2xl">
                                            <span className="text-[8px] sm:text-[9px] font-black text-accent uppercase tracking-[0.2em] sm:tracking-[0.3em]">DECRYPT ALL INTEL</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <button className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-all hidden sm:block">
                                <Settings className="w-[18px] h-[18px]" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 shrink-0">
                            <span className="text-sm font-medium text-muted-foreground hidden lg:block truncate max-w-[120px]">
                                {userName}
                            </span>
                            <Link href="/dashboard/settings" title="Profile Node" id="profile-trigger">
                                <button className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center font-bold text-xs sm:text-sm hover:bg-accent hover:text-primary transition-all shrink-0">
                                    {userName.charAt(0).toUpperCase()}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            <div className={`fixed top-0 left-0 bottom-0 z-[60] w-[280px] bg-card border-r border-border/50 transform transition-transform duration-300 md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 border-b border-border/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/10 overflow-hidden p-1">
                            <img src="/logo.png" alt="NiveshIQ" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold font-barlow-condensed tracking-widest text-accent uppercase">NIVESHIQ</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 -mr-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                                    ? 'bg-accent/10 text-accent border border-accent/20'
                                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border/50 space-y-1 shrink-0">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
                    >
                        <Settings size={18} />
                        <span className="text-sm font-semibold">Settings</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-red-400/10 hover:text-red-400 transition-all font-bold"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-semibold">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}