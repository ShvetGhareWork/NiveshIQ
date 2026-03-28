'use client';

import { usePathname } from 'next/navigation';
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
    Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TopNavProps {
    userName?: string;
    customLinks?: { label: string; href: string; icon?: React.ReactNode }[];
}

export function TopNav({ userName: propsUserName, customLinks }: TopNavProps) {
    const { user, logout } = useAuth();
    const userName = propsUserName || user?.name || 'Operator';
    const pathname = usePathname();
    const [currentHash, setCurrentHash] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleHash = () => setCurrentHash(window.location.hash);
        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    // Close menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const menuItems = [
        { icon: Home, label: 'Overview', href: '/dashboard' },
        { icon: Shield, label: 'Money Health', href: '/dashboard/health' },
        { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
        { icon: Target, label: 'Life Planner', href: '/dashboard/life-planner' },
        { icon: Calculator, label: 'Tax Wizard', href: '/dashboard/tax-wizard' },
        { icon: Calendar, label: 'Reports', href: '/dashboard/reports' },
        { icon: BarChart3, label: 'FIRE Protocol', href: '/dashboard/fire' },
        { icon: Shield, label: 'Legal Archives', href: '/disclaimer' },
        { icon: Users, label: 'Support', href: '/dashboard/support' },
    ];

    return (
        <>
            <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left - Mobile Menu Trigger & Navigation */}
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-all"
                        >
                            <Menu size={20} />
                        </button>
                        
                        <div className="flex-1 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-6 md:gap-8 min-w-max pr-6">
                                {customLinks?.map((item) => {
                                    const isActive = currentHash === item.href || (pathname === item.href && !currentHash);
                                    
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] font-barlow-condensed transition-all whitespace-nowrap ${isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-muted-foreground hover:text-foreground pb-1'}`}
                                        >
                                            {item.icon && <span className="opacity-70">{item.icon}</span>}
                                            <span className="hidden sm:inline">{item.label}</span>
                                            <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right - Icons */}
                    <div className="flex items-center gap-2 sm:gap-5">
                        <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-4 border-r border-border/50">
                            <button className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-all hidden sm:block">
                                <Search size={18} />
                            </button>
                            <button className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-all">
                                <Bell size={18} />
                            </button>
                            <button className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-all hidden sm:block">
                                <Settings size={18} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 pl-2">
                            <span className="text-sm font-medium text-muted-foreground hidden lg:block">
                                {userName}
                            </span>
                            <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center font-bold text-xs sm:text-sm hover:bg-accent hover:text-primary transition-all">
                                {userName.charAt(0).toUpperCase()}
                            </button>
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
            <div className={`fixed top-0 left-0 bottom-0 z-[60] w-[280px] bg-card border-r border-border/50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30">
                                <span className="text-accent font-bold text-lg">N</span>
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

                    <div className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
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
                                    <Icon size={18} />
                                    <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-border/50 space-y-1.5">
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
            </div>
        </>
    );
}

