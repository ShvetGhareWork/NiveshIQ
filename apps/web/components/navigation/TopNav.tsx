'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
    Inbox,
    CircleDot,
    Heart,
    Trash2
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface TopNavProps {
    userName?: string;
    customLinks?: { label: string; href: string; icon?: React.ReactNode }[];
}

export function TopNav({ userName: propsUserName, customLinks }: TopNavProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const { wishlist, removeFromWishlist } = useWishlist();
    const userName = propsUserName || user?.name || 'Operator';
    const pathname = usePathname();
    const [currentHash, setCurrentHash] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotiDropdown, setShowNotiDropdown] = useState(false);
    const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);
    const wishlistRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleHashChange = () => {
            const hash = typeof window !== 'undefined' ? window.location.hash : '';
            setCurrentHash(hash);
        };

        handleHashChange(); // Initial check
        window.addEventListener('hashchange', handleHashChange, { passive: true });
        window.addEventListener('popstate', handleHashChange, { passive: true });
        
        // Final fallback: also check hash periodically if navigation is soft
        const interval = setInterval(handleHashChange, 500);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
            clearInterval(interval);
        };
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
            if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
                setShowWishlistDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: <Home size={18} />, label: 'Overview', href: '/dashboard' },
        { icon: <Inbox size={18} />, label: 'Portfolio X-Ray', href: '/dashboard/portfolio' },
        { icon: <Shield size={18} />, label: 'Money Health', href: '/dashboard/health' },
        { icon: <TrendingUp size={18} />, label: 'Analytics', href: '/dashboard/analytics' },
        { icon: <BarChart3 size={18} />, label: 'Market Trends', href: '/dashboard/market' },
        { icon: <CircleDot size={18} />, label: 'Life Planner', href: '/dashboard/life-planner' },
        { icon: <Calculator size={18} />, label: 'Tax Wizard', href: '/dashboard/tax-wizard' },
        { icon: <Calendar size={18} />, label: 'Reports', href: '/dashboard/reports' },
        { icon: <BarChart3 size={18} />, label: 'FIRE Protocol', href: '/dashboard/fire' },
    ];

    return (
        <>
            <nav className="sticky top-0 z-40 bg-[#0A0F1E]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-10 py-4">
                <div className="flex items-center justify-between gap-4">

                    {/* Left - Mobile Menu Trigger & Navigation */}
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                        <button
                            id="mobile-menu-trigger"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-xl text-white/60 hover:text-accent hover:bg-white/5 transition-all shrink-0"
                        >
                            <Menu size={20} />
                        </button>


                        {/* Custom Links */}
                        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-accent/20 min-w-0 pb-1">
                            <div className="flex items-center gap-8 min-w-max pr-4">
                                {customLinks?.map((item) => {
                                    const normalizeLink = (href: string) => href.includes('#') ? href.substring(href.indexOf('#')) : href;
                                    const isActive = 
                                        currentHash === item.href || 
                                        (currentHash && normalizeLink(item.href) === currentHash) ||
                                        (!currentHash && item.href.includes('#account'));

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight font-barlow transition-all whitespace-nowrap border-b-2 py-1 
                                                ${isActive ? 'text-accent border-accent' : 'text-white/40 hover:text-white/90 border-transparent'}
                                            `}
                                        >
                                            {item.icon && (
                                                <span className="opacity-70">
                                                    {item.icon}
                                                </span>
                                            )}
                                            <span className="hidden lg:inline">{item.label}</span>
                                            <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right - Icons */}
                    <div className="flex items-center gap-4 shrink-0 px-2 sm:px-4">
                        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                            <Link href="/dashboard/market/search" title="Search Node">
                                <button className="p-2 rounded-xl text-white/40 hover:text-accent hover:bg-white/5 transition-all outline-none">
                                    <Search size={18} />
                                </button>
                            </Link>

                            <div className="relative" ref={notiRef}>
                                <button
                                    id="noti-trigger"
                                    onClick={() => setShowNotiDropdown(!showNotiDropdown)}
                                    className="p-2 rounded-xl text-white/40 hover:text-accent hover:bg-white/5 transition-all relative outline-none"
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1.5 w-4 h-4 bg-accent text-background text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0F1E]">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotiDropdown && (
                                    <div className="fixed sm:absolute top-[70px] sm:top-full left-4 right-4 sm:left-auto sm:-right-2 sm:mt-4 w-auto sm:w-80 bg-[#0D111D]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-tight">Live Intel Feed</h4>
                                            {notifications.length > 0 && (
                                                <button onClick={() => markAllAsRead()} className="text-[8px] font-black text-accent uppercase tracking-widest hover:opacity-100 opacity-60">MUTE ALL</button>
                                            )}
                                        </div>
                                        <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto no-scrollbar">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer ${!n.read ? 'bg-accent/5' : ''}`} onClick={() => {
                                                        markAsRead(n.id);
                                                        if (n.link) router.push(n.link);
                                                    }}>
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-accent animate-pulse' : 'bg-white/10'}`} />
                                                            <div className="space-y-1 pr-2">
                                                                <p className="text-[11px] font-black text-white uppercase tracking-normal leading-none">{n.title}</p>
                                                                <p className="text-[10px] font-bold text-white/50 leading-relaxed line-clamp-2 italic uppercase">{n.message}</p>
                                                                <p className="text-[8px] font-black text-white/20 uppercase">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No Intel Captured</p>
                                                </div>
                                            )}
                                        </div>
                                        <Link href="/dashboard/notifications" className="block p-3 text-center border-t border-white/5 hover:bg-accent/5 transition-all rounded-b-2xl">
                                            <span className="text-[9px] font-black text-accent uppercase tracking-[0.3em]">DECRYPT ALL INTEL</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={wishlistRef}>
                                <button
                                    onClick={() => setShowWishlistDropdown(!showWishlistDropdown)}
                                    className="p-2 rounded-xl text-white/40 hover:text-accent hover:bg-white/5 transition-all relative outline-none"
                                    title="Watchlist"
                                >
                                    <Heart size={18} />
                                    {wishlist.length > 0 && (
                                        <span className="absolute top-1 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0F1E]">
                                            {wishlist.length}
                                        </span>
                                    )}
                                </button>

                                {showWishlistDropdown && (
                                    <div className="fixed sm:absolute top-[70px] sm:top-full left-4 right-4 sm:left-auto sm:-right-2 sm:mt-4 w-auto sm:w-80 bg-[#0D111D]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 border-b border-white/5">
                                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-tight">Active Watchlist</h4>
                                        </div>
                                        <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto no-scrollbar">
                                            {wishlist.length > 0 ? (
                                                wishlist.map(stock => (
                                                    <div key={stock.symbol} className="p-4 border-b border-white/5 hover:bg-white/[0.04] transition-all flex items-center justify-between group">
                                                        <div 
                                                            className="flex-1 cursor-pointer"
                                                            onClick={() => {
                                                                router.push(`/dashboard/market/stock/${stock.symbol}`);
                                                                setShowWishlistDropdown(false);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[11px] font-black text-white uppercase tracking-normal leading-none">{stock.symbol}</p>
                                                                <span className={`text-[9px] font-bold ${(stock.change_percent || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                    {(stock.change_percent || 0) >= 0 ? '+' : ''}{(stock.change_percent || 0).toFixed(2)}%
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] font-bold text-white/50 leading-relaxed truncate uppercase mt-1">{stock.name}</p>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeFromWishlist(stock.symbol);
                                                                addNotification({
                                                                    title: 'INTEL REDACTED',
                                                                    message: `${stock.symbol} REMOVED FROM ACTIVE WATCHLIST.`,
                                                                    type: 'info'
                                                                });
                                                            }}
                                                            className="p-2 text-white/20 hover:text-rose-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No Stocks Tracked</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/dashboard/settings" title="System Settings">
                                <button className="p-2 rounded-xl text-white/40 hover:text-accent hover:bg-white/5 transition-all hidden sm:block">
                                    <Settings size={18} />
                                </button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 pl-2 shrink-0">
                            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest hidden lg:block truncate max-w-[120px]">
                                {userName}
                            </span>
                            <Link href="/dashboard/settings" title="Profile Node" id="profile-trigger">
                                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 text-accent flex items-center justify-center font-black text-xs hover:border-accent/40 transition-all shadow-lg active:scale-95">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#0A0F1E]/60 backdrop-blur-sm md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Content */}
            <div className={`fixed top-0 left-0 bottom-0 z-[60] w-[300px] bg-[#0A0F1E] border-r border-white/5 transform transition-transform duration-500 md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 pb-10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/10 shadow-lg p-1">
                            <img src="/logo.png" alt="NiveshIQ" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-xl font-black font-barlow-condensed tracking-tight text-accent uppercase">NIVESHIQ</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 -mr-2 rounded-xl text-white/40 hover:text-white transition-all active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 
                                    ${isActive
                                        ? 'bg-white/[0.04] text-accent border border-accent/20 shadow-[0_0_20px_rgba(212,175,55,0.05)]'
                                        : 'text-white/40 hover:bg-white/[0.02] hover:text-white/90'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-[12px] font-bold font-barlow tracking-tight">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-6 mt-auto border-t border-white/5 space-y-2 shrink-0">
                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${pathname === '/dashboard/settings' ? 'text-accent' : 'text-white/40 hover:text-white/90'}`}
                    >
                        <Settings size={18} />
                        <span className="text-[12px] font-bold font-barlow tracking-[0.05em]">Settings</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white/40 hover:text-rose-400 transition-all font-bold duration-300"
                    >
                        <LogOut size={18} />
                        <span className="text-[12px] font-bold font-barlow tracking-[0.05em]">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}